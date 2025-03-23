import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Login';
import UserInfo from './UserInfo';
import { UserProvider } from './UserContext';

function App() {
  return (
    <UserProvider> 
      <Router
        future={{ 
          v7_startTransition: true, 
          v7_relativeSplatPath: true 
        }}
      >
        <Routes>
          <Route path="/" element={<LoginPage />} /> 
          <Route path="/user" element={<UserInfo />} /> 
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
