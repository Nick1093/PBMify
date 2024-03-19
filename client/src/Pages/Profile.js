import React, { useState } from 'react';
import Settings from '../Components/settings';
import ViewFriends from '../Components/ViewFriends';


function Profile() {
    const [activeComponent, setActiveComponent] = useState('');

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
                    <li onClick={logout}> Sign Out</li>
                </ul>
            </nav>
            {renderComponent()}
        </div>
    )
}

export default Profile;