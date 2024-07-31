import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure axios is installed and imported
import "../../css/BidArchive.css";

const BidArchive = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [archiveData, setArchiveData] = useState([]);

  // Fetch archived bids from the server
  useEffect(() => {
    const fetchArchivedBids = async () => {
      try {
        const response = await axios.get('http://localhost:3001/bids/archived-bids');
        setArchiveData(response.data);
      } catch (err) {
        console.error('Error fetching archived bids:', err);
      }
    };

    fetchArchivedBids();
  }, []);

  // Filter the archive data based on the search term
  const filteredArchive = archiveData.filter((bid) =>
    Object.values(bid)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="bid-archive-container">
      <h3>Bid Archive</h3>
      <div className="search">
        <input
          type="text"
          placeholder="Search by Bid No., Ad, etc."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-dark">Search</button>
      </div>

      <div className="table-container">
        <table className="archive-table">
          <thead>
            <tr>
              <th>Sl. No</th>
              <th>Bid No.</th>
              <th>Start</th>
              <th>End</th>
              <th>No. of Participants</th>
              <th>No. of Bids</th>
              <th>Bid Size</th>
              <th>Ad</th>
            </tr>
          </thead>
          <tbody>
            {filteredArchive.map((bid, index) => (
              <tr key={bid._id}>
                <td>{index + 1}</td>
                <td>{bid._id}</td>
                <td>{formatDate(bid.StartDate)}</td>
                <td>{formatDate(bid.EndDate)}</td>
                <td>{bid.ParticipantsCount}</td>
                <td>{bid.MonthDuration}</td>
                <td>{bid.BidSize}</td>
                <td>{bid.AD}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BidArchive;
