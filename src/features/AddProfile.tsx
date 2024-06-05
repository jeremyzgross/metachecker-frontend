import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../App/store';
import { addProfile } from './AddProfileSlice';
import { VideoProfileFormData } from './AddProfileSlice';
import '../styles/addProfiles.css';  

const AddProfile: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { status, error } = useSelector((state: RootState) => state.addProfile);
  const { user_id } = useSelector((state: RootState) => state.login);

  const [formData, setFormData] = useState<VideoProfileFormData>({
    user_id: null,
    profile_name: '',
    codec_name: 'h264',
    profile: 'main',
    width: 1920,
    height: 1080,
    field_order: 'progressive',
    r_frame_rate: '30/1',
    duration: 600,
    bitrate_min: 1900,
    bitrate_max: 3000,
    audio_codec_name: 'aac', // Default audio codec for h264
    sample_rate: 48000,
    channels: 2,
    channel_layout: 'stereo',
    audio_bitrate_min: 128,
    audio_bitrate_max: 192,
    bitrate: [1900, 3000],
    audio_bitrate: [128, 192],
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user_id) {
      setFormData((prevData) => ({ ...prevData, user_id }));
    }
  }, [user_id]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formDataToSend: VideoProfileFormData = {
      ...formData,
      bitrate: [formData.bitrate_min, formData.bitrate_max],
      audio_bitrate: [formData.audio_bitrate_min, formData.audio_bitrate_max],
    };
    dispatch(addProfile(formDataToSend)).then((result) => {
      if (addProfile.fulfilled.match(result)) {
        setSuccessMessage(`Profile '${formData.profile_name}' added successfully!`);
        setFormData({
          user_id: user_id,
          profile_name: '',
          codec_name: 'h264',
          profile: 'main',
          width: 1920,
          height: 1080,
          field_order: 'progressive',
          r_frame_rate: '30/1',
          duration: 600,
          bitrate_min: 1900,
          bitrate_max: 3000,
          audio_codec_name: 'aac', // Reset to default audio codec for h264
          sample_rate: 48000,
          channels: 2,
          channel_layout: 'stereo',
          audio_bitrate_min: 128,
          audio_bitrate_max: 192,
          bitrate: [1900, 3000],
          audio_bitrate: [128, 192],
        });
      }
    });
  };

  // Options for audio codec based on selected video codec
  const audioCodecOptions = formData.codec_name === 'h264'
    ? [
        { shortName: 'aac', longName: 'AAC' },
        { shortName: 'mp3', longName: 'MP3' }
      ]
    : [
        { shortName: 'pcm_alaw', longName: 'PCM A-law' },
        { shortName: 'pcm_f32be', longName: 'PCM 32-bit floating-point big-endian' },
        { shortName: 'pcm_f32le', longName: 'PCM 32-bit floating-point little-endian' },
        { shortName: 'pcm_f64be', longName: 'PCM 64-bit floating-point big-endian' },
        { shortName: 'pcm_f64le', longName: 'PCM 64-bit floating-point little-endian' },
        { shortName: 'pcm_mulaw', longName: 'PCM mu-law' },
        { shortName: 'pcm_s16be', longName: 'PCM signed 16-bit big-endian' },
        { shortName: 'pcm_s16le', longName: 'PCM signed 16-bit little-endian' },
        { shortName: 'pcm_s24be', longName: 'PCM signed 24-bit big-endian' },
        { shortName: 'pcm_s24le', longName: 'PCM signed 24-bit little-endian' },
        { shortName: 'pcm_s32be', longName: 'PCM signed 32-bit big-endian' },
        { shortName: 'pcm_s32le', longName: 'PCM signed 32-bit little-endian' },
        { shortName: 'pcm_s8', longName: 'PCM signed 8-bit' },
        { shortName: 'pcm_u16be', longName: 'PCM unsigned 16-bit big-endian' },
        { shortName: 'pcm_u16le', longName: 'PCM unsigned 16-bit little-endian' },
        { shortName: 'pcm_u24be', longName: 'PCM unsigned 24-bit big-endian' },
        { shortName: 'pcm_u24le', longName: 'PCM unsigned 24-bit little-endian' },
        { shortName: 'pcm_u32be', longName: 'PCM unsigned 32-bit big-endian' },
        { shortName: 'pcm_u32le', longName: 'PCM unsigned 32-bit little-endian' },
        { shortName: 'pcm_u8', longName: 'PCM unsigned 8-bit' }
      ];

  return (
    <div className="upload-container">
      <h1>Profile Form</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Profile Name:
          <input type="text" name="profile_name" value={formData.profile_name ?? ''}
          onChange={handleInputChange} required/>
        </label>
        <br />
        <label>
          Codec Name:
          <select name="codec_name" value={formData.codec_name ?? ''} onChange={handleInputChange}>
            <option value="h264">h264</option>
            <option value="prores">prores</option>
          </select>
        </label>
        <br />
        <label>
          Profile:
          <input type="text" name="profile" value={formData.profile ?? ''} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Width:
          <input type="number" name="width" value={formData.width ?? ''} onChange={handleInputChange} />
          px </label>
        <br />
        <label>
          Height:
          <input type="number" name="height" value={formData.height ?? ''} onChange={handleInputChange} />
          px </label>
        <br />
        <label>
          Field Order:
          <select name="field_order" value={formData.field_order ?? ''} onChange={handleInputChange}>
            <option value="progressive">Progressive</option>
            <option value="tb">Top Field First</option>
          </select>
        </label>
        <br />
        <label>
          Frame Rate:
          <input type="text" name="r_frame_rate" value={formData.r_frame_rate ?? ''} onChange={handleInputChange} />
          fps</label>
        <br />
        <label>
          Duration:
          <input type="number" name="duration" value={formData.duration ?? ''} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Video Bitrate (Min):
          <input type="number" name="bitrate_min" value={formData.bitrate_min ?? ''} onChange={handleInputChange} />
          Kbps</label>
        <br />
        <label>
          Video Bitrate (Max):
          <input type="number" name="bitrate_max" value={formData.bitrate_max ?? ''} onChange={handleInputChange} />
          Kbps</label>
        <br />
        <label>
          Audio Codec Name:
          <select name="audio_codec_name" value={formData.audio_codec_name ?? ''} onChange={handleInputChange}>
            {audioCodecOptions.map(option => (
              <option key={option.shortName} value={option.shortName}>{option.longName}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Sample Rate:
          <input type="number" name="sample_rate" value={formData.sample_rate ?? ''} onChange={handleInputChange} />
          Hz</label>
        <br />
        <label>
          Channels:
          <input type="number" name="channels" value={formData.channels ?? ''} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Channel Layout:
          <input type="text" name="channel_layout" value={formData.channel_layout ?? ''} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Audio Bitrate (Min):
          <input type="number" name="audio_bitrate_min" value={formData.audio_bitrate_min ?? ''} onChange={handleInputChange} />
          Kbps</label>
        <br />
        <label>
          Audio Bitrate (Max):
          <input type="number" name="audio_bitrate_max" value={formData.audio_bitrate_max ?? ''} onChange={handleInputChange} />
          Kbps</label>
        <br />
        <input type="submit" value="Add Profile" />
      </form>
      {successMessage && <p>{successMessage}</p>}
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
    </div>
  );
};

export default AddProfile;
