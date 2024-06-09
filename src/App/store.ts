// src/app/store.ts

import { configureStore } from '@reduxjs/toolkit'
import loginReducer from '../features/loginSlice'
import registerReducer from '../features/registerSlice'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'
import { uploadReducer } from '../features/uploadSlice'
import { profileReducer } from '../features/uploadSlice'
import addProfileReducer from '../features/AddProfileSlice'
import viewProfileReducer from '../features/ViewProfilesSlice'

const persistConfig = {
  key: 'root',
  storage,
}

//main reducer
const rootReducer = combineReducers({
  login: loginReducer,
  register: registerReducer,
  upload: uploadReducer,
  profiles: profileReducer,
  addProfile: addProfileReducer,
  viewProfile: viewProfileReducer,
})

//persist state until change to avoid a reset on reload or page change
const persistedReducer = persistReducer(persistConfig, rootReducer)

//reducing the persist state
export const store = configureStore({
  reducer: persistedReducer,
})

//export persist state, 'useSelect' and 'useDispatch' types
export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
