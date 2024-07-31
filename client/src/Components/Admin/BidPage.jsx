import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BidModal from './BidModal';

const BidPage = ({ activeBidId }) => {
  const [bidData, setBidData] = useState();
  const [nearestBid, setNearestBid] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showBidModal, setShowBidModal] = useState(false);
  const [paidUsers, setPaidUsers] = useState([]);
  const [bidClosed, setBidClosed] = useState(true);

  const id = activeBidId;
  
   // Function to fetch bid data
   const fetchBidData = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/bids/${id}`);
      setBidData(response.data);
      const nearestBid = getNearestBidNo(response.data.Bids);
      setNearestBid(nearestBid);
    } catch (error) {
      console.error('Error fetching bid data:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBidData();
    }
  }, [id, fetchBidData]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/participants?search=${searchTerm}`);
      setSearchResults(response.data);
      setShowSearch(true); // Show search results after fetching
    } catch (error) {
      console.error('Error searching participants:', error);
    }
  };

  const handleAddUser = async (user) => {
    try {
      const { userName, userPhoneNo } = user;
      
      // Add user to the bid via backend
      const response = await axios.post(`http://localhost:3001/bids/${id}/add-user`, { userName, userPhoneNo });
      
     if(response.status === 201){
        alert(response.data.message)
      }
      else{
       // Update bidData with the response
       setBidData(response.data);
       setSearchResults([]);
       setSearchTerm('');
       setShowSearch(false);
      // Show success alert
      alert('User added successfully!');
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const getNearestBidNo = (bids) => {
    const currentDate = new Date();
    let nearestBid = null;
    let nearestDiff = Infinity; // Start with Infinity to ensure any valid date difference is smaller
  
    for (const bid of bids) {
      const diff = Math.abs(new Date(bid.BidDate) - currentDate);
      if (diff < nearestDiff && !bid.BidClose) { // Ensure BidClose is false
        nearestBid = bid;
        nearestDiff = diff;
      }
    }
    return nearestBid;
  };
  
  const handleBidStart = async (updatedBid) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/bids/${bidData._id}/update-bid/${updatedBid.BidNo}`,
        updatedBid
      );
      if (response.status === 200) {
        await fetchBidData();
        alert('Bid started successfully!');
      } else {
        alert('Failed to start bid');
      }
    } catch (error) {
      console.error('Error starting bid:', error);
    }
  };

  const togglePaidStatus = (userId) => {
    // For demonstration, toggle the paid status locally
    const isPaid = paidUsers.includes(userId);

    if (isPaid) {
      // Remove from paidUsers
      const updatedPaidUsers = paidUsers.filter((id) => id !== userId);
      setPaidUsers(updatedPaidUsers);
    } else {
      // Add to paidUsers
      setPaidUsers([...paidUsers, userId]);
    }
  };

  const getPaymentStatus = (userId, bidNo) => {
    const bid = bidData.Bids.find((b) => b.BidNo === bidNo);
    if (bid) {
      const paymentStatus = bid.PaymentStatus.find((status) => status.u_id === userId);
      return paymentStatus ? paymentStatus.payment : '-';
    }
    return '-';
  };

  const sortUsersByBidNo = (users) => {
    return users.sort((a, b) => (a.BidWinNo || Infinity) - (b.BidWinNo || Infinity));
  };

  const handleCloseBid = async () => {
    let totalCredit = 0;
    let totalDebit = 0;  
    
    // Iterate over the users in bidData
    bidData.users.forEach(async (user) => {
      // Find the corresponding bid in Bids array by BidNo
      const bid = bidData.Bids.find((b) => b.BidNo === nearestBid.BidNo);
      totalDebit = bid.BidPayOut;

      // Check if the user is paid (their _id is in paidUsers array)
      if (paidUsers.includes(user._id)) {
          // Find the PaymentStatus entry for this user in the bid
          const paymentStatus = bid.PaymentStatus.find(
              (ps) => ps.u_id === user._id
          );
          // If paymentStatus is found, add the payment to totalCredit
          if (paymentStatus) {
              totalCredit += paymentStatus.payment;
          }
      } else {
        // Prepare data to send to API for unpaid user
        const requestData = {
            participantId: user.participantId,
            userName: user.userName,
            userPhone: user.userPhoneNo,
            bidId: bidData._id,
            payment: 0, // Set default payment for unpaid user
            bidNo: nearestBid.BidNo,
            bidDate: nearestBid.BidDate,
        };

        // Make POST API call to update paymentDue collection
        const response = await axios.post(
            'http://localhost:3001/update-payment-due',
            requestData
        );
        console.log('Payment due updated successfully:', response.data);
    }
  });

    // Prepare data to send to API
    const requestData = {
      totalCredit,
      totalDebit,
      bidId: bidData._id,
      bidNo: nearestBid.BidNo,
    };

    try {
      // Make API call to update bid data
      const response = await axios.put(`http://localhost:3001/bids/${bidData._id}/close-bid/${nearestBid.BidNo}`, requestData);
      console.log('Bid closed successfully:', response.data);
      setBidClosed(true);
      fetchBidData();
    } catch (error) {
      console.error('Error closing bid:', error);
      // Handle error response if needed
    }
  };
  

  if (!bidData) {
    return <div>Loading...</div>;
  }

  const isColumnEditable = (index) => {
    return nearestBid && nearestBid.BidNo === index + 1 && nearestBid.BidStart;
  };

  const sortedUsers = sortUsersByBidNo(bidData.users);

  return (
    <div className="container">
      <div>
        <h3 className="my-4">Bid Details</h3>
        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4 h-100">
              <div className="card-body d-flex flex-column">
                <p><strong>Bid Id:</strong> {bidData._id}</p>
                <p><strong>Amount of Gold:</strong> {bidData.BidSize}gms</p>
                <p><strong>Number of Participants:</strong> {bidData.ParticipantsCount}</p>
                <p><strong>Number of Bids:</strong> {bidData.MonthDuration}</p>
                <p><strong>Start Date:</strong> {formatDate(bidData.StartDate)}</p>
                <p><strong>End Date:</strong> {formatDate(bidData.EndDate)}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4 h-100">
              <div className="card-body d-flex flex-column">
              <p><strong>Bid Round:</strong> {nearestBid ? nearestBid.BidNo : '-'}</p>
                <p><strong>Bid Date:</strong> {nearestBid ? formatDate(nearestBid.BidDate) : '-'}</p>
                <p><strong>Bid Winner:</strong> {nearestBid ? nearestBid.BidWinner.userName : '-'}</p>
                <p><strong>Bid Value:</strong> {nearestBid ? nearestBid.BidValue : '-'}</p>
                <div className="mt-auto">
                  <button className="btn btn-success me-4" onClick={() => setShowBidModal(true)} disabled={nearestBid && nearestBid.BidStart}>Start Bid</button>
                  <button className="btn btn-danger" disabled={(nearestBid && !nearestBid.BidStart)} onClick={()=> handleCloseBid()}>Close Bid</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h5>Participants:</h5>
        <table className="table table-bordered table-fixed">
          <thead className="thead-light">
            <tr>
              <th scope="col">Sl. No</th>
              <th scope="col">User</th>
              <th scope="col">Bid No</th>
              <th scope="col">Bid (value)</th>
              <th scope="col">P/O</th>
              {[...Array(bidData.MonthDuration)].map((_, index) => (
                <th
                scope="col"
                key={index + 1}
                style={{
                  backgroundColor: isColumnEditable(index) ? 'green' : '#4E89E1',
                  color: isColumnEditable(index) ? 'white' : 'inherit'
                }}
              >
                  {index + 1}
                </th>
              ))}
              <th scope="col">Paid</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.length > 0 && sortedUsers.map((user, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{user.userName}</td>
                <td>{user.BidWinNo || '-'}</td>
                <td>{user.BidValue || '-'}</td>
                <td>{user.BidPayOut || '-'}</td>
                {[...Array(bidData.MonthDuration)].map((_, monthIndex) => (
                  <td key={monthIndex + 1}>
                    {getPaymentStatus(user._id, monthIndex + 1)}
                  </td>
                ))}
                <td>
                <input
                     type="checkbox"
                     class="check-input"
                    checked={paidUsers.includes(user._id)}
                    onChange={() => togglePaidStatus(user._id)}
                    disabled={!nearestBid || nearestBid.BidClose}
                />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn btn-primary mt-4" onClick={() => setShowSearch(!showSearch)}>
        {showSearch ? "Hide Search" : "Add User"}
      </button>

      {showSearch && (
        <div className="mt-4">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or phone number"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <div className="input-group-append">
              <button className="btn btn-outline-success" type="button" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
          
          {searchResults.length > 0 && (
            <ul className="list-group">
              {searchResults.map((user) => (
                <li
                  key={user._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {user.userName} - {user.userPhoneNo}
                  <button
                    className="btn btn-sm btn-success justify-center"
                    onClick={() => handleAddUser(user)}
                  >
                    Add <i className="ri-add-circle-fill"></i>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    <div className="mt-4">
        <h5>Bid Management Account:</h5>
        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              <th scope="col">Sl. No</th>
              <th scope="col">Account</th>
              {[...Array(bidData.MonthDuration)].map((_, index) => (
                <th scope="col" key={index + 1}>{index + 1}</th>
              ))}
              <th scope="col">Net</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Management Credit</td>
              {bidData.BidManagementAccount.map((account, index) => (
                <td key={index}>{account.ManagementCredit}</td>
              ))}
              <td>
                {bidData.BidManagementAccount.reduce((total, account) => total + account.ManagementCredit, 0)}
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>Management Debit</td>
              {bidData.BidManagementAccount.map((account, index) => (
                <td key={index}>{account.ManagementDebit}</td>
              ))}
              <td>
                {bidData.BidManagementAccount.reduce((total, account) => total + account.ManagementDebit, 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <BidModal
        show={showBidModal}
        onClose={() => setShowBidModal(false)}
        bidData={bidData}
        nearestBid={nearestBid}
        onBidStart={handleBidStart}
      />
    </div>
  );
};

export default BidPage;
