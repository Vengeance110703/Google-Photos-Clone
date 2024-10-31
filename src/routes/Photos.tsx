import FullScreenPhoto from "@/components/FullScreenPhoto/FullScreenPhoto"
import MainContent from "@/components/MainContent"
import Navbar from "@/components/Navbar/Navbar"
import SelectedNavbarPhotos from "@/components/SelectedNavbar/SelectedNavbarPhotos"
import { useAppSelector } from "@/redux_essentials/hooks"
import { Toaster } from "sonner"

const Photos = () => {
  const { fullscreenPhoto, selection } = useAppSelector(state => state.general)

  return (
    <>
      <main className="flex-1 flex flex-col bg-gray-900 mx-2">
        {selection.length > 0 ? <SelectedNavbarPhotos /> : <Navbar />}
        <MainContent />
      </main>
      {fullscreenPhoto && <FullScreenPhoto />}
      <Toaster richColors />
    </>
  )
}

export default Photos
