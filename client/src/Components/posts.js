import React, { useState, useEffect } from "react";
import { UserAuth } from "../Context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import '../styles/posts.css';


const Posts = ({ currentUserID }) => {
    const { user } = UserAuth();
    const [myPosts, setMyPosts] = useState([]);

    useEffect(() => {
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
    };

    return (
        <div>
            <h2>My Posts</h2>
            <ul>
                {myPosts.map((post, index) => (
                    <li key={index}>
                        {<img src={`data:image/jpeg;base64,${post.imageURL}`} alt="post" />}
                        <button onClick={() => deletePost(post.PostID)} className="myPosts">
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};





export default Posts;

