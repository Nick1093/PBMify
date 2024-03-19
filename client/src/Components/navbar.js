import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserAuth } from "../Context/AuthContext";

const Navbar = () => {
    const { user } = UserAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false); // For the dropdown menu, false as default
    const toggleDropdown = () => { // changes state of dropdownOpen
        setDropdownOpen(!dropdownOpen);
    };


    return (
        <>
            {user ?
                <nav className="navBar-nav">
                    <ul>
                        <li><Link to="/">Home </Link> </li>
                        <li> <Link to="/UserInterface">PBMify</Link></li>
                        <li> <img src="../images/pfp.png" className="pfp" onClick={toggleDropdown} />
                            {dropdownOpen ? <ul className="dropdown-menu">
                                <li><Link to="/profile">Profile</Link></li>
                                <li onClick={UserAuth().logout}> Sign Out</li>
                            </ul> : null}
                        </li> // This is the profile picture that will be displayed in the navbar
                    </ul>
                </nav >
                :
                <nav className="navBar-nav">
                    <ul>
                        <li> <Link to="/">Home </Link> </li>
                        <li> <Link to="/authentication">SignIn</Link></li>
                        <li><Link to="/signup">SignUp</Link></li>
                    </ul>
                </nav>
            }
        </>
    );
};

export default Navbar;