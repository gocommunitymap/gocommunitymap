using BusinessLogicLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public interface ICommunitiesRepository
    {
        public object GetCommunities(Communities communities);
        public object CreateCommunities(Communities communities);

        public object UpdateCommunities(Communities communities);
        public object DeleteCommunities(Communities communities);

        public object GetCommunitiesMemberList();
        public object UpdateCommunitiesMemberList(int? COMMUNITY_ID, bool? ACTIVE);

    }
}
