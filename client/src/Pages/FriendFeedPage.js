import React, { useState, useEffect } from 'react';
import NavBar from "../Components/navbar";
import FriendFeedComponent from '../Components/friendfeed';
import { UserAuth } from "../Context/AuthContext";

const FriendFeedPage = ({ currentUserID }) => {
  const { user } = UserAuth();

  return (
    <div>
      <NavBar />
      <h2>Friend Feed</h2>
      <FriendFeedComponent /> {/* Pass currentUserID prop */}
    </div>
  );
};

export default FriendFeedPage;
