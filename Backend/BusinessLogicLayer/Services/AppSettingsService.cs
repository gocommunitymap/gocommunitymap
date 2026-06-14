using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Services
{
    public class AppSettingsService: IAppSettingsService
    {
        private readonly AppSettings _settings = new();

        public AppSettingsService(IConfiguration configuration)
        {
            // Manually map configuration values to avoid requiring Microsoft.Extensions.Configuration.Binder
            _settings.Jwt = new JwtSettings
            {
                Issuer = configuration["Jwt:Issuer"],
                Audience = configuration["Jwt:Audience"],
                Secret = configuration["Jwt:Secret"],
                ENC1 = configuration["Jwt:ENC1"],
                ENC2 = configuration["Jwt:ENC2"],
                ENC3 = configuration["Jwt:ENC3"],
                TokenValidityInMinutes = int.TryParse(configuration["Jwt:TokenValidityInMinutes"], out var t) ? t : 0,
                RefreshTokenValidityInMinutes = int.TryParse(configuration["Jwt:RefreshTokenValidityInMinutes"], out var r) ? r : 0
            };

            _settings.ConnectionStrings = new ConnectionStrings
            {
                MSSQL_CONNECTION_STRINGS = configuration["ConnectionStrings:MSSQL_CONNECTION_STRINGS"]
            };

            _settings.Logging = new LoggingSettings
            {
                IsLog = configuration["Logging:isLog"],
                Log_Dir = configuration["Logging:log_dir"],
                LogLevel = new LogLevel
                {
                    Default = configuration["Logging:LogLevel:Default"],
                    MicrosoftAspNetCore = configuration["Logging:LogLevel:Microsoft.AspNetCore"]
                }
            };

            _settings.Files = new FilesSettings
            {
                DefaultFilePath = configuration["Files:DefaultFilePath"],
                DefaultFileName = configuration["Files:DefaultFileName"]
            };

            _settings.MailSettings = new MailSettings
            {
                Disabled = configuration["MailSettings:Disabled"],
                Server = configuration["MailSettings:Server"],
                Port = int.TryParse(configuration["MailSettings:Port"], out var p) ? p : 0,
                SenderName = configuration["MailSettings:SenderName"],
                AppName = configuration["MailSettings:AppName"],
                SenderEmail = configuration["MailSettings:SenderEmail"],
                UserName = configuration["MailSettings:UserName"],
                Password = configuration["MailSettings:Password"],
                TestEmail = configuration["MailSettings:TestEmail"]
            };

            // JSON in your example uses the key "EmailTemplete" (typo). Support both keys.
            _settings.EmailTemplate = new EmailTemplate
            {
                BasePath = configuration["EmailTemplete:BasePath"] ?? configuration["EmailTemplate:BasePath"],
            };

            _settings.Stripe = new StripeSettings
            {
                PublishableKey = configuration["Stripe:PublishableKey"],
                SecretKey = configuration["Stripe:SecretKey"],
                WebhookSecret = configuration["Stripe:WebhookSecret"]
            };

            _settings.AllowedHosts = configuration["AllowedHosts"];
            _settings.Database = configuration["database"];
        }

        public AppSettings GetAppSettings() => _settings;
        public JwtSettings GetJwtSettings() => _settings.Jwt;
        public ConnectionStrings GetConnectionStrings() => _settings.ConnectionStrings;
        public LoggingSettings GetLoggingSettings() => _settings.Logging;
        public FilesSettings GetFilesSettings() => _settings.Files;
        public MailSettings GetMailSettings() => _settings.MailSettings;
        public EmailTemplate GetEmailTemplate() => _settings.EmailTemplate;
        public StripeSettings GetStripeSettings() => _settings.Stripe;
        public string? GetAllowedHosts() => _settings.AllowedHosts;
        public string? GetDatabase() => _settings.Database;
    }
}
