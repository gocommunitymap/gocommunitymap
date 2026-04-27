using BusinessLogicLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public interface ICustomFeaturesRepository
    {
        public object getCustomFeatures(CustomFeatures customFeatures);
        public object createCustomFeatures(CustomFeatures customFeatures);
        public object updateCustomFeatures(CustomFeatures customFeatures);
        public object deleteCustomFeatures(CustomFeatures customFeatures);
    }
}
