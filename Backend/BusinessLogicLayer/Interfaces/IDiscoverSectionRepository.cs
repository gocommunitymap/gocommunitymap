using BusinessLogicLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public interface IDiscoverSectionRepository
    {
        public object GetDiscoverSection(DiscoverSectionMaster discoverSection);
        public object CreateDiscoverSection(DiscoverSection discoverSection);
        public object UpdateDiscoverSection(DiscoverSection DiscoverSection);
        public object DeleteDiscoverSection(DiscoverSectionMaster DiscoverSection);
    }
}
