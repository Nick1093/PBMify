import React, { useEffect, useState } from 'react';
import { UserAuth } from "../Context/AuthContext";
import "../styles/friendfeedpage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

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
            <Carousel useKeyboardArrows={true} className="post-container">
                {friendPosts.length > 0 && friendPosts.map((post, index) => (
                    <div key={index}>
                        <p className="post-title">Title: {post.title}</p>
                        {<img src={`data:image/jpeg;base64,${post.rawImageURL}`} alt="post" className="post" />}
                        <div className="save-button">
                            <a href={`data:image/jpeg;base64,${post.rawImageURL}`} download="image.png"  >
                                <button> <FontAwesomeIcon icon={faDownload} /> </button>
                            </a>
                        </div>
                        {<img src={`data:image/jpeg;base64,${post.colorImageURL}`} alt="post" className="post" />}
                    </div>
                )
                )}
            </Carousel>
        </div>
    );
};

export default FriendFeedComponent;