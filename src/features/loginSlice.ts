import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

//login type for state
export interface UserLoginState {
  username: string
  isLoading: boolean
  error: string | null
  first_name: string
  user_id: number | null
}

//initial login state
const initialState: UserLoginState = {
  username: '',
  isLoading: false,
  error: null,
  first_name: '',
  user_id: null,
}

//login post request
export const login = createAsyncThunk(
  'login/userLogin',
  async (credentials: { username: string; password: string }, thunkAPI) => {
    try {
      const response = await fetch(
        'https://metachecker-server.onrender.com/api/login/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        }
      )
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Login error:', error)
      return thunkAPI.rejectWithValue('Login failed')
    }
  }
)

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    logout(state) {
      Object.assign(state, initialState)
    },
    //help with persistent state issues after logout
    resetState(state) {
      Object.assign(state, initialState)
    },
    
    //set state of user after login
    setUser(
      state,
      action: PayloadAction<{
        username: string
        first_name: string
        id: number
      }>
    ) {
      state.username = action.payload.username
      state.first_name = action.payload.first_name
      state.user_id = action.payload.id
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(
      login.fulfilled,
      (
        state,
        action: PayloadAction<{
          username: string
          first_name: string
          id: number
        }>
      ) => {
        state.isLoading = false
        state.username = action.payload.username
        state.first_name = action.payload.first_name
        state.user_id = action.payload.id
      }
    )
    builder.addCase(login.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.error = action.payload
      if (action.payload && action.payload.status === 500) {
        console.error('Server error:', action.payload)
      }
    })
  },
})

export const { logout, setUser } = loginSlice.actions

export default loginSlice.reducer
