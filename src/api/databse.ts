import { db, storage } from "@/config/firebase"
import { Album, Photo } from "@/types/alltypes"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore"
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage"
import { v4 } from "uuid"

const photosRef = collection(db, "photos")
const albumsRef = collection(db, "albums")

export const uploadImage = async (file: File, email: string) => {
  try {
    const name = file.name
    const uuid_new = v4()

    // Upload file to Firebase Storage
    const imageUploadRef = ref(storage, `photos/${uuid_new}_${name}`)
    await uploadBytes(imageUploadRef, file)

    // Get firebase image URL
    const imageGetRef = ref(storage, `photos/${uuid_new}_${name}`)
    const url = await getDownloadURL(imageGetRef)

    const firestoreUploadData: Photo = {
      album: [],
      favorite: false,
      name: name,
      trash: false,
      uuid: uuid_new,
      user: email,
      url: url,
    }

    const response = await addDoc(photosRef, firestoreUploadData)
    console.log("Image uploaded with id : ", response.id)
    return uuid_new
  } catch (error) {
    console.error(error)
  }
}

export const getPhotosByUser = async (email: string) => {
  const q = query(photosRef, where("user", "==", email))
  const photosSnap = await getDocs(q)
  const photos: Photo[] = []
  photosSnap.forEach(photo => photos.push(photo.data() as Photo))
  return photos
}

export const getPhotoByUUID = async (uuid: string) => {
  const q = query(photosRef, where("uuid", "==", uuid))
  const photoSnap = await getDocs(q)
  const photo = photoSnap.docs[0].data() as Photo
  return photo
}

export const deletePhoto = async ({ uuid, name }: Photo) => {
  // Delete from firestore
  const q = query(photosRef, where("uuid", "==", uuid))
  const photoSnap = await getDocs(q)
  const docID = photoSnap.docs[0].id
  await deleteDoc(doc(db, "photos", docID))

  // Delete from storage
  await deleteObject(ref(storage, `photos/${uuid}_${name}`))
}

export const updatePhoto = async (photo: Photo) => {
  const q = query(photosRef, where("uuid", "==", photo.uuid))
  const photoSnap = await getDocs(q)
  const docID = photoSnap.docs[0].id
  await updateDoc(doc(db, "photos", docID), photo)
}

export const getAlbumsByUser = async (email: string) => {
  const q = query(albumsRef, where("user", "==", email))
  const albumsSnap = await getDocs(q)
  let albums: Album[] = []
  if (albumsSnap.docs.length > 0) {
    albums = albumsSnap.docs[0].data().albums
  }
  return albums
}

export const updateAlbumsByUser = async (email: string, albums: Album[]) => {
  const q = query(albumsRef, where("user", "==", email))
  const albumsSnap = await getDocs(q)
  const payload = {
    albums: albums,
    user: email,
  }
  if (albumsSnap.docs.length === 0) {
    await addDoc(albumsRef, payload)
  } else {
    await updateDoc(doc(db, "albums", albumsSnap.docs[0].id), payload)
  }
}
