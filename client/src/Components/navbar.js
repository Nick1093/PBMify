import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserAuth } from "../Context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';


const Navbar = () => {
  const { logout, awaitUser } = UserAuth();
  const { user } = UserAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false); // For the dropdown menu, false as default
  const toggleDropdown = () => {
    // changes state of dropdownOpen
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
      {user ? (
        <nav className="navBar-nav">
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
              <FontAwesomeIcon icon={faUser} className="pfp" onClick={toggleDropdown} />
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
