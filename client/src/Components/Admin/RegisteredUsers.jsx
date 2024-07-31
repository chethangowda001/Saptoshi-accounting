import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../../css/RegisteredUsers.css"; // Import the corresponding CSS file

const RegisteredUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/participants/all');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="registered-users-container">
      <h3>Registered Users</h3>
      <table className="registered-users-table">
        <thead>
          <tr>
            <th>Sl No.</th>
            <th>User Name</th>
            <th>Phone No.</th>
            <th>Email</th>
            <th>Address</th>
            <th>Created Date</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.userName}</td>
              <td>{user.userPhoneNo}</td>
              <td>{user.userEmail}</td>
              <td>{user.address}</td>
              <td>{formatDate(user.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegisteredUsers;
