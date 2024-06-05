import React, { useState } from 'react';
import Login from '../features/Login';
import Register from '../features/Register';
import '../styles/WelcomePage.css';

const WelcomePage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const toggleRegister = () => {
    setIsRegistering(!isRegistering);
  };

  return (
    <div className="welcome-container">
      <div className="welcome-message">
        <h2>Welcome to MetaChecker!</h2>
        <p>MetaChecker analyzes your video's metadata for you so that they are optimized for whatever platform you are delivering to</p>
      </div>
      <div className={`form-container ${isRegistering ? 'register' : 'login'}`}>
        <h1>{isRegistering ? 'Register' : 'Login'}</h1>
        <p>Please {isRegistering ? 'register' : 'login'} to continue</p>
        {isRegistering ? <Register /> : <Login />}
        <button onClick={toggleRegister}>
          {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
