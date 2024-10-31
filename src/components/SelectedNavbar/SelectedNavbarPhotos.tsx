import { useAppDispatch, useAppSelector } from "@/redux_essentials/hooks"
import { StarIcon, XIcon } from "lucide-react"
import { Button } from "../ui/button"
import { updateGeneralSlice } from "@/slices/generalSlice"
import { updatePhotos } from "@/slices/photosSlice"
import { deletePhoto, updateAlbumsByUser, updatePhoto } from "@/api/databse"
import { Photo } from "@/types/alltypes"
import SelectedNavbarButton from "./SelectedNavbarButton"
import { updateAlbums } from "@/slices/albumsSlice"

const SelectedNavbarPhotos = () => {
  const { email } = useAppSelector(state => state.user)
  const general = useAppSelector(state => state.general)
  const { selection, currentView, selectedAlbum } = useAppSelector(
    state => state.general
  )
  const photos = useAppSelector(state => state.photos.value)
  const albums = useAppSelector(state => state.albums.value)
  const dispatch = useAppDispatch()

  const handleDelete = async () => {
    const updatedPhotos = await Promise.all(
      photos.map(async photo => {
        const updatedPhoto = { ...photo, trash: true }
        if (selection.includes(photo)) {
          await updatePhoto(updatedPhoto)
          await updateAlbumCoverPhoto(photo, updatedPhoto)
          return updatedPhoto
        }
        return photo
      })
    )
    updatePhotosAndCancelSelection(updatedPhotos)
  }

  const handleDeletePermanently = async () => {
    const tempPhotos = selection
    const updatedPhotos = photos.filter(photo => !selection.includes(photo))

    let updateFlag = false
    const updatedAlbums = albums.map(album => {
      if (album.coverPhoto && selection.includes(album.coverPhoto)) {
        updateFlag = true
        return {
          ...album,
          coverPhoto: null,
        }
      }
      return album
    })
    dispatch(updatePhotos(updatedPhotos))
    if (updateFlag) {
      dispatch(updateAlbums(updatedAlbums))
      await updateAlbumsByUser(email, updatedAlbums)
    }
    cancelSelection()
    for (const photo of tempPhotos) {
      await deletePhoto(photo)
    }
  }

  const handleRestore = async () => {
    const updatedPhotos = await Promise.all(
      photos.map(async photo => {
        const updatedPhoto = { ...photo, trash: false }
        if (selection.includes(photo)) {
          await updatePhoto(updatedPhoto)
          updateAlbumCoverPhoto(photo, updatedPhoto)
          return updatedPhoto
        }
        return photo
      })
    )
    updatePhotosAndCancelSelection(updatedPhotos)
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

  const handleFavourite = async () => {
    const updatedPhotos = await Promise.all(
      photos.map(async photo => {
        if (selection.includes(photo)) {
          const updatedPhoto = { ...photo, favorite: true }
          await updatePhoto(updatedPhoto)
          return updatedPhoto
        }
        return photo
      })
    )
    updatePhotosAndCancelSelection(updatedPhotos)
  }

  const handleRemoveFavourite = async () => {
    const updatedPhotos = await Promise.all(
      photos.map(async photo => {
        if (selection.includes(photo)) {
          const updatedPhoto = { ...photo, favorite: false }
          await updatePhoto(updatedPhoto)
          return updatedPhoto
        }
        return photo
      })
    )
    updatePhotosAndCancelSelection(updatedPhotos)
  }

  const handleSelectAll = () => {
    let updatedSelection: Photo[] = []
    if (currentView === "photos") {
      updatedSelection = photos.filter(photo => !photo.trash)
    } else if (currentView === "favourites") {
      updatedSelection = photos.filter(photo => !photo.trash && photo.favorite)
    } else if (currentView === "trash") {
      updatedSelection = photos.filter(photo => photo.trash)
    } else if (currentView === "albums" && selectedAlbum !== "")
      updatedSelection = photos.filter(
        photo => !photo.trash && photo.album.includes(selectedAlbum)
      )
    dispatch(
      updateGeneralSlice({
        ...general,
        selection: updatedSelection,
      })
    )
  }

  const handleRemoveFromAlbum = async () => {
    const updatedPhotos = await Promise.all(
      photos.map(async photo => {
        if (selection.includes(photo)) {
          const updatedPhotoAlbum = photo.album.filter(
            album => album != selectedAlbum
          )
          const updatedPhoto: Photo = { ...photo, album: updatedPhotoAlbum }
          await updateAlbumCoverPhoto(photo, null)
          await updatePhoto(updatedPhoto)
          return updatedPhoto
        }
        return photo
      })
    )
    updatePhotosAndCancelSelection(updatedPhotos)
  }

  const updatePhotosAndCancelSelection = (updatedPhotos: Photo[]) => {
    dispatch(updatePhotos(updatedPhotos))
    cancelSelection()
  }

  const cancelSelection = () => {
    dispatch(
      updateGeneralSlice({
        ...general,
        selection: [],
      })
    )
  }

  return (
    <header className="border-b border-gray-800 p-4 pl-1 flex items-center justify-between">
      <div className="flex items-center">
        <h2 className="text-2xl font-semibold text-gray-100 capitalize">
          <Button
            className="text-gray-300 hover:text-gray-100 hover:bg-gray-800 rounded-full hover:font-bold text-2xl mr-3"
            onClick={cancelSelection}
          >
            <XIcon className="h-4 w-4" />
          </Button>
          {selection.length} Selected
        </h2>
      </div>
      <div>
        {currentView !== "trash" ? (
          <>
            <SelectedNavbarButton
              iconName="Trash2Icon"
              text="Delete"
              onClick={handleDelete}
            />
            {selection.every(selectedPhoto => selectedPhoto.favorite) ? (
              <Button
                className="text-gray-300 hover:text-gray-100 hover:bg-gray-800 hover:font-bold text-md mr-0.5"
                onClick={handleRemoveFavourite}
              >
                <StarIcon className="mr-1 h-4 w-4 fill-white text-white" />
                Remove Favourite
              </Button>
            ) : (
              <SelectedNavbarButton
                iconName="StarIcon"
                text="Favourite"
                onClick={handleFavourite}
              />
            )}
          </>
        ) : (
          <>
            <SelectedNavbarButton
              iconName="RotateCcwIcon"
              text="Restore"
              onClick={handleRestore}
            />
            <SelectedNavbarButton
              iconName="Trash2Icon"
              text="Delete Permanently"
              onClick={handleDeletePermanently}
            />
          </>
        )}
        <SelectedNavbarButton
          iconName="ListCheckIcon"
          text="Select All"
          onClick={handleSelectAll}
        />
        {currentView === "albums" && selectedAlbum !== "" && (
          <SelectedNavbarButton
            iconName="ImageMinusIcon"
            text="Remove from Album"
            onClick={handleRemoveFromAlbum}
          />
        )}
      </div>
    </header>
  )
}

export default SelectedNavbarPhotos
