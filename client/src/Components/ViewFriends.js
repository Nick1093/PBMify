import React, { useEffect, useState } from 'react';
import { UserAuth } from "../Context/AuthContext";

const ViewFriends = () => {
    const [friends, setFriends] = useState([]);
    const { user } = UserAuth();
    const [search, setSearch] = useState('');

    useEffect(() => {
        const getFriends = async () => {
            try {
                const response = await fetch(`http://localhost:8001/get-friends?userID=${user.uid}`);
                const data = await response.json();
                console.log(data);
                setFriends(data);
            } catch (e) {
                console.log(e);
            }
        };
        getFriends();
    }, []);

    const searchFriends = friends.filter(friend => friend.email.toLowerCase().includes(search.toLowerCase()));

    return (
        <div>
            <h1>View Friends</h1>
            <h2>Friends</h2>
            <input type="text" placeholder="Search Your Friends" value={search} onChange={(e) => setSearch(e.target.value)} />
            <ul>
                {searchFriends.map((friend) => {
                    return <li key={friend.userID}>{friend.email}</li>
                })}
            </ul>

        </div>
    );
}

export default ViewFriends;