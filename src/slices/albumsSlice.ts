import { Album } from "@/types/alltypes"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type albumsState = {
  value: Album[]
}

const initialState: albumsState = {
  value: [],
}

const albumsSlice = createSlice({
  name: "albums",
  initialState,
  reducers: {
    updateAlbums: (state, action: PayloadAction<Album[]>) => {
      state.value = action.payload
    },
  },
})

export const { updateAlbums } = albumsSlice.actions
export default albumsSlice.reducer
