import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { setUser } from './loginSlice';

export interface RegisterState {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  email: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: RegisterState = {
  first_name: '',
  last_name: '',
  username: '',
  password: '',
  email: '',
  isLoading: false,
  error: null,
};

export const register = createAsyncThunk(
  'register/userRegister',
  async (credentials: { first_name: string; last_name: string; username: string; password: string; email: string }, thunkAPI) => {
    try {
      const response = await fetch('http://localhost:3000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log(result);

      // Dispatch action to update the login state with registered user's info
      thunkAPI.dispatch(setUser({ username: result.username, first_name: result.first_name, id: result.id }));

      return result;
    } catch (error) {
      console.error('Register error:', error);
      return thunkAPI.rejectWithValue('Register failed, user may already be taken');
    }
  }
);

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    emptyRegister(state) {
      state.first_name = '';
      state.last_name = '';
      state.username = '';
      state.password = '';
      state.email = '';
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action: PayloadAction<{ first_name: string; last_name: string; username: string; email: string; password: string }>) => {
      state.isLoading = false;
      state.first_name = action.payload.first_name;
      state.last_name = action.payload.last_name;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.password = action.payload.password;
    });
    builder.addCase(register.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { emptyRegister } = registerSlice.actions;

export default registerSlice.reducer;
