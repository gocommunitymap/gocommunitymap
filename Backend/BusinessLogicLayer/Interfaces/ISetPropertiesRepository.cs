using BusinessLogicLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public interface ISetPropertiesRepository
    {
        public object GetProperty(SetProperties setProperties);
        public object CreateProperty(SetProperties setProperties);
        public object UpdateProperty(SetProperties setProperties);
        public object DeleteProperty(SetProperties setProperties);
    }
}
