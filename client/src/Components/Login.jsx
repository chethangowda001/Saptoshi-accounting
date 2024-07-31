import React, {useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "../css/Login.css"

const Login = () => {

  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const gotoDashboard = () => {
    navigate('/dashboard');
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    gotoDashboard();
  };

  return (
    <div className="wrapper">
      <div className="logo">
        <img src="img/logo.png" alt="logo" />
      </div>
      <div className="text-center mt-3 name">Gold Chit Fund Management <br /> (Only Admins)</div>
      <form className="p-3 mt-3" onSubmit={handleSubmit}>
        <div className="form-field d-flex align-items-center">
          <span className="far fa-user"></span>
          <input
            type="email"
            name="email"
            id="email"
            value={credentials.email}
            onChange={onChange}
            placeholder="Email"
            required
          />
        </div>
        <div className="form-field d-flex align-items-center">
          <span className="fas fa-key"></span>
          <input
            type="password"
            name="password"
            id="password"
            value={credentials.password}
            onChange={onChange}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit" className="btn mt-3">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
