using BusinessLogicLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public interface ISectionRepository
    {
        public object GetSections(Sections SectionData);
        public object CreateSection(Sections SectionData);
        public object UpdateSection(Sections SectionData);
        public object DeleteSection(Sections SectionData);
    }
}
