import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";



const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  return (
    <>

      <div className={` navbar_outer w-full h-12 flex justify-center items-center ${show ? "navbar show_navbar" : "navbar"} `}>
        <div className="navbar_inner_container container w-[95%] h-full flex justify-between items-center">
          <div><NavLink to="/"><img src="/logo.png" alt="logo" className="h-full w-12" /></NavLink></div>
          <div className="list-none flex justify-start gap-6">
            <li> <NavLink to={"/"} onClick={() => setShow(!show)}> HOME </NavLink> </li>
            <li> <NavLink to={"/jobs"} onClick={() => setShow(!show)} className={`${(user[0]?.role == "Employer")?"hidden":""}`}> JOBS </NavLink> </li>
            {
              isAuthenticated ? <li> <NavLink to={"/dashboard"} onClick={() => setShow(!show)}> DASHBOARD </NavLink> </li>
                : (<li> <NavLink to={"/login"} onClick={() => setShow(!show)}> LOGIN </NavLink> </li>
                )}
          </div>
        </div>
        <GiHamburgerMenu className="hamburger hidden mx-8" onClick={() => setShow(!show)} />
      </div>
    </>
  );
};

export default Navbar;
