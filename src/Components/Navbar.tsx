import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../App/store';
import { logout } from '../features/loginSlice';
import { useNavigate } from 'react-router-dom';
import NotFound from './NotFound';
import '../styles/Nav.css'

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { first_name } = useSelector((state: RootState) => state.login);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleProfilesClick = () => {
    navigate('/Profiles');
  };

  const handleViewProfilesClick = () => {
    navigate('/viewprofiles');
  };

  const isLoggedIn = !!first_name; // Check if first_name is truthy

  if (!isLoggedIn) {
    return <NotFound />;
  }

  return (
    <nav>
      <ul>
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
  );
};

export default Navbar;
