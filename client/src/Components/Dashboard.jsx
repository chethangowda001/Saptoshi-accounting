import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import "../css/Dashboard.css"
import OngoingBids from "./Admin/OngoingBids"
import BidArchive from "./Admin/BidArchive"
import BidParticipants from "./Admin/BidParticipants"
import Payments from "./Admin/Payments"
import Register from "./Admin/Register"
import ProfitLoss from "./Admin/ProfitLoss"
import NewBid from "./Admin/NewBid"
import BidPage from './Admin/BidPage'
import AddUser from './Admin/AddUser'
import RegisteredUsers from './Admin/RegisteredUsers'

const Dashboard = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(null);
  const [activeBidId, setActiveBidId] = useState('');
  // const admin  = localStorage.getItem('username')
  const handleButtonClick = (operation) => {
    switch (operation) {
      case 'Dashboard':
        setActivePage(null)
        navigate('/dashboard');
        break;
      case 'Ongoing':
        setActivePage(<OngoingBids setActivePage={setActivePage} setActiveBidId={setActiveBidId} activeBidId={activeBidId}/>);
        navigate('/dashboard/ongoingbids');
        break;
      case 'Archive':
        setActivePage(<BidArchive />);
        navigate('/dashboard/bidarchive');
        break;
      case 'Participants':
        setActivePage(<BidParticipants />);
        navigate('/dashboard/bidparticipants');
        break;
      case 'Payments':
        setActivePage(<Payments />);
        navigate('/dashboard/payments');
        break;
      case 'Register':
          setActivePage(<Register />);
          navigate('/dashboard/register');
          break;
      case 'ProfitLoss':
          setActivePage(<ProfitLoss />);
          navigate('/dashboard/profitloss');
          break;
      case 'NewBid':
          setActivePage(<NewBid />);
          navigate('/dashboard/newbid')
          break;
      case 'AddUser':
        setActivePage(<AddUser />);
        navigate('/dashboard/adduser');
        break;
      case 'RegisteredUsers':
        setActivePage(<RegisteredUsers />);
        navigate('/dashboard/registeredusers');
        break;  
      
      default:
        setActivePage(null);
        break;
    }
  };

  return (
    <div className='dashboard-root'>
      <div className="sticky-header">
        <div>
          <h3 id="head">
            Welcome Admin 
          </h3>
          </div>
          <div className="logout">
            <h2>Logout</h2>
            <i className="ri-logout-box-r-line"></i>
          </div>
      </div>
      <div className="container crud-btn">
        <button className="btn btn-primary" onClick={() => handleButtonClick('Ongoing')}>
        Ongoing Bids
        </button>
        <button className="btn btn-warning" onClick={() => handleButtonClick('Archive')}>
        Bid Archive
        </button>
        <button className="btn btn-danger" onClick={() => handleButtonClick('Payments')}>
          Payments
        </button>
        <button className="btn btn-success" onClick={() => handleButtonClick('ProfitLoss')}>
         Profit/Loss
        </button>
        <button className="btn regUsers" onClick={() => handleButtonClick('RegisteredUsers')}>
          Registered Users
        </button>
        <button className="btn btn-secondary" onClick={() => handleButtonClick('NewBid')}>
         New Bid
        </button>
        <button className="btn btn-info" onClick={() => handleButtonClick('AddUser')}>
         Create User
        </button>
      </div>
      {activePage}
      <div className="container">
        <Routes>
        <Route path="/dashboard/ongoingbids" element={<OngoingBids setActivePage={setActivePage}/>} />
          <Route path="/dashboard/bidarchive" element={<BidArchive />} />
          <Route path="/dashboard/payments" element={<Payments />} />
          <Route path="/dashboard/profitloss" element={<ProfitLoss />} />
          <Route path="/dashboard/newbid" element={<NewBid />} />
          <Route path="/dashboard/bid/:id" element={<BidPage activeBidId={activeBidId}/>} />
          <Route path="/dashboard/adduser" element={<AddUser />} />
          <Route path="/dashboard/registerduser" element={<RegisteredUsers />} />
        </Routes>
        <h3>Summary</h3>
        <table id="summary" className="table">
        <tbody>
          <tr>
            <td>Active Bids:</td>
            <td>100</td>
          </tr>
          <tr>
            <td>Inactive Bids:</td>
            <td>20</td>
          </tr>
          <tr>
            <td>Active Participants:</td>
            <td>75</td>
          </tr>
          <tr>
            <td>Inactive Participants:</td>
            <td>10</td>
          </tr>
          <tr>
            <td>Total Due:</td>
            <td>$5000</td>
          </tr>
          <tr>
            <td>Net Gain/Loss:</td>
            <td>$1500</td>
          </tr>
          <tr>
            <td>Payment Defaults:</td>
            <td>5</td>
          </tr>
          <tr>
            <td>Bids Today:</td>
            <td>30</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default Dashboard;

