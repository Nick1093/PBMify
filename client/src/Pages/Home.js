import React from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../Context/AuthContext";
import NavBar from "../Components/navbar"
import FriendFeedComponent from "../Components/friendfeed"
import Footer from "../Components/footer"

import box from "../images/about.png";

import "../styles/home.css"


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
      <div className="welcome-container">
        <h1 className="welcome-text">Welcome to PBMify! {user && user.name}</h1>
        <p className="subtitle-text">Made by Nick, Jessica, Alison, Ethan, Shaun, and Stephanie</p>
      </div>
      <div className="about-container">
        <h1 className="about-text">Hear from our team</h1>
        <img src={box} alt="WFN Projects Team" style={{ width: "300px", height: "auto" }} />
        <p className="about-body-text">Hi! Thank you for being here. We're a group of students at Western who have spent the past bit working on coding our first fullstack project. None of this would have been possible with our mentor, Nick. Thank you Nick for all the hours, gentle parenting, tech advice, and FUN. You've been such a defining part of our university experience and constantly inspire us to be better. Second of all, thank you to the Western Founders network for your support and bringing us together! Finally we can't forget to thank Ivey Business school for being our home.  </p>
      </div>
      <FriendFeedComponent />
      <Footer className="footer"></Footer>
    </>
  );
};

export default Home;
