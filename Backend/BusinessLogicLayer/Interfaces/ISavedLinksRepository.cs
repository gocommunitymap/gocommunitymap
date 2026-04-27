using BusinessLogicLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public interface ISavedLinksRepository
    {
        public object GetSavedLinks(SavedLinks savedLinks);
        public object PostSavedLinks(SavedLinks savedLinks);
        public object DeleteSavedLinks(SavedLinks savedLinks);
    }
}
