import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ImageIcon, AlbumIcon, StarIcon, Trash2Icon } from "lucide-react"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { useAppDispatch, useAppSelector } from "@/redux_essentials/hooks"
import { useNavigate } from "react-router-dom"
import { updateGeneralSlice } from "@/slices/generalSlice"
import { logout as logOut } from "@/api/user"

const Sidebar = () => {
  const userSettings = useAppSelector(state => state.user)
  const general = useAppSelector(state => state.general)
  const { pageList } = useAppSelector(state => state.general)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const logout = async () => {
    await logOut()
    navigate("/signin")
  }

  const handleClick = (value: string) => {
    if (value === "albums") {
      dispatch(
        updateGeneralSlice({
          ...general,
          currentView: value,
          selectedAlbum: "",
        })
      )
    } else {
      dispatch(updateGeneralSlice({ ...general, currentView: value }))
    }
    navigate(`/${value}`)
  }

  return (
    <aside className="w-64 border-r border-gray-800 flex flex-col">
      <div className="p-4 flex-1">
        <div className="text-center w-fit mx-auto">
          <img src="../../image.png" alt="" className="w-32 my-4 mx-auto" />
          <h1 className="text-2xl font-bold mb-4 text-gray-100">Pixel Vault</h1>
        </div>
        <Separator className="bg-gray-800 mt-7 mb-4" />
        <div className="space-y-4">
          {pageList.map(value => (
            <Button
              key={value}
              variant="ghost"
              className="text-lg w-full justify-start text-gray-300 hover:text-gray-100 hover:bg-gray-800 capitalize"
              onClick={() => handleClick(value)}
            >
              {value === "photos" ? (
                <ImageIcon className="mr-1 !h-6 !w-6" />
              ) : value === "albums" ? (
                <AlbumIcon className="mr-1 !h-6 !w-6" />
              ) : value === "favourites" ? (
                <StarIcon className="mr-1 !h-6 !w-6" />
              ) : (
                <Trash2Icon className="mr-1 !h-6 !w-6" />
              )}
              {value}
            </Button>
          ))}
        </div>
      </div>
      <Separator className="bg-gray-800" />
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar>
            <AvatarImage
              src={userSettings.profilePicture}
              alt={userSettings.name}
            />
            <AvatarFallback className="bg-gray-700 text-gray-200">
              {userSettings.name
                .split(" ")
                .map(n => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-200">
              {userSettings.name}
            </p>
            <p className="text-xs text-gray-400">{userSettings.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full text-center text-gray-300 hover:text-gray-100 hover:bg-gray-800"
          onClick={logout}
        >
          Log Out
        </Button>
      </div>
    </aside>
  )
}

export default Sidebar
