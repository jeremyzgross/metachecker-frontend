import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface QCResults {
  codec_name: boolean;
  profile: boolean;
  width: boolean;
  height: boolean;
  field_order: boolean;
  r_frame_rate: boolean;
  duration: boolean;
  bitrate: boolean;
  audio_codec_name: boolean;
  sample_rate: boolean;
  channels: boolean;
  channel_layout: boolean;
  audio_bitrate: boolean;
}

export interface ProbedMetadata {
  codec_name: string;
  profile: string;
  width: number;
  height: number;
  field_order: string;
  r_frame_rate: string;
  duration: number;
  bitrate: number;
  audio_codec_name: string;
  sample_rate: number;
  channels: number;
  channel_layout: string;
  audio_bitrate: number;
}
export interface UploadState {
  file: File | null;
  isLoading: boolean;
  error: string | null;
  qcResults: QCResults | null;
  probedMetadata: ProbedMetadata | null
}

export interface ProfileState {
  profiles: any[];
  loading: boolean;
  error: string | null;
}



const initialUploadState: UploadState = {
  file: null,
  isLoading: false,
  error: null,
  qcResults: null,
  probedMetadata: null
};

const initialProfileState: ProfileState = {
  profiles: [],
  loading: false,
  error: null,
};
//change interface to "readable names" for user from "metadata"
export const propertyNamesMap: { [key in keyof QCResults]: string } = {
  codec_name: 'Video Codec',
  profile: 'Video Profile',
  width: 'Width',
  height: 'Height',
  field_order: 'Field Order',
  r_frame_rate: 'Frame Rate',
  duration: 'Video Duration',
  bitrate: 'Video Bitrate',
  audio_codec_name: 'Audio Codec',
  sample_rate: 'Audio Sample Rate',
  channels: 'Audio Channels Number',
  channel_layout: 'Audio Channels Layout',
  audio_bitrate: 'Audio Bitrate',
};



export const uploadFile = createAsyncThunk(
  'upload/uploadFile',
  async (fileInfo: { video: File; user_id: number; profile_id: number }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('filename', fileInfo.video);
      formData.append('user_id', fileInfo.user_id.toString());
      formData.append('profile_id', fileInfo.profile_id.toString());
      const response = await fetch(`http://localhost:3000/api/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log(result);
      return result;

      
    } catch (error) {
      console.error('Upload error:', error);
      return thunkAPI.rejectWithValue('Upload failed');
    }
  }
);

export const getProfiles = createAsyncThunk(
  'profiles/getProfiles',
  async (profileInfo: { user_id: number }, thunkAPI) => {
    try {
      const response = await fetch(`http://localhost:3000/api/user/${profileInfo.user_id}`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Profile get error:', error);
      return thunkAPI.rejectWithValue('Profile fetch failed');
    }
  }
);

const uploadSlice = createSlice({
  name: 'upload',
  initialState: initialUploadState,
  reducers: {
    resetQCResults: (state) => {
      state.qcResults = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action: PayloadAction<{ QCResults: QCResults, resJSON: any }>) => {
  state.isLoading = false;
  state.qcResults = action.payload.QCResults;
  state.probedMetadata = {
    codec_name: action.payload.resJSON.allVideoData.video.codec_name,
    profile: action.payload.resJSON.allVideoData.video.profile,
    width: action.payload.resJSON.allVideoData.video.width,
    height: action.payload.resJSON.allVideoData.video.height,
    field_order: action.payload.resJSON.allVideoData.video.field_order,
    r_frame_rate: action.payload.resJSON.allVideoData.video.r_frame_rate,
    duration: action.payload.resJSON.allVideoData.video.duration,
    bitrate: action.payload.resJSON.allVideoData.video.bit_rate,
    audio_codec_name: action.payload.resJSON.allVideoData.audio.codec_name,
    sample_rate: action.payload.resJSON.allVideoData.audio.sample_rate,
    channels: action.payload.resJSON.allVideoData.audio.channels,
    channel_layout: action.payload.resJSON.allVideoData.audio.channel_layout,
    audio_bitrate: action.payload.resJSON.allVideoData.audio.bit_rate,
  };
})

      .addCase(uploadFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

const profileSlice = createSlice({
  name: 'profiles',
  initialState: initialProfileState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfiles.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.profiles = action.payload;
      })
      .addCase(getProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetQCResults } = uploadSlice.actions;
export const uploadReducer = uploadSlice.reducer;
export const profileReducer = profileSlice.reducer;
