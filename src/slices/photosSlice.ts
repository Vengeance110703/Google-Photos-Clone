import { Photo } from "@/types/alltypes"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type photosState = {
  value: Photo[]
}

const initialState: photosState = {
  value: [],
}

const photosSlice = createSlice({
  name: "photos",
  initialState,
  reducers: {
    updatePhotos: (state, action: PayloadAction<Photo[]>) => {
      state.value = action.payload
    },
  },
})

export const { updatePhotos } = photosSlice.actions
export default photosSlice.reducer
