import React, { useState, useEffect } from 'react';
import "../../css/OngoingBids.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BidPage from './BidPage';

const OngoingBids = ({ setActivePage, setActiveBidId, activeBidId }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [bidsData, setBidsData] = useState([]);

  useEffect(() => {
    // Fetch data from backend API
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/bids/ongoing-bids');
        setBidsData(response.data); // Update state with fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call fetchData function when component mounts
  }, []); // Empty dependency array ensures useEffect runs only once

  const filteredBids = bidsData.filter((bid) =>
    Object.values(bid)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleViewBid = (bidId) => {
    setActiveBidId(bidId);
    // Navigate to bid page first
    navigate(`/dashboard/bid/${bidId}`);
    setActivePage(<BidPage activeBidId={activeBidId} />); // Pass activeBid as prop to BidPage
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="ongoing-bids-container">
      <h3>Ongoing Bids</h3>
      <div className="search">
        <input
          type="text"
          placeholder="Search by Bid No., Ad, etc."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-dark">Search</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Sl. No</th>
            <th>Bid No.</th>
            <th>Start </th>
            <th>End </th>
            <th>No. of Participants</th>
            <th>Bid Size</th>
            <th>Ad</th>
            <th>Actions</th> {/* New column for View Bid button */}
          </tr>
        </thead>
        <tbody>
          {filteredBids.map((bid, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{bid._id}</td>
              <td>{formatDate(bid.StartDate)}</td>
              <td>{formatDate(bid.EndDate)}</td>
              <td>{bid.ParticipantsCount}</td>
              <td>{bid.BidSize}</td>
              <td>{bid.AD}</td>
              <td>
              <button className="btn btn-info" onClick={() => handleViewBid(bid._id)}>
                View Bid
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default OngoingBids;
