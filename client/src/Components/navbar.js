import React from 'react';
import { Link } from 'react-router-dom';
import { UserAuth } from "../Context/AuthContext";

const Navbar = () => {
    const { user } = UserAuth();
    if (user) {
        //navbar if user is logged in
        return (
            <nav className="navBar">
                <ul>
                    <li><Link to="/">Home </Link> </li>
                    <li> <Link to="/UserInterface">PBMify</Link></li>
                </ul>
            </nav >
        );
    } else {
        //navbar is user is NOT logged in
        return (
            <nav className="navBar">
                <ul>
                    <li> <Link to="/">Home </Link> </li>
                    <li> <Link to="/authentication">SignIn</Link></li>
                    <li><Link to="/signup">SignUp</Link></li>
                </ul>
            </nav>
        )
    }

};

export default Navbar;