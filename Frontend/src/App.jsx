"use client"

import { useEffect } from "react"
import ChatPage from "./components/ChatPage"
import EditProfile from "./components/EditProfile"
import Home from "./components/Home"
import MainLayout from "./components/MainLayout"
import Profile from "./components/Profile"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { io } from "socket.io-client"
import { useDispatch, useSelector } from "react-redux"
import { setSocket } from "./redux/socketSlice"
import { setOnlineUsers } from "./redux/chatSlice"
import { setLikeNotification } from "./redux/rtnSlice"
import ProtectedRoutes from "./components/ProtectedRoutes"
import LandingPage from "./components/landing-page"
import Events_Page from './components/Events_Page'
import AddEventForm from './components/AddEventForm'

// Import auth components
import LoginChoice from "./components/login-choice"
import SignupChoice from "./components/signup-choice"
import NGOLogin from "./components/ngo-login"
import NGOSignup from "./components/ngo-signup"
import VolunteerLogin from "./components/volunteer-login"
import VolunteerSignup from "./components/volunteer-signup"
import Untitled from './components/Untitled'


const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/profile/:id",
        element: (
          <ProtectedRoutes>
            {" "}
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/account/edit",
        element: (
          <ProtectedRoutes>
            <EditProfile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/chat",
        element: (
          <ProtectedRoutes>
            <ChatPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: '/untitled',
        element:
          (
          <ProtectedRoutes>
            <Untitled />
            </ProtectedRoutes>
            )
      },
      {
        path: '/events',
        element: (
          <ProtectedRoutes>
            <Events_Page />
          </ProtectedRoutes>
        ),
      },
      {
        path: '/add-event',
        element: (
          <ProtectedRoutes>
            <AddEventForm />
          </ProtectedRoutes>
        ),
      },
      {
        path: '/create-image',
        element: (
          <ProtectedRoutes>
            {/* <AddEventForm /> */}
          </ProtectedRoutes>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <LoginChoice />,
  },
  {
    path: "/signup",
    element: <SignupChoice />,
  },
  {
    path: "/login/ngo",
    element: <NGOLogin />,
  },
  {
    path: "/signup/ngo",
    element: <NGOSignup />,
  },
  {
    path: "/login/volunteer",
    element: <VolunteerLogin />,
  },
  {
    path: "/signup/volunteer",
    element: <VolunteerSignup />,
  },
  {
    path: "/test",
    element: <LandingPage />,
  },
])

function App() {
  const { user } = useSelector((store) => store.auth)
  const { socket } = useSelector((store) => store.socketio)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user) {
      const socketio = io("https://learnietaskdivamsanghvi.onrender.com/", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      })
      dispatch(setSocket(socketio))

      // listen all the events
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers))
      })

      socketio.on("notification", (notification) => {
        dispatch(setLikeNotification(notification))
      })

      return () => {
        socketio.close()
        dispatch(setSocket(null))
      }
    } else if (socket) {
      socket.close()
      dispatch(setSocket(null))
    }
  }, [user, dispatch])

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App

