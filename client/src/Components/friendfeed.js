import React, { useEffect, useState } from 'react';
import { UserAuth } from "../Context/AuthContext";
import "../styles/friendfeedpage.css"

const FriendFeedComponent = ({ currentUserID }) => {
    const { user } = UserAuth();
    const [friendPosts, setFriendPosts] = useState([]);

    useEffect(() => {
        const fetchFriendPosts = async () => {
            try {
                console.log("Fetching friend posts...");
                console.log(user.uid)

                const response = await fetch(`http://localhost:8001/fetch-posts?userID=${user.uid}`);
                const data = await response.json();

                console.log("Response data:", data);

                if (!response.ok) {
                    throw new Error("Failed to fetch friend posts");
                }

                setFriendPosts(data);
            } catch (error) {
                console.error("Error fetching friend posts:", error);
            }
        };

        fetchFriendPosts();
    }, []);



    return (
        <div>
            <ul>
                {friendPosts.map((post, index) => (
                    <li key={index}>{post}</li>
                ))}
            </ul>
        </div>
    );
    <div>
        <ul>
            {friendPosts.map((post, index) => (
                <li key={index}>{post} {<img src={`data:image/jpeg;base64,${post.imageURL}`} alt="post" className="single-post" />}</li>
            ))}
        </ul>
    </div>
    );
};

export default FriendFeedComponent;