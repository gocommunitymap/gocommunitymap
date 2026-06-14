using BusinessLogicLayer.Models;
using BusinessLogicLayer.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public class FileServiceRepository : IFileServiceRepository
    {
        private readonly IHostingEnvironment hostingEnvironment;
        private string defaultFileName = "";
        private string defaultFilePath = "";
        private string path = "";

        public FileServiceRepository(IAppSettingsService appSettingsService, IHostingEnvironment hostingEnvironment)
        {
            var filesSettings = appSettingsService.GetFilesSettings();
            hostingEnvironment = hostingEnvironment;
            defaultFileName = filesSettings.DefaultFileName;
            defaultFilePath = filesSettings.DefaultFilePath;
            path = hostingEnvironment.ContentRootPath.Substring(0, hostingEnvironment.ContentRootPath.LastIndexOf("\\") + 1);

        }
        public int CalculateChar(char[] arr, string value)
        {
            int r = 0;
            for (int i = 0; i < arr.Length; i++)
            {
                if (arr[i].ToString() == value)
                {
                    r++;
                }
            }
            return r;
        }
        public async Task<dynamic> PostFile(string dir, string fileName, IFormFile fileData)
        {
            try
            {
                
                if (!Directory.Exists(defaultFilePath + dir))
                {
                    Directory.CreateDirectory(defaultFilePath + dir);
                }
                string[] defaultFile = System.IO.Directory.GetFiles(defaultFilePath, defaultFileName);
                string[] files = System.IO.Directory.GetFiles(defaultFilePath + dir, fileName + ".*");
                for (int i = 0; i < files.Length; i++)
                {
                    if (files.Length > 0)
                    {
                        File.Delete(files[i]);
                    }
                }
                
                string filePath = "";
                if (fileData != null)
                {
                    int startIndex = fileData.FileName.LastIndexOf('.');
                    int length = fileData.FileName.Length;
                    string fileExt = fileData.FileName.Substring(startIndex, length - startIndex);
                    filePath = Path.Combine(defaultFilePath + dir, fileName + fileExt);
                    using (var stream = new FileStream(filePath, FileMode.Create))

                    {
                        await fileData.CopyToAsync(stream);


                    }
                        return new { MESSAGE = "Uploaded" };
                }
                //else
                //{
                //    foreach (var filename in defaultFile)
                //    {
                //        string file = filename.ToString();
                //        int startIndex = defaultFileName.LastIndexOf('.');
                //        int length = defaultFileName.Length;
                //        string fileExt = defaultFileName.Substring(startIndex, length - startIndex);

                //        string str = defaultFilePath + dir + "/" + fileName + fileExt;
                //        if (!File.Exists(str))
                //        {
                //            File.Copy(file, str);

                //        }
                //    }
                //}
                return new { ERROR = "Something Went Wrong!" };
            }
            catch (Exception ex)
            {

                throw;

            }
        }
        public void DeleteFile(string dir, string fileName)
        {
            try
            {
                var filePath = Path.Combine(defaultFilePath + dir, fileName);

                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public byte[] GetFile(string dir, string fileName)
        {
            try
            {

                byte[] fileBytes = System.IO.File.ReadAllBytes(defaultFilePath + dir + "/" + fileName);
                return fileBytes;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
