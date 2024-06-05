import React, { useState, useEffect } from 'react';
import { RootState, AppDispatch } from '../App/store';
import { useDispatch, useSelector } from 'react-redux';
import { getProfiles } from './uploadSlice';
import { viewProfile, ViewProfile } from './ViewProfilesSlice'; 
import { deleteProfile } from './ViewProfilesSlice';
import { useNavigate } from 'react-router-dom';
import { clearViewProfile } from './ViewProfilesSlice';
import Navbar from '../Components/Navbar';
const ViewProfiles: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate()
  const { user_id } = useSelector((state: RootState) => state.login);
  const { profiles, error } = useSelector((state: RootState) => state.profiles);
  const { data, status } = useSelector((state: RootState) => state.viewProfile);

  const [selectedProfile, setSelectedProfile] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

useEffect(() => {
  if (user_id !== null) {
    dispatch(getProfiles({ user_id }));
  }
  // clear the profiles space
  return () => {
    dispatch(clearViewProfile());
  };
}, [dispatch, user_id]);

  const handleProfileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProfileId = Number(event.target.value);
    setSelectedProfile(selectedProfileId);
    if (user_id !== null && selectedProfileId !== null) {
      dispatch(viewProfile({ user_id, profile_id: selectedProfileId }));
    }
  };

  const handleDeleteConfirmation = () => {
    setShowConfirmation(true);
  };

  const handleDeleteCancel = () => {
    setShowConfirmation(false);
  };

  const handleProfileDelete = () => {
    setShowConfirmation(false);
    if (user_id !== null && selectedProfile !== null) {
      dispatch(deleteProfile({ user_id, profile_id: selectedProfile })).then((resultAction) => {
        if (deleteProfile.fulfilled.match(resultAction)) {
          setDeleteMessage('Profile deleted');
          setTimeout(() => {
            setDeleteMessage(null);
            navigate('/dashboard');
          }, 2000); // Display the message for 2 seconds before navigating back
        }
      });
    }
  };

  // Function to retrieve 'readable' name from metadata name
  const getReadableName = (key: keyof ViewProfile): string => {
    const propertyNamesMap: { [key in keyof ViewProfile]: string } = {
      profile_name: 'Profile Name',
      codec_name: 'Video Codec',
      profile: 'Video Profile',
      width: 'Width',
      height: 'Height',
      field_order: 'Field Order',
      r_frame_rate: 'Frame Rate',
      duration: 'Video Duration',
      bitrate_min: 'Minimum Video Bitrate',
      bitrate_max: 'Maximum Video Bitrate',
      audio_codec_name: 'Audio Codec',
      sample_rate: 'Audio Sample Rate',
      channels: 'Audio Channels',
      channel_layout: 'Audio Channel Layout',
      audio_bitrate_min: 'Minimum Audio Bitrate',
      audio_bitrate_max: 'Maximum Audio Bitrate',
      bitrate: 'Bitrate',
      audio_bitrate: 'Audio Bitrate',
    };
    return propertyNamesMap[key] || key.toString();
  };

  return (
    <>
    <Navbar/>
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
          <h2>Results:</h2>
          <table>
            <thead>
              <tr>
                <th>Metadata Type</th>
                <th>Metadata</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data).map(([key, value]) => (
                <tr key={key}>
                  <td>{getReadableName(key as keyof ViewProfile)}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
           {deleteMessage && <p>{deleteMessage}</p>}
          <button style={{backgroundColor: "red"}} className='delete-button' onClick={handleDeleteConfirmation}>Delete Profile</button>
        </div>
      )}
      {showConfirmation && (
        <div>
          <p>Are you sure you want to delete this profile?</p>
          <button style={{backgroundColor: "red"}} className='delete-button' onClick={handleProfileDelete}>Yes</button>
          <button style={{backgroundColor: "red"}} className='delete-button' onClick={handleDeleteCancel}>No</button>
        </div>
      )}
    </>
  );
};

export default ViewProfiles;
