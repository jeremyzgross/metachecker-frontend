import { createSlice, createAsyncThunk, createAction, PayloadAction } from '@reduxjs/toolkit';

export interface ViewProfile {
  profile_name: string;
  codec_name: string | null;
  profile: string | null;
  width: number | null;
  height: number | null;
  field_order: string | null;
  r_frame_rate: string | null;
  duration: number | null;
  bitrate_min: number | null;
  bitrate_max: number | null;
  audio_codec_name: string | null;
  sample_rate: number | null;
  channels: number | null;
  channel_layout: string | null;
  audio_bitrate_min: number | null;
  audio_bitrate_max: number | null;
  bitrate: [number | null, number | null];
  audio_bitrate: [number | null, number | null];
}

// initial state for ViewProfile
interface ViewProfileState {
  data: ViewProfile;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ViewProfileState = {
  data: {
    profile_name: '',
    codec_name: null,
    profile: null,
    width: null,
    height: null,
    field_order: null,
    r_frame_rate: null,
    duration: null,
    bitrate_min: null,
    bitrate_max: null,
    audio_codec_name: null,
    sample_rate: null,
    channels: null,
    channel_layout: null,
    audio_bitrate_min: null,
    audio_bitrate_max: null,
    bitrate: [null, null],
    audio_bitrate: [null, null],
  },
  status: 'idle',
  error: null,
};

// Define the async thunk to fetch profile data
export const viewProfile = createAsyncThunk(
  'viewProfile/fetchProfile',
  async ({ user_id, profile_id }: { user_id: number; profile_id: number }, thunkAPI) => {
    try {
      const response = await fetch(`http://localhost:3000/api/user/${user_id}/profile/${profile_id}`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Profile fetch error:', error);
      return thunkAPI.rejectWithValue('Profile fetch failed');
    }
  }
);

export const deleteProfile = createAsyncThunk(
  'viewProfile/deleteProfile',
  async ({ user_id, profile_id }: { user_id: number; profile_id: number }, thunkAPI) => {
    try {
      const response = await fetch(`http://localhost:3000/api/user/${user_id}/profile/${profile_id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return profile_id;
    } catch (error) {
      console.error('Profile delete error:', error);
      return thunkAPI.rejectWithValue('Profile delete failed');
    }
  }
);

export const clearViewProfile = createAction('viewProfile/clear');
// Export the slice
const viewProfileSlice = createSlice({
  name: 'viewProfile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(viewProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(viewProfile.fulfilled, (state, action: PayloadAction<ViewProfile>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(viewProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(clearViewProfile, (state) => {
        // Reset the state to initial values clearing the profile space
        state.data = initialState.data;
        state.status = initialState.status;
        state.error = initialState.error;
      });
  },
});

export default viewProfileSlice.reducer;
