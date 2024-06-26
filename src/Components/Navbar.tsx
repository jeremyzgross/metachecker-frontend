import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../App/store'
import { logout } from '../features/loginSlice'
import { useNavigate } from 'react-router-dom'
import NotFound from './NotFound'
import '../styles/Nav.css'
import videoEditorImage from '../Img/video-editor.png'

const Navbar: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { first_name } = useSelector((state: RootState) => state.login)

  //navigate to home after logout aciton is dispatched
  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }
  //navigate to users profiles form submit
  const handleProfilesClick = () => {
    navigate('/Profiles')
  }

  //navigate to users existing profiles
  const handleViewProfilesClick = () => {
    navigate('/viewprofiles')
  }

  //if the login state is empty, forward to 404
  const isLoggedIn = !!first_name // Check if first_name is truthy

  if (!isLoggedIn) {
    return <NotFound />
  }

  return (
    <nav>
      <ul>
        <li className="image-item" onClick={() => navigate('/dashboard')}>
          <img src={videoEditorImage} alt="image" className="welcome-image" />
        </li>
        <li>
          <button onClick={() => navigate('/dashboard')}>Dashboard</button>
        </li>
        <li>
          <button onClick={handleViewProfilesClick}>View Profiles</button>
        </li>
        <li>
          <button onClick={handleProfilesClick}>Add Profiles</button>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
