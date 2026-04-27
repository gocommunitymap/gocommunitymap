using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public interface IEncryptionRepository
    {
        public string Encrypt(string data);
        public string Encrypt(string data, string Key1);
        public string Decrypt(string cipherText);
        public string Decrypt(string cipherText, string Key1);
    }
}
