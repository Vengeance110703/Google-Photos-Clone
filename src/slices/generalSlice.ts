import { General } from "@/types/alltypes"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: General = {
  albums: [],
  currentView: "photos",
  fullscreenPhoto: null,
  selection: [],
  selectionAlbum: [],
  showPermDeleteDialog: false,
  selectedAlbum: "",
  createAlbumDialog: false,
  addPhotosDrawer: false,
  pageList: ["photos", "albums", "favourites", "trash"],
}

const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    updateGeneralSlice: (state, action: PayloadAction<General>) => {
      const {
        currentView,
        albums,
        fullscreenPhoto,
        selection,
        selectedAlbum,
        createAlbumDialog,
        addPhotosDrawer,
        selectionAlbum,
      } = action.payload
      state.currentView = currentView
      state.albums = albums
      state.fullscreenPhoto = fullscreenPhoto
      state.selection = selection
      state.selectedAlbum = selectedAlbum
      state.createAlbumDialog = createAlbumDialog
      state.addPhotosDrawer = addPhotosDrawer
      state.selectionAlbum = selectionAlbum
    },
    reset: () => initialState,
  },
})

export const { updateGeneralSlice, reset } = generalSlice.actions
export default generalSlice.reducer
