import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Header from './Components/Header';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';

import BidderDetails from './Components/Admin/BidderDetails';
const App = () => {
  // const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  // const apiUrl = process.env.REACT_APP_API_URL;

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Login  />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/bidder-details/:bidId" element={<BidderDetails />} />
      </Routes>
     
    </BrowserRouter>
  );
};

export default App;