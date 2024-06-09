import React, { useState } from 'react'
import Login from '../features/Login'
import Register from '../features/Register'
import videoEditorImage from '../Img/video-editor.png'
import '../styles/WelcomePage.css'

const WelcomePage: React.FC = () => {
  //state if user is registering
  const [isRegistering, setIsRegistering] = useState(false)

  //helper to indicated if a user is using login or register
  const toggleRegister = () => {
    setIsRegistering(!isRegistering)
  }

  return (
    <div className="welcome-container">
      <div className="welcome-message">
        <img src={videoEditorImage} alt="image" className="welcome-image" />
        <h2>Welcome to MetaChecker!</h2>
        <p>
          MetaChecker analyzes your video's metadata for you so that they are
          optimized for whatever platform you are delivering to.
          <br />
          <br />
          For sample demo/demo for user/pass.
          <br />
          <br />
          Otherwise please make a new accouint for custom profiles
        </p>
      </div>

      {/* render depending on user login or register */}
      <div className={`form-container ${isRegistering ? 'register' : 'login'}`}>
        <h1>{isRegistering ? 'Register' : 'Login'}</h1>
        <p>Please {isRegistering ? 'register' : 'login'} to continue</p>
        {isRegistering ? <Register /> : <Login />}
        <button onClick={toggleRegister}>
          {isRegistering
            ? 'Already have an account? Login'
            : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  )
}

export default WelcomePage
