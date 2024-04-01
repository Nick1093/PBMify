import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Settings from '../Components/Settings';
import ViewFriends from '../Components/ViewFriends';



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
                    <li onClick={() => setActiveComponent('settings')}>Settings</li>
                    <li onClick={() => setActiveComponent('viewFriends')}>View Friends</li>
                    <li>
                        <Link to="/userHome">Home </Link>{" "}
                    </li>
                </ul>
            </nav>
            {renderComponent()}
        </div>
    )
}

export default Profile;