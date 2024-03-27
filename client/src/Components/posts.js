import React, { useState, useEffect } from "react";
import { UserAuth } from "../Context/AuthContext";


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
                console.log(data.imageURL);
                setMyPosts(data.imageURL);
            } catch (error) {
                console.error("Error fetching your posts:", error);
            }
        };

        fetchMyPosts();
    }, []);

    return (
        <div>
            <h2>My Posts</h2>
            <ul>
                {myPosts.map((post, index) => (
                    <li key={index}>
                        {<img src={`data:image/jpeg;base64,${post}`} alt="post" />}
                    </li>
                ))}
            </ul>
        </div>
    );
};





export default Posts;

