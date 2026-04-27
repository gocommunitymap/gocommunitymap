using BusinessLogicLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public interface IFeaturesRepository
    {
        public object GetFeatures(Features features);
        public object CreateFeatures(Features features);
        public object UpdateFeatures(Features features);
        public object DeleteFeatures(Features features);
    }
}
