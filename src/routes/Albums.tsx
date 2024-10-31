import CreateNewAlbum from "@/components/CreateNewAlbum"
import FullScreenPhoto from "@/components/FullScreenPhoto/FullScreenPhoto"
import MainContent from "@/components/MainContent"
import Navbar from "@/components/Navbar/Navbar"
import SelectedNavbarAlbums from "@/components/SelectedNavbar/SelectedNavbarAlbums"
import { useAppSelector } from "@/redux_essentials/hooks"

const Albums = () => {
  const { fullscreenPhoto, selectionAlbum } = useAppSelector(
    state => state.general
  )

  return (
    <>
      <main className="flex-1 flex flex-col bg-gray-900 mx-2">
        {selectionAlbum.length > 0 ? <SelectedNavbarAlbums /> : <Navbar />}
        <MainContent />
      </main>
      {fullscreenPhoto && <FullScreenPhoto />}
      <CreateNewAlbum />
    </>
  )
}

export default Albums
