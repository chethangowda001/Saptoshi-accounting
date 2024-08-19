import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Components/Header';
import Dashboard from './Components/Dashboard';
import BidderDetails from './Components/Admin/BidderDetails';
import SignUp from './Components/SignUp';
import SignIn from './Components/SignIn';
import Logout from './Components/Logout';
import { AuthContext, AuthProvider } from './contexts/AuthContext';

const PrivateRoute = ({ element, ...rest }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? element : <Navigate to="/" />;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard/*" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/bidder-details/:bidId" element={<PrivateRoute element={<BidderDetails />} />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
