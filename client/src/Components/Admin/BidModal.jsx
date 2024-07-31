import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BidModal = ({ show, onClose, bidData, nearestBid, onBidStart }) => {
  const [winnerId, setWinnerId] = useState('');
  const [bidValue, setBidValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentNearestBid, setCurrentNearestBid] = useState(nearestBid); // State to hold the current nearestBid

  useEffect(() => {
    setCurrentNearestBid(nearestBid); // Update currentNearestBid whenever nearestBid changes
  }, [nearestBid]);

  const handleWinnerChange = (e) => {
    setWinnerId(e.target.value);
  };

  const handleBidValueChange = (e) => {
    setBidValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (isSubmitting) {
      return; // Prevent multiple submissions
    }
    setIsSubmitting(true);

    const selectedWinner = bidData.users.find((user) => user._id === winnerId);
    if (!selectedWinner) {
      alert('Selected winner not found');
      setIsSubmitting(false); // Reset submitting state
      return;
    }

    const bidStake = bidValue / bidData.MonthDuration;
    const bidPayout = bidValue - bidStake;

    const getPayStake = (userId) =>{
      if (userId === winnerId){
        return 0;
      }
      else return bidStake
    }
    const paymentStatus = bidData.users.map((user) => ({
      u_id: user._id,
      userName: user.userName,
      payment: getPayStake(user._id),
      payed: false,
    }));

    const updatedBid = {
      BidWinner: {
        userName: selectedWinner.userName,
        phoneNumber: selectedWinner.userPhoneNo,
      },
      BidValue: bidValue,
      BidStake: bidStake,
      PaymentStatus: paymentStatus,
      BidPayOut: bidPayout,
      BidStart: true,
    };

    try {
      const response = await axios.put(
        `http://localhost:3001/bids/${bidData._id}/update-bid/${currentNearestBid.BidNo}`,
        updatedBid
      );
      if (response.status === 200) {
        // Update the selected winner's data only
        console.log(selectedWinner)
        const userUpdateResponse = await axios.put(
          `http://localhost:3001/bids/${bidData._id}/users/${selectedWinner._id}`, // Replace with your actual backend endpoint for updating user by _id
          {
            BidWinNo: currentNearestBid.BidNo,
            BidValue: bidValue,
            BidPayOut: bidPayout,
          }
        );

        if (userUpdateResponse.status === 200) {
          onBidStart(updatedBid);
          onClose();
        } else {
          console.error('Failed to update user:', userUpdateResponse.data.message);
          alert('Failed to update user. See console for details.');
        }
      } else {
        console.error('Unexpected response status:', response.status);
        alert('Failed to start bid');
      }
    } catch (error) {
      console.error('Error starting bid:', error);
      alert('Failed to start bid. See console for details.');
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Start Bid</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Bid Winner</label>
                <select className="form-control" value={winnerId} onChange={handleWinnerChange} required>
                  <option value="">Select Winner</option>
                  {bidData.users.map(user => (
                    <option key={user._id} value={user._id}>{user.userName} - {user.userPhoneNo}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Bid Value</label>
                <input
                  type="number"
                  className="form-control"
                  value={bidValue}
                  onChange={handleBidValueChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary mt-3" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Start Bid'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidModal;
