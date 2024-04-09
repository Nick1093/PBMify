import React from 'react';
import { useContext } from 'react';
import { UserAuth } from "../Context/AuthContext";

const Settings = () => {
    const { user } = UserAuth();

    return (
        <div>
            <h1>Settings</h1>
            <h2>Email: {user && user.email}</h2>
        </div>
    );
};

export default Settings;