# Windows IIS Deployment Guide — Next.js SSR (Standalone via iisnode)

This app uses `output: 'standalone'` in `next.config.js` and is hosted on IIS using **iisnode**, which runs the Node.js process inside the IIS worker pipeline. A `web.config` is already included in the project root.

---

## Requirements

| Tool                                  | Version                            |
| ------------------------------------- | ---------------------------------- |
| Windows Server                        | 2016 / 2019 / 2022                 |
| IIS                                   | 8.5+ (Web Server role)             |
| Node.js                               | 18.x LTS or 20.x LTS               |
| iisnode                               | 0.2.26+                            |
| URL Rewrite Module                    | 2.1+                               |
| IIS Application Request Routing (ARR) | 3.0+ (optional, for reverse proxy) |

---

## 1. Install IIS

Open **PowerShell as Administrator**:

```powershell
Install-WindowsFeature -Name Web-Server, Web-Mgmt-Console, Web-Scripting-Tools -IncludeAllSubFeature
```

Or via **Server Manager → Add Roles and Features → Web Server (IIS)** — enable:

- Common HTTP Features (Static Content, Default Document, Directory Browsing, HTTP Errors, HTTP Redirection)
- Application Development (CGI, ISAPI Extensions, ISAPI Filters, WebSocket Protocol)
- Security (Request Filtering)
- Performance (Static Content Compression)

---

## 2. Install Node.js

Download and install from https://nodejs.org/en/download (Windows x64 LTS).

Verify:

```powershell
node -v
npm -v
```

---

## 3. Install iisnode

Download the latest iisnode installer from:  
https://github.com/tjanczuk/iisnode/releases

Run `iisnode-full-v0.2.26-x64.msi` (or latest).

Verify installation — the `iisnode.dll` should appear in:

```
C:\Program Files\iisnode\
```

---

## 4. Install URL Rewrite Module

Download from:  
https://www.iis.net/downloads/microsoft/url-rewrite

Install and restart IIS:

```powershell
iisreset
```

---

## 5. Build the Application

On your **development machine** (or a build agent):

```powershell
cd D:\[actual path]\application
npm install
npm run build
```

This produces `.next/standalone/` — the self-contained server bundle.

---

## 6. Prepare the Deployment Folder

Create the site folder on the server (adjust path as needed):

```powershell
New-Item -ItemType Directory -Force -Path "C:\inetpub\wwwroot\nextjs-app"
```

Copy the following from your build output into `C:\inetpub\wwwroot\nextjs-app\`:

```
Source (after npm run build)           →   Destination on server
─────────────────────────────────────────────────────────────────
.next\standalone\          (entire folder)  →  C:\inetpub\wwwroot\nextjs-app\
.next\static\              (entire folder)  →  C:\inetpub\wwwroot\nextjs-app\.next\static\
public\                    (entire folder)  →  C:\inetpub\wwwroot\nextjs-app\public\
web.config                                 →  C:\inetpub\wwwroot\nextjs-app\web.config
```

> **Important:** The standalone bundle does NOT include `public/` or `.next/static/` — you must copy them manually.

Final folder layout on the server:

```
C:\inetpub\wwwroot\nextjs-app\
├── server.js              ← standalone Next.js entry point
├── node_modules\          ← bundled (minimal) dependencies
├── web.config             ← IIS + iisnode configuration
├── .next\
│   └── static\            ← copied manually
└── public\                ← copied manually
```

---

## 7. Configure `web.config`

The `web.config` in the project root is already set up for iisnode. Verify/update the `<iisnode>` element paths to match your server:

```xml
<iisnode
  node_env="production"
  loggingEnabled="true"
  logDirectory="C:\inetpub\wwwroot\nextjs-app\log"
  nodeProcessCommandLine="&quot;C:\Program Files\nodejs\node.exe&quot;"
/>
```

Key points:

- `path="server.js"` in `<handlers>` — iisnode will execute `server.js` in the site root (the standalone entry point).
- The URL Rewrite rules route static files from `public/` and forward everything else to `server.js`.

---

## 8. Environment Variables

Set environment variables at the **IIS Application Pool** level via `web.config` using `<environmentVariables>` inside the `<iisnode>` block, or set them as Windows system environment variables.

### Option A — via `web.config` (recommended)

Add inside `<system.webServer>`:

```xml
<iisnode node_env="production" ... >
  <iisnode.yml>
    env:
      PORT: 3000
      NEXT_PUBLIC_API_URL: https://api.yourdomain.com
  </iisnode.yml>
</iisnode>
```

### Option B — Windows System Environment Variables

```powershell
[System.Environment]::SetEnvironmentVariable("NODE_ENV", "production", "Machine")
[System.Environment]::SetEnvironmentVariable("NEXT_PUBLIC_API_URL", "https://api.yourdomain.com", "Machine")
```

Restart IIS after setting machine-level variables:

```powershell
iisreset
```

---

## 9. Create IIS Site

### Via IIS Manager (GUI)

1. Open **IIS Manager** → right-click **Sites** → **Add Website**
2. Set:
   - **Site name:** `nextjs-app`
   - **Physical path:** `C:\inetpub\wwwroot\nextjs-app`
   - **Binding:** HTTP on port 80 (or 443 for HTTPS)
   - **Host name:** `yourdomain.com`
3. Click OK.

### Via PowerShell

```powershell
Import-Module WebAdministration

New-WebAppPool -Name "nextjs-app"
Set-ItemProperty IIS:\AppPools\nextjs-app -Name processModel.userName -Value "ApplicationPoolIdentity"
Set-ItemProperty IIS:\AppPools\nextjs-app -Name managedRuntimeVersion -Value ""

New-Website -Name "nextjs-app" `
            -Port 80 `
            -HostHeader "yourdomain.com" `
            -PhysicalPath "C:\inetpub\wwwroot\nextjs-app" `
            -ApplicationPool "nextjs-app"
```

---

## 10. Set Folder Permissions

Grant the Application Pool identity read/execute rights:

```powershell
$acl = Get-Acl "C:\inetpub\wwwroot\nextjs-app"
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
    "IIS AppPool\nextjs-app", "ReadAndExecute", "ContainerInherit,ObjectInherit", "None", "Allow"
)
$acl.SetAccessRule($rule)
Set-Acl "C:\inetpub\wwwroot\nextjs-app" $acl
```

Grant write access to the log folder:

```powershell
New-Item -ItemType Directory -Force "C:\inetpub\wwwroot\nextjs-app\log"

$acl = Get-Acl "C:\inetpub\wwwroot\nextjs-app\log"
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
    "IIS AppPool\nextjs-app", "Modify", "ContainerInherit,ObjectInherit", "None", "Allow"
)
$acl.SetAccessRule($rule)
Set-Acl "C:\inetpub\wwwroot\nextjs-app\log" $acl
```

---

## 11. SSL / HTTPS

### Self-signed (dev/testing only)

```powershell
New-SelfSignedCertificate -DnsName "yourdomain.com" -CertStoreLocation "cert:\LocalMachine\My"
```

### Production — Use a trusted certificate

1. Obtain a certificate (e.g., from DigiCert, Sectigo, or Let's Encrypt via [win-acme](https://www.win-acme.com/))
2. Import into **IIS Manager → Server Certificates**
3. Add an HTTPS binding to the site:

```powershell
# After importing cert, get its thumbprint
$thumb = (Get-ChildItem Cert:\LocalMachine\My | Where-Object { $_.Subject -like "*yourdomain.com*" }).Thumbprint

New-WebBinding -Name "nextjs-app" -Protocol "https" -Port 443 -HostHeader "yourdomain.com"
$binding = Get-WebBinding -Name "nextjs-app" -Protocol "https"
$binding.AddSslCertificate($thumb, "My")
```

### Let's Encrypt via win-acme (free, auto-renewing)

```powershell
# Download win-acme from https://github.com/win-acme/win-acme/releases
# Run as Administrator:
.\wacs.exe --target iis --siteid <YOUR_SITE_ID> --installation iis
```

---

## 12. HTTP → HTTPS Redirect

Add a redirect rule inside `web.config` `<rules>` (before other rules):

```xml
<rule name="HTTP to HTTPS" stopProcessing="true">
  <match url="(.*)" />
  <conditions>
    <add input="{HTTPS}" pattern="^OFF$" />
  </conditions>
  <action type="Redirect" url="https://{HTTP_HOST}/{R:1}" redirectType="Permanent" />
</rule>
```

---

## 13. Windows Firewall

```powershell
# Allow HTTP and HTTPS through Windows Firewall
New-NetFirewallRule -DisplayName "HTTP (80)"  -Direction Inbound -Protocol TCP -LocalPort 80  -Action Allow
New-NetFirewallRule -DisplayName "HTTPS (443)" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow
```

---

## 14. Re-deploy (Update)

```powershell
# 1. Stop the IIS site to release file locks
Stop-Website -Name "nextjs-app"

# 2. Copy new build artefacts
Copy-Item -Recurse -Force ".next\standalone\*"  "C:\inetpub\wwwroot\nextjs-app\"
Copy-Item -Recurse -Force ".next\static\"        "C:\inetpub\wwwroot\nextjs-app\.next\static\"
Copy-Item -Recurse -Force "public\"              "C:\inetpub\wwwroot\nextjs-app\public\"

# 3. Restart the site
Start-Website -Name "nextjs-app"
```

---

## 15. Logs & Troubleshooting

iisnode logs are written to the `log\` folder inside the site root.

| Symptom                              | Fix                                                                                  |
| ------------------------------------ | ------------------------------------------------------------------------------------ |
| **500.1001** iisnode error           | Node.js path wrong in `<iisnode nodeProcessCommandLine=...>`                         |
| **500.19** config error              | `web.config` XML syntax error — validate with `appcmd validate config`               |
| **404** on `_next/static` assets     | `.next\static\` not copied to server                                                 |
| **404** on `public/` assets          | `public\` not copied to server                                                       |
| Static files served as Node response | URL Rewrite Module not installed                                                     |
| App not restarting after deploy      | iisnode file-watch not enabled — add `watchedFiles="web.config;*.js"` to `<iisnode>` |
| Environment vars not available       | Set at machine level + run `iisreset`                                                |
| Logs not written                     | Check folder write permissions for `IIS AppPool\nextjs-app` on `log\`                |

Check iisnode logs:

```powershell
Get-Content "C:\inetpub\wwwroot\nextjs-app\log\*.txt" -Tail 50
```

Check IIS failed request tracing:

```powershell
# Enable in IIS Manager → site → Failed Request Tracing Rules
# Or via PowerShell:
Enable-WebRequestTracing -Name "nextjs-app"
```
