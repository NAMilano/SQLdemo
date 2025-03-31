import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useUser } from './UserContext'; 
import logoImg from './assets/bankpic.png';
import './styles.css';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cellphone, setCellphone] = useState('');
  const { login } = useUser(); 
  const navigate = useNavigate(); 

  // default user object
  const defaultUser = {
    iduser: '',
    username: '',
    password: '',
    cellphone: '',
  };
  
  // handles login submission
  const handleLogin = async (e) => {
    e.preventDefault(); // dont allow blank entries
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("user data", data); // unsecure show all user data in console log
        login(data); // Store user data in context
        navigate('/user'); // navigate to the user info page after successful login
      } else {
        alert('Invalid username and/or password. Please try again.');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };
  
  // handle account creation submission
  const handleCreateAccount = async (e) => {
    e.preventDefault(); // dont allow blank entries

    // Create the new user object
    const newUser = {
      ...defaultUser,
      username: username,   
      password: password,    
      cellphone: cellphone,  
    };
  
    try {
      console.log(newUser);
      const response = await fetch('http://localhost:5000/api/createUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("user data", data); // unsecure show all user data in console log
        login(data); // store user data in context
        navigate('/user'); // navigate to the user info page after successful account creation
      } else {
        alert('Error creating account');
      }
    } catch (err) {
      console.error('Account creation failed:', err);
    }
  };
  

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
            <li><a href="#">Contact</a></li>
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
          <div className="tab-buttons">
            <button className={activeTab === 'login' ? 'active' : ''} onClick={() => setActiveTab('login')}>Login</button>
            <button className={activeTab === 'create' ? 'active' : ''} onClick={() => setActiveTab('create')}>Create Account</button>
          </div>
          {activeTab === 'login' ? (
            <div>
              <h1>Login</h1>
              <form onSubmit={handleLogin}>
                <label htmlFor="username">Username:</label>
                <input type="username" id="username" name="username" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" className="submit-button">Login</button>
              </form>
            </div>
          ) : (
            <div>
              <h1>Create Account</h1>
              <form onSubmit={handleCreateAccount}>
                <label htmlFor="username">Username:</label>
                <input type="username" id="username" name="username" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <label htmlFor="cellphone">Cellphone (No Dashes):</label>
                <input type="text" id="cellphone" name="cellphone" placeholder="Enter your cellphone" value={cellphone} onChange={(e) => setCellphone(e.target.value)} required />
                <button type="submit" className="submit-button">Sign Up</button>
              </form>
            </div>
          )}
        </div>
      </div>
      <footer>
        <p><a href="#">About Us</a> | <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
      </footer>
    </main>
  );
};

export default LoginPage;
