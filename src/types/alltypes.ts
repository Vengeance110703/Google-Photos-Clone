export type Album = {
  name: string
  coverPhoto: Photo | null
}

export type Photo = {
  url: string
  album: string[]
  name: string
  uuid: string
  trash: boolean
  favorite: boolean
  user: string
}

export type User = {
  name: string
  email: string
  profilePicture: string
}

export type General = {
  albums: Album[]
  currentView: string
  fullscreenPhoto: Photo | null
  selection: Photo[]
  showPermDeleteDialog: boolean
  selectedAlbum: string
  createAlbumDialog: boolean
  addPhotosDrawer: boolean
  pageList: string[]
  selectionAlbum: Album[]
}
