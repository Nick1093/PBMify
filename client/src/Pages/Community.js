import React, { useState } from 'react';
import { UserAuth } from "../Context/AuthContext";


const Community = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const { user } = UserAuth();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleAddFriend = async () => {
        setError(null);
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

            setLoading(false);
            setSuccessMessage('Friend added successfully.');
        } catch (error) {
            setLoading(false);
            setError(error.message || 'Error adding friend. Please try again.');
        }
    };

    return (
        <div>
            <h2>Add Friend</h2>
            <input
                type="email"
                placeholder="Enter friend's email"
                value={email}
                onChange={handleEmailChange}
            />
            <button onClick={handleAddFriend} disabled={loading}>
                {loading ? 'Adding...' : 'Add Friend'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </div>
    );
}

export default Community 