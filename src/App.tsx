import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import WelcomePage from './Components/WelcomePage'
import Dashboard from './Components/Dashboard'
// import Profiles from './Components/Profiles'
import AddProfile from './features/AddProfile'
import NotFound from './Components/NotFound'
import ViewProfiles from './features/ViewProfiles'
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profiles" element={<AddProfile />} />
        <Route path="viewprofiles" element={<ViewProfiles />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
