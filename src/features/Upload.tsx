import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../App/store'
import { uploadFile, getProfiles, resetQCResults } from './uploadSlice'
import Results from './Results'
import '../styles/upload.css'

const Upload: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()

  //uses state of user_id for api post request
  const { user_id } = useSelector((state: RootState) => state.login)

  //load profiles from api get profiles request
  const {
    profiles,
    loading: profilesLoading,
    error,
  } = useSelector((state: RootState) => state.profiles)

  //loading state
  const { isLoading: uploadLoading } = useSelector(
    (state: RootState) => state.upload
  )

  //state of video attached. Either null or a file
  const [video, setVideo] = useState<File | null>(null)

  //selected profile state. Either null or a profile id number
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null)

  //on load, gets profiles baed on user_id and resets any qc results from previous sessions
  useEffect(() => {
    if (user_id !== null) {
      dispatch(getProfiles({ user_id }))
      dispatch(resetQCResults())
    }
  }, [dispatch, user_id])

  //handler for uploading file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setVideo(selectedFile)
      dispatch(resetQCResults())
    } else {
      setVideo(null)
    }
  }

  //handler for profile selected
  const handleProfileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProfile(Number(event.target.value))
  }

  //submit handler for upload request
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (video && user_id !== null && selectedProfile !== null) {
      const fileInfo = { video, user_id, profile_id: selectedProfile }
      dispatch(uploadFile(fileInfo))
    }
  }

  return (
    <div className="upload-container">
      <h1>File Upload Form</h1>
      <form
        onSubmit={handleSubmit}
        className="upload-video"
        encType="multipart/form-data"
      >
        <input onChange={handleFileChange} type="file" name="filename" />
        {profiles && profiles.length > 0 && (
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
        )}
        <br />
        <input
          type="submit"
          value="Check Metadata"
          disabled={!profiles || profiles.length === 0 || uploadLoading}
          style={{
            backgroundColor: '#32bc2b',
            color: '#fff',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            padding: '10px',
            width: 'auto', // Set width to auto
            marginBottom: '15px',
          }}
        />
      </form>
      {profilesLoading && <p>Loading profiles...</p>}
      {error && <p>Error loading profiles: {error}</p>}
      {!profilesLoading && profiles.length === 0 && (
        <p>
          No profiles in your records. Please add a profile to use this feature.
        </p>
      )}
      {!profilesLoading && profiles.length > 0 && !uploadLoading && (
        <p>Please upload a file and select a profile.</p>
      )}
      {uploadLoading && <p>Uploading file...</p>}
      <Results />
    </div>
  )
}

export default Upload
