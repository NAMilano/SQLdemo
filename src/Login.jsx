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

  // handle login submission
  const handleLogin = async (e) => {
    e.preventDefault(); // dont allow empty input fields
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        login(data); // Store user data in context
        navigate('/user'); // naigate to the user info page after successful login
      } else {
        alert('Invalid username and/or password. Please try again.');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };
  
  // handle account creation submission
  const handleCreateAccount = async (e) => {
    e.preventDefault(); // dont all empty input fields
  
    // validate the username, password, and cellphone user inputs
    // only alphanumeric characters are allowed for the username
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      alert("Username must be alphanumeric");
      return;
    }
    // username must be at least 3 characters long
    if (username.length < 3) {
      alert("Username must be at least 3 characters long");
      return;
    }
    // password must be at least 5 characters long
    if (password.length < 5) {
      alert("Password must be at least 5 characters long");
      return;
    }
    // password must contain at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      alert("Password must contain at least one lowercase letter.");
      return;
    }
    // password must contain at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      alert("Password must contain at least one uppercase letter.");
      return;
    }
    // password must contain at least one number
    if (!/\d/.test(password)) {
      alert("Password must contain at least one number.");
      return;
    }
    // password must contain at least one special character from !@#$%^&*
    if (!/[!@#$%^&*]/.test(password)) {
      alert("Password must contain at least one of the following special characters !@#$%^&*");
      return;
    }
    // password cannot contain the following characters '\";()|\\<>-.
    if (/['";()|\\<>-]/.test(password)) {
      alert("Password cannot contain the following special characters '\";()|\\<>-.");
      return;
    }
    // cellphone must be 10 digits long and only numbers (no dashes)
    if (!/^[0-9]{10}$/.test(cellphone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }
  
    // Create the new user object
    const newUser = {
      ...defaultUser,
      username: username.trim(),    // trim any off extra spaces
      password: password.trim(),    // trim any off extra spaces
      cellphone: cellphone.trim(),  // trim any off extra spaces
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/createUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
  
      if (response.ok) {
        const data = await response.json();
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
