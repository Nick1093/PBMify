import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Settings from '../Components/Settings';
import ViewFriends from '../Components/ViewFriends';
import Posts from '../Components/posts';
import Footer from '../Components/footer';
import "../styles/profile.css"
import Navbar from '../Components/navbar';

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
            <Navbar></Navbar>
            <nav className="profile-nav">
                <ul className="profile-list">
                    <li onClick={() => setActiveComponent('posts')} className="posts">My Posts</li>
                    <li onClick={() => setActiveComponent('settings')} >Settings</li>
                    <li onClick={() => setActiveComponent('viewFriends')} >View Friends</li>
                </ul>
            </nav>
            {renderComponent()}
        </div>
    )
}

export default Profile;
