import { useAppDispatch, useAppSelector } from "@/redux_essentials/hooks"
import { updateGeneralSlice } from "@/slices/generalSlice"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu"
import { XIcon, MoreVerticalIcon } from "lucide-react"
import { Button } from "../ui/button"
import { updatePhotos } from "@/slices/photosSlice"
import { deletePhoto, updateAlbumsByUser, updatePhoto } from "@/api/databse"
import FullScreenPhotoMenuItem from "./FullScreenPhotoMenuItem"
import { updateAlbums } from "@/slices/albumsSlice"
import { Photo } from "@/types/alltypes"
import { useState } from "react"
import { Sheet, SheetClose, SheetContent } from "../ui/sheet"

const FullScreenPhoto = () => {
  const dispatch = useAppDispatch()
  const general = useAppSelector(state => state.general)
  const { fullscreenPhoto, currentView, selectedAlbum } = useAppSelector(
    state => state.general
  )
  const photos = useAppSelector(state => state.photos.value)
  const albums = useAppSelector(state => state.albums.value)
  const { email } = useAppSelector(state => state.user)

  const [showSidePanel, setShowSidePanel] = useState(false)

  const handleFavoritePhoto = async () => {
    const photo = fullscreenPhoto!
    const updatedPhoto = {
      ...photo,
      favorite: !photo.favorite,
    }

    if (currentView !== "favourites")
      dispatch(
        updateGeneralSlice({
          ...general,
          fullscreenPhoto: updatedPhoto,
        })
      )
    else closeFullscreen()
    const updatedPhotos = photos.map(photo =>
      photo.uuid === updatedPhoto.uuid ? updatedPhoto : photo
    )
    dispatch(updatePhotos(updatedPhotos))
    await updatePhoto(updatedPhoto)
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(fullscreenPhoto!.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const aTag = document.createElement("a")
      aTag.href = url
      aTag.download = fullscreenPhoto!.name
      document.body.appendChild(aTag)
      aTag.click()
      aTag.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeletePhoto = async () => {
    const photo = fullscreenPhoto!
    const updatedPhoto = {
      ...photo,
      trash: !photo.trash,
    }
    closeFullscreen()
    const updatedPhotos = photos.map(photo =>
      photo.uuid === updatedPhoto.uuid ? updatedPhoto : photo
    )
    dispatch(updatePhotos(updatedPhotos))
    updateAlbumCoverPhoto(photo, updatedPhoto)
    await updatePhoto(updatedPhoto)
  }

  const handleDeletePhotoPermanently = async () => {
    const tempPhoto = fullscreenPhoto!
    const updatedPhotos = photos.filter(photo => photo !== tempPhoto)
    closeFullscreen()
    dispatch(updatePhotos(updatedPhotos))
    await deletePhoto(tempPhoto)
    updateAlbumCoverPhoto(tempPhoto, null)
  }

  const updateAlbumCoverPhoto = async (
    photo: Photo,
    updatedPhoto: Photo | null
  ) => {
    let updateFlag = false
    const updatedAlbums = albums.map(album => {
      if (album.coverPhoto?.uuid === photo.uuid) {
        updateFlag = true
        return {
          ...album,
          coverPhoto: updatedPhoto,
        }
      }
      return album
    })
    if (updateFlag) {
      dispatch(updateAlbums(updatedAlbums))
      await updateAlbumsByUser(email, updatedAlbums)
    }
  }

  const handleUseAlbumCover = async () => {
    const updatedAlbums = albums.map(album =>
      album.name === selectedAlbum
        ? { ...album, coverPhoto: fullscreenPhoto }
        : album
    )
    await updateAlbumsByUser(email, updatedAlbums)
    dispatch(updateAlbums(updatedAlbums))
  }

  const handleRemoveAlbumCover = async () => {
    const updatedAlbums = albums.map(album =>
      album.name === selectedAlbum ? { ...album, coverPhoto: null } : album
    )
    await updateAlbumsByUser(email, updatedAlbums)
    dispatch(updateAlbums(updatedAlbums))
  }

  const handleRemoveFromAlbum = async () => {
    const photo = fullscreenPhoto!
    const updatedPhoto: Photo = {
      ...photo,
      album: photo.album.filter(album => album !== selectedAlbum),
    }
    const updatedPhotos = photos.map(photo =>
      photo.uuid === updatedPhoto.uuid ? updatedPhoto : photo
    )
    await updateAlbumCoverPhoto(photo, null)
    await updatePhoto(updatedPhoto)
    dispatch(updatePhotos(updatedPhotos))
    closeFullscreen()
  }

  const handleViewDetails = () => {
    setShowSidePanel(!showSidePanel)
  }

  // const handleViewDetails = () => {}

  const handleEscapeKey = (key: string) => {
    if (key === "Escape") closeFullscreen()
  }

  const closeFullscreen = () => {
    dispatch(
      updateGeneralSlice({
        ...general,
        fullscreenPhoto: null,
      })
    )
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex z-50 outline-none"
      onKeyDown={e => handleEscapeKey(e.key)}
      tabIndex={-1}
    >
      <div className="flex-grow flex justify-center items-center relative">
        <Button
          variant="ghost"
          className="absolute top-4 left-4 text-gray-300 hover:bg-gray-100"
          onClick={closeFullscreen}
        >
          <XIcon className="h-7 w-7" />
        </Button>
        <img
          src={fullscreenPhoto!.url}
          alt={`Photo ${fullscreenPhoto!.uuid}`}
          className="max-h-full max-w-full object-contain"
          onKeyDown={e => handleEscapeKey(e.key)}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="absolute top-4 right-4 text-gray-300 hover:bg-gray-100"
            >
              <MoreVerticalIcon className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-800 text-gray-100 mr-2">
            {currentView === "albums" && selectedAlbum !== "" && (
              <>
                {albums.find(album => album.name === selectedAlbum)?.coverPhoto
                  ?.uuid === fullscreenPhoto?.uuid ? (
                  <FullScreenPhotoMenuItem
                    onClick={handleRemoveAlbumCover}
                    text="Remove from Album Cover"
                  />
                ) : (
                  <FullScreenPhotoMenuItem
                    onClick={handleUseAlbumCover}
                    text="Use as Album Cover"
                  />
                )}
                <FullScreenPhotoMenuItem
                  onClick={handleRemoveFromAlbum}
                  text="Remove from Album"
                />
              </>
            )}

            <FullScreenPhotoMenuItem
              onClick={handleDeletePhoto}
              text={fullscreenPhoto!.trash ? "Restore" : "Delete"}
            />
            {currentView === "trash" && (
              <FullScreenPhotoMenuItem
                onClick={handleDeletePhotoPermanently}
                text="Delete Permanently"
              />
            )}
            {currentView !== "trash" && (
              <>
                <FullScreenPhotoMenuItem
                  onClick={handleDownload}
                  text="Download"
                />
                <FullScreenPhotoMenuItem
                  onClick={handleFavoritePhoto}
                  text={
                    fullscreenPhoto!.favorite
                      ? "Remove from Favorites"
                      : "Add to Favorites"
                  }
                />
                <FullScreenPhotoMenuItem
                  onClick={handleViewDetails}
                  text={showSidePanel ? "Hide Details" : "View Details"}
                />
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Sheet open={showSidePanel} onOpenChange={open => setShowSidePanel(open)}>
        <SheetContent className="w-80 bg-gray-900 p-4 overflow-y-auto border-none">
          <h2 className="text-xl font-bold mb-4 text-gray-100 flex">
            Photo Details
          </h2>
          <div className="space-y-2 text-gray-300">
            <p>
              <strong>Name:</strong> {fullscreenPhoto!.name}
            </p>
            {/* <p>
              <strong>Date:</strong>{" "}
              {new Date(fullscreenPhoto!.date).toLocaleString()}
              </p>
              <p>
              <strong>Size:</strong> {fullscreenPhoto!.size} bytes
              </p> */}
            <p>
              <strong>Favourite:</strong>{" "}
              {fullscreenPhoto!.favorite ? "Yes" : "No"}
            </p>
            <p>
              <strong>Albums:</strong>{" "}
              {fullscreenPhoto!.album.join(", ") || "None"}
            </p>
            <p className="break-all">
              <strong>Access URL:</strong> {fullscreenPhoto!.url}
            </p>
          </div>
          <SheetClose asChild>
            <Button className="text-gray-300 hover:text-gray-100 hover:bg-gray-800 rounded-full hover:font-bold text-2xl absolute right-1 top-1">
              <XIcon className="h-4 w-4" />
            </Button>
          </SheetClose>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default FullScreenPhoto
