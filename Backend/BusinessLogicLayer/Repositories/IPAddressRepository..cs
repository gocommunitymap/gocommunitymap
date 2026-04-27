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
        public object GetLocalIPAddress()
        {
            try
            {
                if (NetworkInterface.GetIsNetworkAvailable())
                {
                    var host = Dns.GetHostEntry(Dns.GetHostName());
                    string[] list = new string[3];
                    for (int i = 0; i < host.AddressList.Length; i++)
                    {
                        if (list.Length > i)
                        {
                            list[i] = host.AddressList[i].ToString();
                        }
                    }
                    list[host.AddressList.Length] = host.HostName;

                    return list;
                }
                else
                {
                    return "No network available!";
                }
            }
            catch (Exception)
            {

                throw;
            }


        }

    }
}
