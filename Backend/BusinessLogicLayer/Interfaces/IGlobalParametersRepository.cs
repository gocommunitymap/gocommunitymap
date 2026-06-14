using BusinessLogicLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public interface IGlobalParametersRepository
    {
        public object getGlobalParameters(GlobalParameters globalParameters);
        public object GetGlobalParametersByTypeCodes(String? TYPE_CODES);
        public object createGlobalParameters(GlobalParameters globalParameters);
        public object updateGlobalParameters(GlobalParameters globalParameters);
        public object deleteGlobalParameters(GlobalParameters globalParameters);
    }
}
