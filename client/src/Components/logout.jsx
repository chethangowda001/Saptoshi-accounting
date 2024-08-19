// src/components/Logout.jsx
import React, { useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const Logout = () => {
    const { logout } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            await axios.post('/users/logout');
            console.log("User logged out successfully");
            logout();  // Update the authentication state
            // Redirect to home or login page
        } catch (error) {
            console.error("Logout error:", error.response?.data);
            // Handle error
        }
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default Logout;
