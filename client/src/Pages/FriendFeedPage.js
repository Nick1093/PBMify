import React from 'react';
import NavBar from "../Components/navbar";
import FriendFeedComponent from '../Components/friendfeed';

const FriendFeedPage = ({ currentUserID }) => {  
    return (
      <div>
        <NavBar />
        <h2>Friend Feed</h2>
        <FriendFeedComponent/> {/* Pass currentUserID prop */}
      </div>
      );
};

export default FriendFeedPage;
