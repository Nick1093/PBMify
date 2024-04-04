import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserAuth } from "../Context/AuthContext";

import logo from "../images/PBMify.png";

import "../styles/navbar.css"

const Navbar = () => {
  const { user, logout } = UserAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false); // For the dropdown menu, false as default
  const toggleDropdown = () => {
    // changes state of dropdownOpen
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
      {user ? (
        <nav className="navBar-nav">
          <img src={logo} alt="Logo" style={{ width: "300px", height: "auto" }} />
          <ul>
            <li>
              <Link to="/home">Home</Link>{" "}
            </li>
            <li>
              <Link to="/friendfeed">Feed</Link>{" "}
            </li>
            <li>
              {" "}
              <Link to="/PBMify">PBMify</Link>
            </li>
            <li>
              {" "}
              <img
                src="../images/pfp.png"
                className="pfp"
                onClick={toggleDropdown}
                alt="pfp"
              />
              {dropdownOpen ? (
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/profile">View Profile</Link>
                  </li>
                  <li onClick={logout}> Sign Out</li>
                </ul>
              ) : null}
            </li>{" "}
          </ul>
        </nav>
      ) : (
        <nav className="navBar-nav">
          <img src={logo} alt="Logo" style={{ width: "300px", height: "auto" }} />
          <ul>
            <li>
              {" "}
              <Link to="/">Home</Link>{" "}
            </li>
            <li>
              {" "}
              <Link to="/authentication">SignIn</Link>
            </li>
            <li>
              <Link to="/signup">SignUp</Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default Navbar;
