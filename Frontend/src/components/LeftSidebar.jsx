
"use client"
import { Calendar } from "lucide-react"
import { Home, LogOut, MessageCircle, PlusSquare, AppWindow, Leaf, Languages, FileText } from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { toast } from "sonner"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setAuthUser } from "@/redux/authSlice"
import CreatePost from "./CreatePost"
import { setPosts, setSelectedPost } from "@/redux/postSlice"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { setShowSmwaad } from "@/redux/uiSlice"

const LeftSidebar = () => {
  const navigate = useNavigate()
  const { user } = useSelector((store) => store.auth)
  const { likeNotification } = useSelector((store) => store.realTimeNotification)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [showEventsPage, setShowEventsPage] = useState(false)

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/user/logout", { withCredentials: true })
      if (res.data.success) {
        dispatch(setAuthUser(null))
        dispatch(setSelectedPost(null))
        dispatch(setPosts([]))
        navigate("/login")
        toast.success(res.data.message)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler()
    } else if (textType === "Create") {
      setOpen(true)
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`)
    } else if (textType === "Home") {
      navigate("/")
    } else if (textType === "Messages") {
      navigate("/chat")
    } else if (textType === "Dashboard") {
      window.location.href = "https://g5x6qutcsisbv25wx.lite.vusercontent.net/"
    } else if (textType === "Smwaad") {
      dispatch(setShowSmwaad(true))
    } else if (textType === "CaptionGenie") {
      navigate("/untitled")
    } else if (textType === "Explore Events") {
      setShowEventsPage(true)
      navigate("/events")
    } else if (textType === "Create Event") {
      navigate("/add-event")
    } else if (textType === "Image Generator") {
      window.location.href = "http://localhost:6001"
    }
    else {
      dispatch(setShowSmwaad(false))
    }
  }
  const sidebarItems = [
    { icon: <Home className="text-green-600" />, text: "Home" },
  
    // Conditionally show either Create or Explore Event
    ...(user?.type === "ngo"
      ? [{ icon: <Calendar className="text-green-600" />, text: "Create Event" }]
      : user?.type === "volunteer"
        ? [{ icon: <Calendar className="text-green-600" />, text: "Explore Events" }]
        : []),
  
    { icon: <Languages className="text-green-600" />, text: "Smwaad" },
    { icon: <MessageCircle className="text-green-600" />, text: "Messages" },
    { icon: <PlusSquare className="text-green-600" />, text: "Create" },
    { icon: <FileText className="text-green-600" />, text: "CaptionGenie" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback className="text-green-600">CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
  
    // Show Dashboard only if user is NGO
    ...(user?.type === "ngo"
      ? [{ icon: <AppWindow className="text-green-600" />, text: "Dashboard" }]
      : []),
  
    { icon: <FileText className="text-green-600" />, text: "Image Generator" },
    { icon: <LogOut className="text-grey-900" />, text: "Logout" },
  ]
  
  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen bg-white">
      <div className="flex flex-col">
        <h1 className="my-8 pl-3 font-bold text-xl flex items-center gap-2">
          <Leaf className="text-green-600 w-6 h-6" />
          VolunteerX
        </h1>
        <div className="overflow-y-auto">
          {sidebarItems.map((item, index) => {
            return (
              <div
                onClick={() => sidebarHandler(item.text)}
                key={index}
                className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
              >
                {item.icon}
                <span>{item.text}</span>
                {item.text === "Notifications" && likeNotification.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        size="icon"
                        className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6"
                      >
                        {likeNotification.length}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div>
                        {likeNotification.length === 0 ? (
                          <p>No new notification</p>
                        ) : (
                          likeNotification.map((notification) => {
                            return (
                              <div key={notification.userId} className="flex items-center gap-2 my-2">
                                <Avatar>
                                  <AvatarImage src={notification.userDetails?.profilePicture} />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <p className="text-sm">
                                  <span className="font-bold">{notification.userDetails?.username}</span> liked your
                                  post
                                </p>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </div>
  )
}

export default LeftSidebar


