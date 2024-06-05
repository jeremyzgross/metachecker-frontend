import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../App/store';
import { uploadFile, getProfiles, resetQCResults } from './uploadSlice';
import Results from './Results';
import '../styles/upload.css'
const Upload: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const { user_id } = useSelector((state: RootState) => state.login);
  const { profiles, loading, error } = useSelector((state: RootState) => state.profiles);

  const [video, setVideo] = useState<File | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null);

  useEffect(() => {
    if (user_id !== null) {
      dispatch(getProfiles({ user_id }));
      dispatch(resetQCResults());
    }
  }, [dispatch, user_id]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setVideo(selectedFile);
      dispatch(resetQCResults());
    } else {
      setVideo(null); 
    }
  };

  const handleProfileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProfile(Number(event.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (video && user_id !== null && selectedProfile !== null) {
      const fileInfo = { video, user_id, profile_id: selectedProfile };
      dispatch(uploadFile(fileInfo));
    }
  };

  return (
    <div className="upload-container">
      <h1>File Upload Form</h1>
      <form onSubmit={handleSubmit} className="upload-video" encType="multipart/form-data">
        <input onChange={handleFileChange} type="file" name="filename" />
        {profiles && profiles.length > 0 && (
          <select onChange={handleProfileChange} value={selectedProfile ?? ''}>
            <option value="" disabled>Select Profile</option>
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.profile_name} 
              </option>
            ))}
          </select>
        )}
        <input type="submit" value="Check Metadata" disabled={!profiles || profiles.length === 0} />
      </form>
      {loading && <p>Loading profiles...</p>}
      {error && <p>Error loading profiles: {error}</p>}
      {!loading && profiles.length === 0 && <p>No profiles in your records. Please add a profile to use this feature.</p>}
      {!loading && profiles.length > 0 && <p>Please upload a file and select a profile.</p>}
      <Results />
    </div>
  );
};

export default Upload;
