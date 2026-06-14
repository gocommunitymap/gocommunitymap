using BusinessLogicLayer.Interfaces;
using BusinessLogicLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Repositories
{
    public class EncryptionRepository : IEncryptionRepository
    {
        private readonly JwtSettings jwtSettings;
        public EncryptionRepository(IAppSettingsService appSettingsService)
        {
            jwtSettings = appSettingsService.GetJwtSettings();
        }
        public string Encrypt(string data)
        {
            byte[] initializationVector = Encoding.ASCII.GetBytes(jwtSettings.ENC1.ToString());
            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(jwtSettings.ENC2.ToString());
                aes.IV = initializationVector;
                var symmetricEncryptor = aes.CreateEncryptor(aes.Key, aes.IV);
                using (var memoryStream = new MemoryStream())
                {
                    using (var cryptoStream = new CryptoStream(memoryStream as Stream,
                        symmetricEncryptor, CryptoStreamMode.Write))
                    {
                        using (var streamWriter = new StreamWriter(cryptoStream as Stream))
                        {
                            streamWriter.Write(data);
                        }
                        return Convert.ToBase64String(memoryStream.ToArray());
                    }
                }
            }
        }
        public string Encrypt(string data, string Key1)
        {

            int keyLength = jwtSettings.ENC2.ToString().Count();
            string newKey = jwtSettings.ENC2.ToString().Substring(0, keyLength - Key1.Count());
            string Key2 = newKey + Key1;

            byte[] initializationVector = Encoding.ASCII.GetBytes(Key1);
            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(Key2);
                aes.IV = initializationVector;
                var symmetricEncryptor = aes.CreateEncryptor(aes.Key, aes.IV);
                using (var memoryStream = new MemoryStream())
                {
                    using (var cryptoStream = new CryptoStream(memoryStream as Stream,
                        symmetricEncryptor, CryptoStreamMode.Write))
                    {
                        using (var streamWriter = new StreamWriter(cryptoStream as Stream))
                        {
                            streamWriter.Write(data);
                        }
                        return Convert.ToBase64String(memoryStream.ToArray());
                    }
                }
            }
        }

        public string Decrypt(string cipherText)
        {
            byte[] initializationVector = Encoding.ASCII.GetBytes(jwtSettings.ENC1);
            byte[] buffer = Convert.FromBase64String(cipherText);
            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(jwtSettings.ENC2);
                aes.IV = initializationVector;
                var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
                using (var memoryStream = new MemoryStream(buffer))
                {
                    using (var cryptoStream = new CryptoStream(memoryStream as Stream,
                        decryptor, CryptoStreamMode.Read))
                    {
                        using (var streamReader = new StreamReader(cryptoStream as Stream))
                        {
                            return streamReader.ReadToEnd();
                        }
                    }
                }
            }
        }
        public string Decrypt(string cipherText, string Key1)
        {
            int keyLength = jwtSettings.ENC2.ToString().Count();
            string newKey = jwtSettings.ENC2.ToString().Substring(0, keyLength - Key1.Count());
            string Key2 = newKey + Key1;

            byte[] initializationVector = Encoding.ASCII.GetBytes(Key1);
            byte[] buffer = Convert.FromBase64String(cipherText);
            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(Key2);
                aes.IV = initializationVector;
                var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
                using (var memoryStream = new MemoryStream(buffer))
                {
                    using (var cryptoStream = new CryptoStream(memoryStream as Stream,
                        decryptor, CryptoStreamMode.Read))
                    {
                        using (var streamReader = new StreamReader(cryptoStream as Stream))
                        {
                            return streamReader.ReadToEnd();
                        }
                    }
                }
            }
        }
    }
}
