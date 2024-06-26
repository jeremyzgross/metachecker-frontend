import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../App/store'
import Upload from '../features/Upload'
import NotFound from './NotFound'
import '../styles/dashboard.css'
import Navbar from './Navbar'

//main dashboard component
const Dashboard: React.FC = () => {
  //get first name from logged in user state
  const { first_name } = useSelector((state: RootState) => state.login)
  
  //if the login state is empty, forward to 404
  const isLoggedIn = !!first_name // Check if first_name is truthy
  if (!isLoggedIn) {
    return <NotFound /> //404 page
  }

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h1 className='header'>Welcome to the Dashboard, {first_name}!</h1>
        <Upload />
      </div>
    </div>
  )
}

export default Dashboard
