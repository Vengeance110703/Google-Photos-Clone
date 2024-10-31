// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC70Vy5gZAiwrjm3VHxkXwsZoDMe3LD3M4",
  authDomain: "pixel-vault-db6a1.firebaseapp.com",
  projectId: "pixel-vault-db6a1",
  storageBucket: "pixel-vault-db6a1.appspot.com",
  messagingSenderId: "782145293252",
  appId: "1:782145293252:web:88f88bcb427daf0b0b7291",
  measurementId: "G-0B0LTH6HGD",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
export const storage = getStorage(app)
