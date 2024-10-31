import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/redux_essentials/hooks"
import { updateGeneralSlice } from "@/slices/generalSlice"
import { useNavigate } from "react-router-dom"

const Error = () => {
  const { name } = useAppSelector(state => state.user)
  const general = useAppSelector(state => state.general)
  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const handleGoBackHome = () => {
    if (name === "sample") {
      navigate("/signin")
    } else {
      dispatch(
        updateGeneralSlice({
          ...general,
          currentView: "photos",
        })
      )
      navigate("/photos")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="text-center">
        <img
          src="../../image.png"
          alt="Pixel Vault Logo"
          className="w-32 mb-8 mx-auto"
        />
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-xl mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg"
          onClick={handleGoBackHome}
        >
          Go Back Home
        </Button>
      </div>
      <div className="mt-16 text-gray-400 text-sm">
        <p>&copy; 2024 Pixel Vault. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Error
