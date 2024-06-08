import React from 'react'
import AddProfile from '../features/AddProfile'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../App/store'
import NotFound from './NotFound'
import Navbar from './Navbar'

const Profiles: React.FC = () => {
  const { first_name } = useSelector((state: RootState) => state.login)
  const isLoggedIn = !!first_name // Check if first_name is truthy

  if (!isLoggedIn) {
    return <NotFound /> //404 page
  }

  return (
    <>
      <Navbar />
      <div className="add-profile-container">
        <AddProfile />
      </div>
    </>
  )
}

export default Profiles
