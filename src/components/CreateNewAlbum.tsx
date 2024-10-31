import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog"
import { DialogHeader } from "./ui/dialog"
import { useAppDispatch, useAppSelector } from "@/redux_essentials/hooks"
import { updateGeneralSlice } from "@/slices/generalSlice"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useState } from "react"
import { updateAlbums } from "@/slices/albumsSlice"
import { Album } from "@/types/alltypes"
import { updateAlbumsByUser } from "@/api/databse"

const CreateNewAlbum = () => {
  const { email } = useAppSelector(state => state.user)
  const general = useAppSelector(state => state.general)
  const { createAlbumDialog } = useAppSelector(state => state.general)
  const albums = useAppSelector(state => state.albums.value)
  const dispatch = useAppDispatch()

  const [albumName, setAlbumName] = useState("")

  const handleCreateAlbum = async () => {
    dispatch(
      updateGeneralSlice({
        ...general,
        createAlbumDialog: false,
      })
    )
    if (albumName !== "")
      if (
        !albums.some(
          album => album.name.toLowerCase() === albumName.toLowerCase()
        )
      ) {
        const newAlbum: Album = {
          name: albumName,
          coverPhoto: null,
        }
        const updatedAlbums = [...albums, newAlbum]
        dispatch(updateAlbums(updatedAlbums))
        console.log("updateAlbums")
        await updateAlbumsByUser(email, updatedAlbums)
      }
    setAlbumName("")
  }

  return (
    <Dialog
      open={createAlbumDialog}
      onOpenChange={open =>
        dispatch(
          updateGeneralSlice({
            ...general,
            createAlbumDialog: open,
          })
        )
      }
    >
      <DialogContent className="bg-gray-800 text-gray-100 border-gray-400">
        <DialogHeader>
          <DialogTitle>Create New Album</DialogTitle>
          <DialogDescription className="text-gray-400">
            Give a name to your new album
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-1">
          <Input
            type="text"
            placeholder="Album name"
            value={albumName}
            onChange={e => setAlbumName(e.target.value)}
            className="bg-gray-700 text-gray-100 border-gray-600 text-md"
          />
          <Button
            onClick={handleCreateAlbum}
            className="text-gray-300 hover:text-gray-100 hover:bg-gray-950 text-md ml-1"
          >
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateNewAlbum
