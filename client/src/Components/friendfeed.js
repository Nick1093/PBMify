import React, { useEffect, useState } from 'react';
import { UserAuth } from "../Context/AuthContext";
import "../styles/friendfeedpage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

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
            <h1>Your Friend's Posts</h1>
            <ul>

                {friendPosts.length > 0 && friendPosts.map((post, index) => (
                    <li key={index}>
                        <div className="post-container">
                            {<img src={`data:image/jpeg;base64,${post.imageURL}`} alt="post" className="post" />}
                            <div className="save-button">
                                <a href={`data:image/jpeg;base64,${post.imageURL}`} download="image.png"  >
                                    <button> <FontAwesomeIcon icon={faDownload} /> </button>
                                </a>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FriendFeedComponent;