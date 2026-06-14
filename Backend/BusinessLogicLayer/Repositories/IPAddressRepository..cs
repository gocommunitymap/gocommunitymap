using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using BusinessLogicLayer.Interfaces;

namespace BusinessLogicLayer.Repositories
{
    public class IPAddressRepository:IIPAddressRepository
    {

        private readonly ILogService _logService;
        public IPAddressRepository(ILogService logService)
        {
            _logService = logService;
        }
        public object GetLocalIPAddress()
        {
            try
            {
                if (!NetworkInterface.GetIsNetworkAvailable())
                    return new[] { "No network available!" };

                var host = Dns.GetHostEntry(Dns.GetHostName());

                var result = new List<string>();

                // Take max 2 IPs
                for (int i = 0; i < host.AddressList.Length && result.Count < 2; i++)
                {
                    result.Add(host.AddressList[i].ToString());
                }

                // Add hostname as last item (3rd max)
                result.Add(host.HostName);

                return result.ToArray();
            }
            catch
            {
                throw;
            }
        }

    }
}
