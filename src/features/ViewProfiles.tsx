import '../styles/viewProfiles.css'
import React, { useState, useEffect } from 'react'
import { RootState, AppDispatch } from '../App/store'
import { useDispatch, useSelector } from 'react-redux'
import { getProfiles } from './uploadSlice'
import { viewProfile, ViewProfile } from './ViewProfilesSlice'
import { deleteProfile } from './ViewProfilesSlice'
import { useNavigate } from 'react-router-dom'
import { clearViewProfile } from './ViewProfilesSlice'
import Navbar from '../Components/Navbar'
import '../styles/viewProfiles.css'

const ViewProfiles: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()
  const navigate = useNavigate()
  const { user_id } = useSelector((state: RootState) => state.login)
  const { profiles, error } = useSelector((state: RootState) => state.profiles)
  const { data, status } = useSelector((state: RootState) => state.viewProfile)

  const [selectedProfile, setSelectedProfile] = useState<number | null>(null)
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null)

  useEffect(() => {
    if (user_id !== null) {
      dispatch(getProfiles({ user_id }))
    }
    return () => {
      dispatch(clearViewProfile())
    }
  }, [dispatch, user_id])

  const handleProfileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProfileId = Number(event.target.value)
    setSelectedProfile(selectedProfileId)
    if (user_id !== null && selectedProfileId !== null) {
      dispatch(viewProfile({ user_id, profile_id: selectedProfileId }))
    }
  }

  const handleDeleteConfirmation = () => {
    setShowConfirmation(true)
  }

  const handleDeleteCancel = () => {
    setShowConfirmation(false)
  }

  const handleProfileDelete = () => {
    setShowConfirmation(false)
    if (user_id !== null && selectedProfile !== null) {
      dispatch(deleteProfile({ user_id, profile_id: selectedProfile })).then(
        (resultAction) => {
          if (deleteProfile.fulfilled.match(resultAction)) {
            setDeleteMessage('Profile deleted')
            setTimeout(() => {
              setDeleteMessage(null)
              navigate('/dashboard')
            }, 2000) // Display the message for 2 seconds before navigating back
          }
        }
      )
    }
  }

  const getFieldInfo = (
    key: keyof ViewProfile
  ): { label: string; unit: string } => {
    const propertyNamesMap: {
      [key in keyof ViewProfile]: { label: string; unit: string }
    } = {
      profile_name: { label: 'Profile Name', unit: '' },
      codec_name: { label: 'Video Codec', unit: '' },
      profile: { label: 'Video Profile', unit: '' },
      width: { label: 'Width', unit: 'px' },
      height: { label: 'Height', unit: 'px' },
      field_order: { label: 'Field Order', unit: '' },
      r_frame_rate: { label: 'Frame Rate', unit: 'fps' },
      duration: { label: 'Video Duration', unit: '' },
      bitrate_min: { label: 'Minimum Video Bitrate', unit: '' },
      bitrate_max: { label: 'Maximum Video Bitrate', unit: '' },
      audio_codec_name: { label: 'Audio Codec', unit: '' },
      sample_rate: { label: 'Audio Sample Rate', unit: '' },
      channels: { label: 'Audio Channels', unit: '' },
      channel_layout: { label: 'Audio Channel Layout', unit: '' },
      audio_bitrate_min: { label: 'Minimum Audio Bitrate', unit: '' },
      audio_bitrate_max: { label: 'Maximum Audio Bitrate', unit: '' },
      bitrate: { label: 'Bitrate', unit: '' },
      audio_bitrate: { label: 'Audio Bitrate', unit: '' },
    }
    return propertyNamesMap[key] || { label: key.toString(), unit: '' }
  }

  return (
    <>
      <Navbar />
      <div className="view-profiles-container">
        <h1>View Profiles</h1>
        <select onChange={handleProfileChange} value={selectedProfile ?? ''}>
          <option value="" disabled>
            Select Profile
          </option>
          {profiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.profile_name}
            </option>
          ))}
        </select>
        {status === 'loading' && <div>Loading...</div>}
        {status === 'failed' && <div>Error: {error}</div>}
        {status === 'succeeded' && (
          <div>
            <h2>Selected Profile:</h2>
            <table>
              <thead>
                <tr>
                  <th>Metadata Type</th>
                  <th>Metadata</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data).map(([key, value]) => {
                  const fieldInfo = getFieldInfo(key as keyof ViewProfile)
                  return (
                    <tr key={key}>
                      <td>{fieldInfo.label}</td>
                      <td>{`${value} ${fieldInfo.unit}`}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {deleteMessage && <p>{deleteMessage}</p>}
            <button
              className="delete-button"
              onClick={handleDeleteConfirmation}
            >
              Delete Profile
            </button>
          </div>
        )}
        {showConfirmation && (
          <div className="confirmation-dialog">
            <p>Are you sure you want to delete this profile?</p>
            <button className="confirm-button" onClick={handleProfileDelete}>
              Yes
            </button>
            <button className="cancel-button" onClick={handleDeleteCancel}>
              No
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default ViewProfiles
