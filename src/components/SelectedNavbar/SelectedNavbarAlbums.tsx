import { useAppSelector, useAppDispatch } from "@/redux_essentials/hooks"
import { XIcon } from "lucide-react"
import { Button } from "../ui/button"
import SelectedNavbarButton from "./SelectedNavbarButton"
import { updateGeneralSlice } from "@/slices/generalSlice"
import { updatePhotos } from "@/slices/photosSlice"
import { Photo } from "@/types/alltypes"
import { updateAlbums } from "@/slices/albumsSlice"
import { updateAlbumsByUser, updatePhoto } from "@/api/databse"

type Props = {}

const SelectedNavbarAlbums = (props: Props) => {
  const general = useAppSelector(state => state.general)
  const { selectionAlbum } = useAppSelector(state => state.general)
  const photos = useAppSelector(state => state.photos.value)
  const albums = useAppSelector(state => state.albums.value)
  const { email } = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()

  const handleDelete = async () => {
    const updatedAlbums = albums.filter(
      album => !selectionAlbum.includes(album)
    )
    dispatch(updateAlbums(updatedAlbums))
    const updatedPhotos = photos.map(photo => {
      selectionAlbum.forEach(async ({ name }) => {
        if (photo.album.includes(name)) {
          const updatedPhoto: Photo = {
            ...photo,
            album: photo.album.filter(album => album !== name),
          }
          await updatePhoto(updatedPhoto)
          return updatedPhoto
        }
      })
      return photo
    })
    dispatch(updatePhotos(updatedPhotos))
    cancelSelection()
    await updateAlbumsByUser(email, updatedAlbums)
  }

  const cancelSelection = () => {
    dispatch(
      updateGeneralSlice({
        ...general,
        selectionAlbum: [],
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
          {selectionAlbum.length} Selected
        </h2>
      </div>
      <div>
        <SelectedNavbarButton
          iconName="Trash2Icon"
          text="Delete"
          onClick={handleDelete}
        />
        {/* {currentView !== "trash" ? (
          <>
            <SelectedNavbarButton
              iconName="Trash2Icon"
              text="Delete"
              onClick={handleDelete}
            />
            {selectionAlbum.every(selectedPhoto => selectedPhoto.favorite) ? (
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
        )} */}
      </div>
    </header>
  )
}

export default SelectedNavbarAlbums
