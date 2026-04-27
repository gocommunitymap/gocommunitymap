using BusinessLogicLayer.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public interface IFileServiceRepository
    {
        public Task <dynamic> PostFile(string dir, string fileName, IFormFile fileData);
        public void DeleteFile(string dir, string fileName);
        public byte[] GetFile(string dir, string fileName);
    }
}
