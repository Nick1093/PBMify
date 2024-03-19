import React from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../Context/AuthContext";
import NavBar from "../Components/navbar"
import FriendFeedComponent from "../Components/friendfeed" 

const Home = () => {
  const { user, logout } = UserAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <>
      <NavBar></NavBar>
      <h1>Welcome {user && user.name}</h1>
      <p>User email: {user && user.email}</p>
      <button onClick={handleLogout}>Logout</button>
      <h1><br></br>See what your friends are up to</h1>
      <FriendFeedComponent></FriendFeedComponent>
    </>
  );
};

export default Home;
