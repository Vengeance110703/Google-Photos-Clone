import { createRoot } from "react-dom/client"
import App from "./routes/App.tsx"
import "./index.css"
import { Provider } from "react-redux"
import { store } from "./redux_essentials/store.ts"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Signin from "./routes/Signin.tsx"
import Test from "./routes/Test.tsx"
import Photos from "./routes/Photos.tsx"
import Albums from "./routes/Albums.tsx"
import Error from "./routes/Error.tsx"
import Favourites from "./routes/Favourites.tsx"
import Trash from "./routes/Trash.tsx"
import AlbumPage from "./routes/AlbumPage.tsx"

const router = createBrowserRouter([
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/photos",
        element: <Photos />,
      },
      {
        path: "/albums",
        element: <Albums />,
      },
      {
        path: "/album/:albumName",
        element: <AlbumPage />,
      },
      {
        path: "/favourites",
        element: <Favourites />,
      },
      {
        path: "/trash",
        element: <Trash />,
      },
    ],
  },
  {
    path: "/test",
    element: <Test />,
  },
])

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
