import FullScreenPhoto from "@/components/FullScreenPhoto/FullScreenPhoto"
import MainContent from "@/components/MainContent"
import Navbar from "@/components/Navbar/Navbar"
import AlbumPhotosSelect from "@/components/Navbar/SelectPhotoAlbum"
import SelectedNavbarPhotos from "@/components/SelectedNavbar/SelectedNavbarPhotos"
import { useAppSelector } from "@/redux_essentials/hooks"

const AlbumPage = () => {
  const { fullscreenPhoto, selection } = useAppSelector(state => state.general)

  return (
    <>
      <main className="flex-1 flex flex-col bg-gray-900 mx-2">
        {selection.length > 0 ? <SelectedNavbarPhotos /> : <Navbar />}
        <MainContent />
      </main>
      <AlbumPhotosSelect />
      {fullscreenPhoto && <FullScreenPhoto />}
    </>
  )
}

export default AlbumPage
