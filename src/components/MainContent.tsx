import { useAppDispatch, useAppSelector } from "@/redux_essentials/hooks"
import { ScrollArea } from "./ui/scroll-area"
import { updateGeneralSlice } from "@/slices/generalSlice"
import { Album, Photo } from "@/types/alltypes"
import { Checkbox } from "./ui/checkbox"
import { AlbumIcon, StarIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

const MainContent = () => {
  const general = useAppSelector(state => state.general)
  const { currentView, selection, selectedAlbum, selectionAlbum } =
    useAppSelector(state => state.general)
  const photos = useAppSelector(state => state.photos.value)
  const albums = useAppSelector(state => state.albums.value)
  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const [showCheckBox, setShowCheckBox] = useState("")

  const handlePhotoClick = (photo: Photo) => {
    dispatch(
      updateGeneralSlice({
        ...general,
        fullscreenPhoto: photo,
      })
    )
  }

  const handleCheckBoxClickPhoto = (checkState: boolean, photo: Photo) => {
    dispatch(
      updateGeneralSlice({
        ...general,
        selection: checkState
          ? [...selection, photo]
          : selection.filter(ele => ele !== photo),
      })
    )
  }

  const handleCheckBoxClickAlbum = (checkState: boolean, album: Album) => {
    dispatch(
      updateGeneralSlice({
        ...general,
        selectionAlbum: checkState
          ? [...selectionAlbum, album]
          : selectionAlbum.filter(ele => ele !== album),
      })
    )
  }

  const handleAlbumClick = (album: Album) => {
    dispatch(
      updateGeneralSlice({
        ...general,
        selectedAlbum: album.name,
      })
    )
    navigate(`/album/${album.name}`)
  }

  const getPhotosForView = () => {
    if (currentView === "photos")
      return photos.filter(photo => photo.trash !== true)
    else if (currentView === "favourites")
      return photos.filter(
        photo => photo.trash !== true && photo.favorite === true
      )
    else if (currentView === "trash")
      return photos.filter(photo => photo.trash === true)
    else if (currentView === "albums")
      return photos.filter(
        photo => photo.album.includes(selectedAlbum) && !photo.trash
      )
  }

  return (
    <ScrollArea className="flex-1 p-4">
      <div>
        {/* <h2 className="text-xl font-semibold mb-4 text-gray-300">
              Firebase
            </h2> */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-1">
          {currentView === "albums" && selectedAlbum === ""
            ? albums.map(album => (
                <div
                  key={album.name}
                  className="aspect-square bg-gray-800 rounded-xl overflow-hidden relative"
                  onMouseEnter={() => setShowCheckBox(album.name)}
                  onMouseLeave={() => setShowCheckBox("")}
                >
                  {(showCheckBox === album.name ||
                    selectionAlbum.includes(album)) && (
                    <>
                      <div
                        className="absolute h-2/5 w-full bg-gradient-to-b from-black opacity-90"
                        onClick={() => handleAlbumClick(album)}
                      />
                      <Checkbox
                        checked={selectionAlbum.includes(album)}
                        onCheckedChange={(checked: boolean) =>
                          handleCheckBoxClickAlbum(checked, album)
                        }
                        className="absolute top-2 left-2 rounded-full bg- h-6 w-6 bg-gray-300 border-transparent opacity-40 data-[state=checked]:bg-sky-500 data-[state=checked]:opacity-90"
                      />
                    </>
                  )}
                  {album.coverPhoto !== null && !album.coverPhoto.trash ? (
                    <div
                      className="h-5/6 overflow-hidden"
                      onClick={() => handleAlbumClick(album)}
                    >
                      <img
                        src={album.coverPhoto.url}
                        alt={`Photo ${album.coverPhoto.name}`}
                        className="w-full h-full object-cover cursor-pointer"
                      />
                    </div>
                  ) : (
                    <div
                      className="flex-1 bg-gray-700 flex items-center justify-center h-5/6 w-full"
                      onClick={() => handleAlbumClick(album)}
                    >
                      <AlbumIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div
                    className="p-1.5 text-center truncate bg-gray-800 bg-opacity-75 text-xl"
                    onClick={() => handleAlbumClick(album)}
                  >
                    {album.name}
                  </div>
                </div>
              ))
            : getPhotosForView()!.map(photo => (
                <div
                  key={photo.uuid}
                  className="aspect-square bg-gray-800 rounded-xl overflow-hidden relative"
                  onMouseEnter={() => setShowCheckBox(photo.uuid)}
                  onMouseLeave={() => setShowCheckBox("")}
                >
                  {(currentView === "photos" || currentView === "albums") &&
                    photo.favorite && (
                      <StarIcon className="absolute bottom-3 left-3 text-white fill-white" />
                    )}
                  {(showCheckBox === photo.uuid ||
                    selection.includes(photo)) && (
                    <>
                      <div
                        className="absolute h-2/5 w-full bg-gradient-to-b from-black opacity-90"
                        onClick={() => handlePhotoClick(photo)}
                      />
                      <Checkbox
                        checked={selection.includes(photo)}
                        onCheckedChange={(checked: boolean) =>
                          handleCheckBoxClickPhoto(checked, photo)
                        }
                        className="absolute top-2 left-2 rounded-full bg- h-6 w-6 bg-gray-300 border-transparent opacity-40 data-[state=checked]:bg-sky-500 data-[state=checked]:opacity-90"
                      />
                    </>
                  )}

                  <img
                    src={photo.url}
                    alt={`Photo ${photo.name}`}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => handlePhotoClick(photo)}
                  />
                </div>
              ))}
        </div>
      </div>
    </ScrollArea>
  )
}

export default MainContent
