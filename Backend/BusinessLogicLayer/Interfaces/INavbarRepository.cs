using BusinessLogicLayer.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Interfaces
{
    public interface INavbarRepository
    {
        public object GetNavbar(Navbar navbarData);
        public object CreateNavbar(Navbar navbarData);
        public object UpdateNavbar(Navbar navbarData);
        public object DeleteNavbar(Navbar navbarData);

    }
}
