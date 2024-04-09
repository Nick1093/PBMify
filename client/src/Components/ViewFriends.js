import React, { useEffect, useState } from 'react';
import { UserAuth } from "../Context/AuthContext";
import '../styles/viewFriends.css';

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
                setFriends(data.userFriends);
            } catch (e) {
                console.log(e);
            }
        };
        getFriends();
    }, []);


    return (
        <div>
            <h1>View Friends</h1>
            <h2>Friends</h2>
            <input type="text" className="search-bar" placeholder="Search Your Friends" value={search} onChange={(e) => setSearch(e.target.value)} />
            <ul>
                {friends.map((friend) => {
                    return <li className="friend" key={friend.UserId}>{friend.friendEmail}</li>
                })}
            </ul>

        </div>
    );
}

export default ViewFriends;