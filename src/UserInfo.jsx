import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import logoImg from './assets/bankpic.png';
import './styles.css';

const UserInfo = () => {
  const { user, logout} = useUser();
  const [userDetails, setUserDetails] = useState({
    iduser: '',
    username: '',
    password: '',
    cellphone: ''
  });

  // gets user info from their current stored information
  useEffect(() => {
    console.log("user data", user); // unsecure show all user data in console log
    if (user) {
      setUserDetails({
        iduser: user.IDuser || user.iduser || '',
        username: user.username || '',
        password: user.password || '',
        cellphone: user.cellphone || ''
      });
    }
  }, [user]);


  return (
    <main>
      <header id="header">
        <div className="logo-container">
          <img src={logoImg} className="logo" alt="Bank Logo" />
          <h2>National Trust Bank</h2>
        </div>
        <nav id="navbar">
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="/#">Contact</a></li>
            {user.iduser === 1  || user.IDuser === 1 && <li><a href="/lookup">Admin</a></li>}
          </ul>
        </nav>
      </header>
      <div className="info-wrapper">
        <div className="image-container"></div>
        <div className="quote-container">
          <p>A Penny Today</p>
          <p>Is a Dollar</p>
          <p>Tomorrow</p>
        </div>
        <div className="info-container">
          <div>
            <h1>Account Information</h1> 
            <p><strong>Account ID:</strong> {userDetails.iduser}</p>
            <p><strong>Username:</strong> {userDetails.username}</p>
            <p><strong>Cellphone:</strong> {userDetails.cellphone}</p>
            <button type="button" className="submit-button" onClick={logout}>Logout</button>
          </div>
        </div>
      </div>
      <footer>
        <p><a href="#">About Us</a> | <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
      </footer>
    </main>
  );
};

export default UserInfo;
