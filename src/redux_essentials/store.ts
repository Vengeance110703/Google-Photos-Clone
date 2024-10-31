import { configureStore } from "@reduxjs/toolkit"
import counterReducer from "@/slices/counterSlice"
import userReducer from "@/slices/userSlice"
import generalReducer from "@/slices/generalSlice"
import photosReducer from "@/slices/photosSlice"
import albumsReducer from "@/slices/albumsSlice"

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    general: generalReducer,
    photos: photosReducer,
    albums: albumsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
