using Microsoft.IdentityModel.JsonWebTokens;
using Stripe.Apps;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class AppSettings
    {
        public JwtSettings Jwt { get; set; } = new();
        public ConnectionStrings ConnectionStrings { get; set; } = new();
        public LoggingSettings Logging { get; set; } = new();
        public string? AllowedHosts { get; set; }
        public string? Database { get; set; }
        public FilesSettings Files { get; set; } = new();
        public MailSettings MailSettings { get; set; } = new();
        public EmailTemplate EmailTemplate { get; set; } = new();
        public StripeSettings Stripe { get; set; } = new();
    }

    public class JwtSettings
    {
        public string? Issuer { get; set; }
        public string? Audience { get; set; }
        public string? Secret { get; set; }
        public string? ENC1 { get; set; }
        public string? ENC2 { get; set; }
        public string? ENC3 { get; set; }
        public int TokenValidityInMinutes { get; set; }
        public int RefreshTokenValidityInMinutes { get; set; }
    }

    public class ConnectionStrings
    {
        public string? MSSQL_CONNECTION_STRINGS { get; set; }
    }

    public class LoggingSettings
    {
        public string? IsLog { get; set; }
        public string? Log_Dir { get; set; }
        public LogLevel LogLevel { get; set; } = new();
    }

    public class LogLevel
    {
        public string? Default { get; set; }
        public string? MicrosoftAspNetCore { get; set; }
    }

    public class FilesSettings
    {
        public string? DefaultFilePath { get; set; }
        public string? DefaultFileName { get; set; }
    }

    public class MailSettings
    {
        public string? Disabled { get; set; }
        public string? Server { get; set; }
        public int Port { get; set; }
        public string? SenderName { get; set; }
        public string? AppName { get; set; }
        public string? SenderEmail { get; set; }
        public string? UserName { get; set; }
        public string? Password { get; set; }
        public string? TestEmail { get; set; }
    }

    public class EmailTemplate
    {
        public string? BasePath { get; set; }
    }

    public class StripeSettings
    {
        public string? PublishableKey { get; set; }
        public string? SecretKey { get; set; }
        public string? WebhookSecret { get; set; }
    }

}
