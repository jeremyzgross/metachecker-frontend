import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface VideoProfileFormData {
  user_id: number| null
  profile_name: string,
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

interface VideoProfileState {
  data: VideoProfileFormData;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: VideoProfileState = {
  data: {
    user_id: 0,
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

export const addProfile = createAsyncThunk(
  'addProfile/addVideoProfileFormData',
  async (VideoFormDataToSend: VideoProfileFormData, thunkAPI) => {
    try {
      const response = await fetch('http://localhost:3000/api/addvideoprofile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(VideoFormDataToSend),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue('Error on thunk adding profile');
    }
  }
);

export const addProfileSlice = createSlice({
  name: 'addProfile',
  initialState,
  reducers: {
    emptyVideoProfileFormData(state) {
      state.data = {
        user_id: 0,
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
      };
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(addProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { emptyVideoProfileFormData } = addProfileSlice.actions;

export default addProfileSlice.reducer;
