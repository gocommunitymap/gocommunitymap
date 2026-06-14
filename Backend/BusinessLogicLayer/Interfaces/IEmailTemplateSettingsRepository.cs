using BusinessLogicLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public interface IEmailTemplateSettingsRepository
    {
        public EmailTemplateSettings GetEmailTemplateSettings(string code);
    }
}
