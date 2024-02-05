import React from 'react';

const Navbar = () => {
    return (
        <nav className="navBar">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="PBMify"> PBMify</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;