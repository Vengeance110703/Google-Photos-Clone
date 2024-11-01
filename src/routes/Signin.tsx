import { auth } from "@/config/firebase"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../redux_essentials/hooks"
import { setUserData } from "@/slices/userSlice"
import { signIn } from "@/api/user"

const Signin = () => {
  const { name } = useAppSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (name === "sample") {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
          // console.log(user)
          dispatch(
            setUserData({
              name: user.displayName!,
              profilePicture: user.photoURL!,
              email: user.email!,
            })
          )
          navigate("/photos")
        }
      })
      return () => unsubscribe()
    }
  }, [])

  const signInWithGoogle = async () => {
    await signIn()
    dispatch(
      setUserData({
        name: auth.currentUser?.displayName!,
        profilePicture: auth.currentUser?.photoURL!,
        email: auth.currentUser?.email!,
      })
    )
    navigate("/photos")
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 text-gray-100 border-gray-400 rounded-3xl">
        <CardHeader className="text-center">
          <div className="w-52 h-52 mx-auto mb-4">
            <img
              src="../../../image.png"
              alt="Application Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold">
            Welcome to Pixel Vault
          </CardTitle>
          <CardDescription className="text-gray-400">
            Sign in to continue to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full bg-white hover:bg-gray-200 text-gray-900"
            size="lg"
            onClick={signInWithGoogle}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Signin
