using BusinessLogicLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public interface ISetRoomsRepository
    {
        public object GetRooms(SetRooms setRooms);
        public object CreateRoom(SetRooms setRooms);
        public object UpdateRoom(SetRooms setRooms);
        public object DeleteRoom(SetRooms setRooms);
    }
}
