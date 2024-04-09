import React from "react";
import { Routes, Route } from "react-router-dom";

// routes
import { AuthContextProvider } from "./Context/AuthContext";
import Landing from "./Pages/Landing";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";
import ProtectedRoute from "./Components/ProtectedRoute";
import UserInterface from "./Pages/UserInterface";
import FriendFeedPage from "./Pages/FriendFeedPage";
import Profile from "./Pages/Profile";
import Community from "./Pages/Community";
import "../src/styles/global.css";


const App = () => {
  return (
    <>
      <AuthContextProvider>
        <Routes>
          <Route path="/" exact element={<Landing />} />
          <Route path="/authentication" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/community" element={<Community />} />
          <Route
            path="/PBMify"
            element={
              <ProtectedRoute>
                <UserInterface />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/friendfeed"
            element={
              <ProtectedRoute>
                <FriendFeedPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthContextProvider>
    </>
  );
};

export default App;
