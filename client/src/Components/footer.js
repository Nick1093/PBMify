import React, { useState, useEffect } from 'react';
import "../styles/footer.css"

import wfn from "../images/wfn.png";
import logo from "../images/PBMify.png";

const Footer = () => {
    const handleFeedbackClick = () => {
        window.location.href = 'mailto:projectn2324@gmail.com';
    };
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-left">
                    <img src={wfn} style={{ width: "120px", height: "auto", marginLeft: "10px" }} />
                    <img src={logo} style={{ width: "180px", height: "auto", marginLeft: "10px" }} />
                </div>
                <div className="footer-right">
                    <input type="text" placeholder="Give us feedback!" className="feedback-input" />
                    <button className="feedback-button" onClick={handleFeedbackClick}>Submit Feedback</button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;