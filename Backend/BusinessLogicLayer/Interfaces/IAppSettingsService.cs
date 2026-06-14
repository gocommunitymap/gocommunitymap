using BusinessLogicLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public interface IAppSettingsService
    {
        public AppSettings GetAppSettings();
        public JwtSettings GetJwtSettings();
        public ConnectionStrings GetConnectionStrings();
        public LoggingSettings GetLoggingSettings();
        public FilesSettings GetFilesSettings();
        public MailSettings GetMailSettings();
        public EmailTemplate GetEmailTemplate();
        public StripeSettings GetStripeSettings();
        public string? GetAllowedHosts();
        public string? GetDatabase();
    }
}
