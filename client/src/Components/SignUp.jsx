
import React, { useState } from 'react';
import axios from 'axios';

const SignUp = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/users/signUp', formData);
            console.log("User signed up successfully:", response.data);
            // Handle success (e.g., redirect to login)
        } catch (error) {
            console.error("Sign up error:", error.response?.data);
            // Handle error
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                name="fullName" 
                placeholder="Full Name" 
                value={formData.fullName} 
                onChange={handleChange} 
                required 
            />
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
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default SignUp;
