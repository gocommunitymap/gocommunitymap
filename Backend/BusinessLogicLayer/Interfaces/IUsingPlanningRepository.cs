using BusinessLogicLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public interface IUsingPlanningRepository
    {
        public object GetUsingPlanning(UsingPlanning usingPlanning);
        public object CreateUsingPlanning(UsingPlanning usingPlanning);
        public object UpdateUsingPlanning(UsingPlanning usingPlanning);
        public object DeleteUsingPlanning(UsingPlanning usingPlanning);
    }
}
