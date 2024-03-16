import React, { useEffect, useState } from 'react';
import { UserAuth } from "../Context/AuthContext";

const FriendFeed = ({ currentUserID }) => {
    const { user } = UserAuth();
    const [friendPosts, setFriendPosts] = useState([]);

    useEffect(() => {
        const fetchFriendPosts = async () => {
            try {
                if(!user) return;

                // Fetch friends list for the current user
                const response = await fetch("http://localhost:8001/fetch-posts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userID: user.uid }),
                });

                if(!response.ok) {
                    throw new Error("Failed to fetch friends");
                }

                const friendPosts = await response.json();
                setFriendPosts(friendPosts)
                console.log("Friend Posts:", friendPosts);
                console.log("---------------");
            } catch(error) {
                console.error("Error fetching friend feed:", error);
            }
        };

        fetchFriendPosts();
    }, []);

    return (
      <div>
        <h2>Friend Feed</h2>
        <ul>
            {friendPosts.map((post, index) => (
                <li key={index}>{post}</li>
            ))}
        </ul>
      </div>
      );
};

export default FriendFeed;