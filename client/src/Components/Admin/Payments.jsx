import React from 'react';
import { Link } from 'react-router-dom';
import "../../css/Payments.css"; // Import the corresponding CSS file

const Payments = () => {
  const paymentsData = [
    { slNo: 1, name: 'Aditya', bidId: 'BID001', phoneNo: '123-456-7890', dues: 500, bidNo: 'BID001', deadline: '15/01/2023' },
    // Add more payment data as needed
  ];

  // Calculate total amount of due pending
  const totalDuePending = paymentsData.reduce((total, payment) => total + payment.dues, 0);

  return (
    <div className="payments-container">
      <h3>Payments Details</h3>
      <table className="payments-table">
        <thead>
          <tr>
            <th>Sl No.</th>
            <th>Name</th>
            <th>BID-Id</th>
            <th>Phone No</th>
            <th>Dues (g)</th>
            <th>Bid No.</th>
            <th>Deadline</th>
          </tr>
        </thead>
        <tbody>
          {paymentsData.map((payment) => (
            <tr key={payment.bidId}>
              <td>{payment.slNo}</td>
              <td>{payment.name}</td>
              <td>
                <Link to={`/bidder-details/${payment.bidId}`}>{payment.bidId}</Link>
              </td>
              <td>{payment.phoneNo}</td>
              <td>{payment.dues}</td>
              <td>{payment.bidNo}</td>
              <td>{payment.deadline}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary of Total Due Pending */}
      <div className="payments-summary">
        <strong>Total Amount of Due Pending:</strong> {totalDuePending}g
      </div>
    </div>
  );
};

export default Payments;
