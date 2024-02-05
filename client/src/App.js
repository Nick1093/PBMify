import React from "react";
import { Routes, Route } from "react-router-dom";

// routes
import { AuthContextProvider } from "./Context/AuthContext";
import Landing from "./Pages/Landing";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";
import ProtectedRoute from "./Components/ProtectedRoute";

const App = () => {
  return (
    <>
      <AuthContextProvider>
        <Routes>
          <Route path="/" exact element={<Landing />} />
          <Route path="/authentication" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/UserInterface" element={<UserInterface />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthContextProvider>
    </>
  );
};

export default App;
