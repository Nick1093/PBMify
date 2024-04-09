import React, { useState, useEffect } from "react";
import { UserAuth } from "../Context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import '../styles/posts.css';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";


const Posts = ({ currentUserID }) => {
    const { user } = UserAuth();
    const [myPosts, setMyPosts] = useState([]);

    const fetchMyPosts = async () => {
        try {
            console.log("Fetching your posts...");
            console.log(user.uid)

            const response = await fetch(`http://localhost:8001/my-posts?userId=${user.uid}`);
            const data = await response.json();

            console.log("Response data:", data);

            if (!response.ok) {
                throw new Error("Failed to fetch your posts");
            }

            console.log(data);
            setMyPosts(data.userImages);
        } catch (error) {
            console.error("Error fetching your posts:", error);
        }
    };

    useEffect(() => {
        fetchMyPosts();
    }, []);

    const deletePost = async (postID) => { // function to call delete post
        console.log(user.uid, postID)
        try {
            const response = await fetch('http://localhost:8001/remove-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postID: postID, userID: user.uid }),
            });
            if (!response.ok) {
                throw new Error('Failed to delete post');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        fetchMyPosts();
    };

    return (
        <div>
            <h1>My Posts</h1>
            <Carousel useKeyboardArrows={true} className="post-container">
                {myPosts.length > 0 && myPosts.map((post, index) => (
                    <div key={index} >
                        <p className="post-title">Title: {post.title}</p>
                        {<img src={`data:image/jpeg;base64,${post.imageURL}`} alt="post" className="post" />}
                        <div className="button-container">
                            <button onClick={() => deletePost(post.postID)} className="remove-button">
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                            <a href={`data:image/jpeg;base64,${post.imageURL}`} download="image.png">
                                <button className="save-button"> <FontAwesomeIcon icon={faDownload} /> </button>
                            </a>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};





export default Posts;

