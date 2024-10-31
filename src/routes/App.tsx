import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/redux_essentials/hooks"
import Sidebar from "@/components/Sidebar"
import { reset } from "@/slices/generalSlice"
import { getAlbumsByUser, getPhotosByUser } from "@/api/databse"
import { updatePhotos } from "@/slices/photosSlice"
import { updateAlbums } from "@/slices/albumsSlice"

const App = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { name, email } = useAppSelector(state => state.user)
  const photos = useAppSelector(state => state.photos.value)
  const albums = useAppSelector(state => state.albums.value)

  useEffect(() => {
    if (name === "sample") {
      navigate("/signin")
    }

    dispatch(reset())
  }, [])

  useEffect(() => {
    const getPhotos = async () => {
      const photos_firebase = await getPhotosByUser(email)
      dispatch(updatePhotos(photos_firebase))
    }
    if (photos.length === 0) getPhotos()
  }, [])

  useEffect(() => {
    const getAlbums = async () => {
      const album_names = await getAlbumsByUser(email)
      dispatch(updateAlbums(album_names))
    }
    if (albums.length === 0) getAlbums()
  }, [])

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <Outlet />
    </div>
  )
}

export default App
