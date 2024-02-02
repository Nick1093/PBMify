import React from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../Context/AuthContext";

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
      <h1>Welcome {user && user.name}</h1>
      <p>User email: {user && user.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
};

export default Home;
