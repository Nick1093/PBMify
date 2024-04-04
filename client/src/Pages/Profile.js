import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Settings from '../Components/Settings';
import ViewFriends from '../Components/ViewFriends';

import "../styles/profile.css"

const Profile = () => {
    const [activeComponent, setActiveComponent] = useState();

    const renderComponent = () => {
        switch (activeComponent) {
            case 'settings':
                return <Settings />;
            case 'viewFriends':
                return <ViewFriends />;
            default:
                return null;
        }
    }

    return (
        <div>
            <h1>Profile Page</h1>
            <nav className="profile-navbar">
                <ul>
                    <li className="settings-link" onClick={() => setActiveComponent('settings')}>Settings</li>
                    <li className="friends-link" onClick={() => setActiveComponent('viewFriends')}>View Friends</li>
                    <li className="home-link">
                        <Link to="/userHome">Home </Link>{" "}
                    </li>
                </ul>
            </nav>
            {renderComponent()}
        </div>
    )
}

export default Profile;