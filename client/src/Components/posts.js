import React, { useState, useEffect } from "react";


const posts = () => {
    const { user } = UserAuth();
    const [myPosts, setMyPosts] = useState([]);

    useEffect(() => {
        const fetchMyPosts = async () => {
            try {
                console.log("Fetching friend posts...");
                console.log(user.uid)

                const response = await fetch(`http://localhost:8001/my-posts?userID=${user.uid}`);
                const data = await response.json();

                console.log("Response data:", data);

                if (!response.ok) {
                    throw new Error("Failed to fetch friend posts");
                }

                setMyPosts(data);
            } catch (error) {
                console.error("Error fetching friend posts:", error);
            }
        };

        fetchMyPosts();
    }, []);
};



return (
    <div>
        <ul>
            {myPosts.map((post, index) => (
                <li key={index}>{post}</li>
            ))}
        </ul>
    </div>
);

export default posts;

