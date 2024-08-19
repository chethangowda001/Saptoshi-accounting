
import { useNavigate } from 'react-router-dom';

import "../css/Login.css"

// src/components/SignIn.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const SignIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/users/signin', formData);
            console.log("User signed in successfully:", response.data);
            login();  // Update the authentication state
            // Handle success (e.g., redirect to dashboard)
        } catch (error) {
            console.error("Sign in error:", error.response?.data);
            // Handle error
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
            />
            <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
            />
            <button type="submit">Sign In</button>
        </form>
    );
};

export default SignIn;
