import { useAppSelector, useAppDispatch } from "@/redux_essentials/hooks"
import { Drawer, DrawerContent, DrawerHeader } from "../ui/drawer"
import { updateGeneralSlice } from "@/slices/generalSlice"
import { ScrollArea } from "../ui/scroll-area"
import { ImagePlusIcon, StarIcon } from "lucide-react"
import { Button } from "../ui/button"
import { useState } from "react"
import { Photo } from "@/types/alltypes"
import { Checkbox } from "../ui/checkbox"
import NavbarButton from "./NavbarButton"
import { updatePhoto } from "@/api/databse"
import { updatePhotos } from "@/slices/photosSlice"

const AlbumPhotosSelect = () => {
  const general = useAppSelector(state => state.general)
  const { addPhotosDrawer, selectedAlbum } = useAppSelector(
    state => state.general
  )
  const photos = useAppSelector(state => state.photos.value)
  const dispatch = useAppDispatch()

  const [selectedPhotos, setSelectedPhotos] = useState<Photo[]>([])
  const [showCheckBox, setShowCheckBox] = useState("")

  const handleOpenDrawer = (open: boolean) => {
    dispatch(
      updateGeneralSlice({
        ...general,
        addPhotosDrawer: open,
      })
    )
    if (open === false) setSelectedPhotos([])
  }

  const handleCheckBoxClick = (checkState: boolean, photo: Photo) => {
    const updatedSelectedPhotos = checkState
      ? [...selectedPhotos, photo]
      : selectedPhotos.filter(ele => ele !== photo)
    setSelectedPhotos(updatedSelectedPhotos)
    console.log(updatedSelectedPhotos)
  }

  const handlePhotoClick = (photo: Photo) => {
    const index = selectedPhotos.findIndex(
      selectedPhoto => selectedPhoto.uuid === photo.uuid
    )
    if (index === -1) {
      setSelectedPhotos([...selectedPhotos, photo])
      console.log([...selectedPhotos, photo])
    } else {
      const temp = selectedPhotos
      temp.splice(index, 1)
      setSelectedPhotos(temp)
      console.log(temp)
    }
  }

  const handleSelectAll = () => {
    setSelectedPhotos(
      photos.filter(
        photo => !photo.trash && !photo.album.includes(selectedAlbum)
      )
    )
  }

  const handleUnselectAll = () => {
    setSelectedPhotos([])
  }

  const handleAddSelectedPhotos = async () => {
    let updatedPhotos = photos
    for (const photo of selectedPhotos) {
      const updatedPhoto: Photo = {
        ...photo,
        album: [...photo.album, selectedAlbum],
      }
      await updatePhoto(updatedPhoto)
      updatedPhotos = updatedPhotos.map(photo =>
        photo.uuid === updatedPhoto.uuid ? updatedPhoto : photo
      )
    }
    dispatch(updatePhotos(updatedPhotos))
    setSelectedPhotos([])
    dispatch(
      updateGeneralSlice({
        ...general,
        addPhotosDrawer: false,
      })
    )
  }

  return (
    <Drawer
      open={addPhotosDrawer}
      onOpenChange={open => handleOpenDrawer(open)}
    >
      <DrawerContent className="h-full max-h-[100dvh] flex flex-col bg-gray-900 border-none">
        <DrawerHeader>
          <header className="border-b border-gray-800 p-4 pl-1 pb-3 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-semibold text-gray-100 capitalize pl-3">
                {selectedPhotos.length > 0 &&
                  `${selectedPhotos.length} Selected`}
              </h2>
            </div>
            <div>
              {selectedPhotos.length ===
              photos.filter(photo => !photo.trash).length ? (
                <NavbarButton
                  iconName="ListXIcon"
                  text="Unselect All"
                  onClick={handleUnselectAll}
                />
              ) : (
                <NavbarButton
                  iconName="ListCheckIcon"
                  text="Select All"
                  onClick={handleSelectAll}
                />
              )}
              {selectedPhotos.length > 0 && (
                <Button
                  className="bg-gray-200 text-gray-800 hover:text-gray-950 hover:bg-gray-400 text-md ml-3"
                  onClick={handleAddSelectedPhotos}
                >
                  <ImagePlusIcon className="mr-1 h-4 w-4" />
                  Add Selected Photos
                </Button>
              )}
            </div>
          </header>
        </DrawerHeader>
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-5">
            {photos.map(
              photo =>
                !photo.trash &&
                !photo.album.includes(selectedAlbum) && (
                  <div
                    key={photo.uuid}
                    className="aspect-square bg-gray-800 rounded-xl overflow-hidden relative"
                    onMouseEnter={() => setShowCheckBox(photo.uuid)}
                    onMouseLeave={() => setShowCheckBox("")}
                  >
                    {photo.favorite && (
                      <StarIcon className="absolute bottom-3 left-3 text-white fill-white" />
                    )}
                    {(showCheckBox === photo.uuid ||
                      selectedPhotos.includes(photo)) && (
                      <>
                        {/* {console.log(selectedPhotos)} */}
                        <div className="absolute h-2/5 w-full bg-gradient-to-b from-black opacity-90" />
                        <Checkbox
                          checked={selectedPhotos.includes(photo)}
                          onCheckedChange={(checked: boolean) =>
                            handleCheckBoxClick(checked, photo)
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
                )
            )}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}

export default AlbumPhotosSelect
