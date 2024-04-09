import React, { useState } from 'react';
import { UserAuth } from "../Context/AuthContext";
import Navbar from '../Components/navbar';
import "../styles/community.css"
import FriendFeedComponent from '../Components/friendfeed';
import Footer from '../Components/footer';
const Community = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null)

    const { user } = UserAuth();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleAddFriend = async () => {
        setLoading(true);

        try {
            // Send a request to the backend to add the friend
            const response = await fetch('http://localhost:8001/add-friend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "userID": user.uid, "userEmail": email }),
            });

            if (!response.ok) {
                throw new Error('Error adding friend. Please try again.');
            }

            const data = await response.json()

            setLoading(false);
            setMessage(data.message);
        } catch (error) {
            setLoading(false);
            setMessage(error.message || 'Error adding friend. Please try again.')
        }
    };

    return (
        <div>
            <Navbar></Navbar>
            <h2>Add Friend</h2>
            <input className="search-bar"
                type="text"
                placeholder="Enter friend's email"
                value={email}
                onChange={handleEmailChange}
            />
            <button className="add-friend-button" onClick={handleAddFriend} disabled={loading}>
                {loading ? 'Adding...' : 'Add Friend'}
            </button>
            {message && message.includes("Error") && <p style={{ color: 'red' }}>{message}</p>}
            {message && !message.includes("Error") && <p style={{ color: 'green' }}>{message}</p>}
            <h1>Friend Feed</h1>
            <FriendFeedComponent /> {/* Pass currentUserID prop */}
            <Footer className="footer" />
        </div>
    );
}

export default Community 