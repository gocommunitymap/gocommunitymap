using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Config
{
    public static class DatabaseObjects
    {
        public enum Actions { ACTION1, ACTION2, ACTION3, ACTION4, ACTION5, FETCH, FETCH_M, FETCH_D,FETCH2, FETCH3, FETCH4, FETCH5, INSERT, UPDATE, DELETE, APPROVE, REJECT, CHANGEPWD, AUTH, LOGIN }
        public enum Procedures
        {
            SP_SET_NAVBAR,
            SP_SET_SECTIONS,
            SP_SET_NEWS,
            SP_SET_DISCOVER_SECTION,
            SP_SET_USER,
            SP_SET_ROLE,
            SP_AUTH,
            SP_SET_FEATURES,
            SP_SET_PROPERTIES,
            SP_GET_PROPERTIES,
            SP_SET_GLOBAL_PARAMETERS,
            SP_SET_CUSTOM_FEATURES,
            SP_MANAGE_PASSWORD,
            SP_SET_SAVED_LINKS,
            SP_SET_UTILITIES,
            SP_USING_AND_PLANNING,
            SP_GET_PLACES,
            SP_SET_ROOMS,
            SP_PAYMENT,
            SP_HOTEL_BOOKINGS,
            SP_GET_EMAILCONFIG,
            SP_SET_COMMUNITIES,
            SP_BOOKING_CALENDAR
        }
    }
}
