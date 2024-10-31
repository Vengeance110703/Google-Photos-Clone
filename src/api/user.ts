import { auth, googleProvider } from "@/config/firebase"
import { signInWithPopup, signOut } from "firebase/auth"

export const signIn = async () => {
  try {
    await signInWithPopup(auth, googleProvider)
  } catch (error) {
    console.error(error)
  }
}

export const logout = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error(error)
  }
}
