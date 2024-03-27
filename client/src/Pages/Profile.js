import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Settings from '../Components/settings';
import ViewFriends from '../Components/ViewFriends';
import Posts from '../Components/posts';



const Profile = () => {
    const [activeComponent, setActiveComponent] = useState();

    const renderComponent = () => {
        switch (activeComponent) {
            case 'settings':
                return <Settings />;
            case 'viewFriends':
                return <ViewFriends />;
            case 'posts':
                return <Posts />;
            default:
                return null;
        }
    }

    return (
        <div>
            <h1>Profile Page</h1>
            <nav className="profile-navbar">
                <ul>
                    <li onClick={() => setActiveComponent('posts')}>Profile</li>
                    <li onClick={() => setActiveComponent('settings')}>Settings</li>
                    <li onClick={() => setActiveComponent('viewFriends')}>View Friends</li>
                    <li>
                        <Link to="/">Home </Link>{" "}
                    </li>
                </ul>
            </nav>
            {renderComponent()}
        </div>
    )
}

export default Profile;