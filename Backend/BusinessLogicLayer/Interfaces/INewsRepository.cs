using BusinessLogicLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public interface INewsRepository
    {
        public object GetNews(News NewsData);
        public object GetNewsWithDetail(News NewsData);
        public object CreateNews(News NewsData);
        public object UpdateNews(News NewsData);
        public object DeleteNews(News NewsData);
    }
}
