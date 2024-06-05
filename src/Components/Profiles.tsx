import React from 'react'
import AddProfile from '../features/AddProfile'
// import { useNavigate } from 'react-router-dom';
// import { logout } from '../features/loginSlice';
// import { persistor } from '../App/store';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../App/store';
import NotFound from './NotFound'; 
import Navbar from './Navbar';


const Profiles : React.FC = ()=>{
  // const navigate = useNavigate()
  // const dispatch = useDispatch();
  const { first_name } = useSelector((state: RootState) => state.login);
   const isLoggedIn = !!first_name; // Check if first_name is truthy

  if (!isLoggedIn) {
    return <NotFound />; //404 page
  }


  // const handleDashboardClick = () => {
  //   navigate('/dashboard');
  // };
  //   const logOutHandler = () => {
  //   // Dispatch the logout action
  //   dispatch(logout());
  //   // Redirect to the login page or any other page after logout
  //   persistor.purge();
  //   dispatch(logout());
  //   navigate('/');
  // }

  return (
    <>
    <Navbar/>
    <h1>Profiles Page</h1>
    {/* <button  onClick={handleDashboardClick}>Dashboard</button>
    <button onClick={logOutHandler}>Logout</button> */}
    <AddProfile/>
    </>
  )
}

export default Profiles