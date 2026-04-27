using BusinessLogicLayer.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public interface IMailRepository
    {
        bool SendMail(MailData mailData);
        Task SendEmail2(MailRequest mailRequest);
    }
}
