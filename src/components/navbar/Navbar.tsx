import { useAppSelector, useAppDispatch } from "@/redux_essentials/hooks"
import { updateGeneralSlice } from "@/slices/generalSlice"
import { useEffect, useRef, useState } from "react"
import {
  getPhotoByUUID,
  updateAlbumsByUser,
  updatePhoto,
  uploadImage,
} from "@/api/databse"
import { updatePhotos } from "@/slices/photosSlice"
import NavbarButton from "./NavbarButton"
import { Album, Photo } from "@/types/alltypes"
import { Input } from "../ui/input"
import { XIcon } from "lucide-react"
import { updateAlbums } from "@/slices/albumsSlice"
import { toast } from "sonner"

const Navbar = () => {
  const general = useAppSelector(state => state.general)
  const { currentView, selectedAlbum } = useAppSelector(state => state.general)
  const { email } = useAppSelector(state => state.user)
  const photos = useAppSelector(state => state.photos.value)
  const albums = useAppSelector(state => state.albums.value)
  const dispatch = useAppDispatch()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)

  const [showTitleInput, setShowTitleInput] = useState(false)
  const [tempAlbumTitle, setTempAlbumTitle] = useState(selectedAlbum)

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files
    if (files) {
      const toastID = toast.loading(
        `Uploading ${files.length} photo${files.length > 1 ? "s" : ""}`,
        {
          className: "text-lg",
          classNames: {
            actionButton: "!bg-inherit",
          },
          action: {
            label: <XIcon className="absolute right-3 h-5 w-5 text-black" />,
            onClick: () => {},
          },
        }
      )
      const results: Promise<Photo>[] = []
      for (const file of Array.from(files)) {
        console.log(`Uploading file: ${file.name}`)
        const uuid = await uploadImage(file, email)
        if (uuid) {
          const photo = getPhotoByUUID(uuid!)
          results.push(photo)
        } else {
          console.log("Error occurred in uploading")
        }
      }
      const newPhotos = await Promise.all(results)
      toast.success(
        `${files.length} photo${
          files.length > 1 ? "s" : ""
        } uploaded successfully`,
        {
          id: toastID,
          action: {
            label: <XIcon className="absolute right-3 h-5 w-5 text-black" />,
            onClick: () => {},
          },
        }
      )
      dispatch(updatePhotos([...photos, ...newPhotos]))
    }
  }

  const handleCreateAlbum = () => {
    dispatch(
      updateGeneralSlice({
        ...general,
        createAlbumDialog: true,
      })
    )
  }

  const handleAddPhotos = () => {
    dispatch(
      updateGeneralSlice({
        ...general,
        addPhotosDrawer: true,
      })
    )
  }

  const handleHeaderClick = () => {
    setShowTitleInput(true)
  }

  useEffect(() => {
    if (showTitleInput) {
      titleRef.current?.focus()
    }
  }, [showTitleInput])

  const handleAlbumTitleChange = async () => {
    const updatedAlbums: Album[] = []
    for (const album of albums) {
      if (album.name === selectedAlbum) {
        updatedAlbums.push({
          ...album,
          name: tempAlbumTitle,
        })
      } else {
        updatedAlbums.push(album)
      }
    }

    const updatedPhotos: Photo[] = []
    let updatePhotoFlag = false
    for (const photo of photos) {
      const albumSet = new Set(photo.album)
      if (albumSet.has(selectedAlbum)) {
        updatePhotoFlag = true
        albumSet.add(tempAlbumTitle)
        albumSet.delete(selectedAlbum)
        const updatedPhoto = {
          ...photo,
          album: Array.from(albumSet),
        }
        updatedPhotos.push(updatedPhoto)
        await updatePhoto(updatedPhoto)
      } else {
        updatedPhotos.push(photo)
      }
    }

    if (updatePhotoFlag) {
      dispatch(updatePhotos(updatedPhotos))
    }
    dispatch(updateAlbums(updatedAlbums))
    await updateAlbumsByUser(email, updatedAlbums)
    dispatch(
      updateGeneralSlice({
        ...general,
        selectedAlbum: tempAlbumTitle,
      })
    )
    setShowTitleInput(false)
  }

  return (
    <header className="border-b border-gray-800 p-4 flex items-center justify-between">
      <div className="flex items-center">
        <h2
          className={
            currentView === "albums" && selectedAlbum !== "" && !showTitleInput
              ? "text-2xl font-semibold text-gray-100 capitalize hover:underline hover:decoration-gray-100 hover:underline-offset-[6px]"
              : "text-2xl font-semibold text-gray-100 capitalize"
          }
          onClick={showTitleInput ? () => {} : handleHeaderClick}
        >
          {currentView === "albums" && selectedAlbum !== "" ? (
            showTitleInput ? (
              <div className="flex flex-row space-x-1">
                <Input
                  id="Album Title"
                  ref={titleRef}
                  value={tempAlbumTitle}
                  onChange={e => setTempAlbumTitle(e.target.value)}
                  autoComplete="off"
                  className="text-gray-100 bg-gray-900 text-2xl pl-0 border-y-transparent border-x-transparent capitalize autofill:bg-gray-900 autofill:text-gray-100"
                  style={{
                    boxShadow: "none",
                    minWidth: "2ch",
                    width: `${tempAlbumTitle.length + 0.7}ch`,
                  }}
                />
                <NavbarButton
                  onClick={handleAlbumTitleChange}
                  iconName="Check"
                  text=""
                />
              </div>
            ) : (
              selectedAlbum
            )
          ) : (
            currentView
          )}
        </h2>
      </div>
      <>
        {currentView === "photos" && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
              accept="image/*"
            />
            <NavbarButton
              onClick={handleUpload}
              iconName="UploadIcon"
              text="Upload"
            />
          </>
        )}
        {currentView === "albums" && selectedAlbum === "" && (
          <NavbarButton
            onClick={handleCreateAlbum}
            iconName="PlusCircleIcon"
            text="Create Album"
          />
        )}
        {currentView === "albums" && selectedAlbum !== "" && (
          <NavbarButton
            onClick={handleAddPhotos}
            iconName="ImagePlusIcon"
            text="Add Photos"
          />
        )}
      </>
    </header>
  )
}

export default Navbar
