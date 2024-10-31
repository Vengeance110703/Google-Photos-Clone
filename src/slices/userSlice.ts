import { User } from "@/types/alltypes"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: User = {
  name: "sample",
  email: "sample@gmail.com",
  profilePicture: "sample",
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<User>) => {
      const { name, email, profilePicture } = action.payload
      state.name = name
      state.email = email
      state.profilePicture = profilePicture
    },
  },
})

export const { setUserData } = userSlice.actions
export default userSlice.reducer
