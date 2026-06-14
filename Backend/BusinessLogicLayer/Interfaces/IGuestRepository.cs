using BusinessLogicLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public interface IGuestRepository
    {
        public object GetPropertiesFullDetails(GetProperties getProperties, int PAGE_NUMBER, int PAGE_SIZE);

        public object GetProperties(GetPropertiesFilters getProperties, int PAGE_NUMBER, int PAGE_SIZE);
        public object GetPropertiesForMap(GetPropertiesFiltersForMap getProperties);

        public object GetPropertiesByUser(GetProperties getProperties);

        public object GetPlacesByPostCode(string FULLPOSTCODE);

    }
}
