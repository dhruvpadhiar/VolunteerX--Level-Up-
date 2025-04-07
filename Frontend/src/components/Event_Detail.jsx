"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { motion } from "framer-motion"
import { Button_v2 } from "../components/ui/button_v2.jsx"
import { Card_v2, CardContent_v2 } from "../components/ui/card_v2.jsx"
import { Badge_v2 } from "../components/ui/badge_v2.jsx"
import { Calendar, MapPin, Clock, Users, ArrowLeft } from "lucide-react"
import { useToast_v2 } from "../components/ui/toast_v2.jsx"
import { toast as sonerToast } from "sonner" // Add this as a fallback

const Event_Detail = () => {
  const { eventId } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast_v2()

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/event/getAllEvent`)
        const foundEvent = response.data.events.find((e) => e._id === eventId)

        if (foundEvent) {
          setEvent(foundEvent)
        } else {
          // Try both toast methods to ensure one works
          if (toast) {
            toast({
              title: "Event not found",
              description: "The event you're looking for doesn't exist.",
              variant: "destructive",
            })
          } else {
            sonerToast.error("Event not found. The event you're looking for doesn't exist.")
          }
          navigate("/")
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching event details:", error)
        // Try both toast methods
        if (toast) {
          toast({
            title: "Error",
            description: "Failed to load event details.",
            variant: "destructive",
          })
        } else {
          sonerToast.error("Failed to load event details.")
        }
        setLoading(false)
      }
    }

    fetchEventDetails()
  }, [eventId, navigate, toast])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleJoinEvent = async () => {
    setJoining(true)
    try {
      console.log("Attempting to join event:", eventId)
      
      // First API call to join the event
      const joinResponse = await axios.get(`http://localhost:3000/api/v1/volunteer/joinEvent/${eventId}`, {
        withCredentials: true // Add this if you need cookies for authentication
      })
      console.log("Join event response:", joinResponse.data)

      // Second API call to update NGO schema
      const ngoResponse = await axios.post(`http://localhost:3000/api/v1/ngo/volunteerJoinNGO/${eventId}`, {}, {
        withCredentials: true // Add this if you need cookies for authentication
      })
      console.log("NGO update response:", ngoResponse.data)

      // Try both toast methods to ensure one works
      if (toast) {
        toast({
          title: "Success!",
          description: "You have successfully joined this event.",
          variant: "default",
        })
      } else {
        sonerToast.success("You have successfully joined this event.")
      }
      
      // Give visual feedback that the action completed successfully
      setTimeout(() => {
        // Optionally refresh the event data
        setEvent(prev => ({...prev, joined: true}))
      }, 500)
      
    } catch (error) {
      console.error("Error joining event:", error.response?.data || error.message || error)
      
      // More detailed error handling
      const errorMessage = error.response?.data?.message || "Failed to join the event. Please try again."
      
      // Try both toast methods
      if (toast) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } else {
        sonerToast.error(errorMessage)
      }
    } finally {
      setJoining(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold">Event not found</h1>
        <Button_v2 onClick={() => navigate("/")} className="mt-4">
          Back to Events
        </Button_v2>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Button_v2 variant="ghost" className="mb-6 flex items-center gap-2" onClick={() => navigate("/")}>
        <ArrowLeft size={16} />
        Back to Events
      </Button_v2>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-xl overflow-hidden shadow-lg h-[400px]"
            >
              <img src={event.photo || "/placeholder.svg"} alt={event.name} className="w-full h-full object-cover" />
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <Card_v2 className="h-full">
              <CardContent_v2 className="p-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl font-bold">{event.name}</h1>
                    <Badge_v2
                      className={`
                      ${
                        event.status === "upcoming"
                          ? "bg-green-500"
                          : event.status === "ongoing"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                      }
                    `}
                    >
                      {event.status}
                    </Badge_v2>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="text-gray-500" />
                      <span>{event.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="text-gray-500" />
                      <div>
                        <div>Start: {formatDate(event.startDate)}</div>
                        <div>End: {formatDate(event.endDate)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="text-gray-500" />
                      <span>{event.totalHours} hours</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="text-gray-500" />
                      <span>{event.volunteerCapacity} volunteers needed</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Description</h2>
                    <p>{event.description}</p>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Skills Required</h2>
                    <div className="flex flex-wrap gap-2">
                      {event.skillsRequired.map((skill, index) => (
                        <Badge_v2 key={index} variant="outline">
                          {skill}
                        </Badge_v2>
                      ))}
                    </div>
                  </div>

                  <Button_v2 
                    className="w-full" 
                    disabled={event.status === "past" || joining || event.joined} 
                    onClick={handleJoinEvent}
                  >
                    {joining ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                        Joining...
                      </>
                    ) : event.status === "past" ? (
                      "Event Ended"
                    ) : event.joined ? (
                      "Already Joined"
                    ) : (
                      "Join Event"
                    )}
                  </Button_v2>
                </motion.div>
              </CardContent_v2>
            </Card_v2>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Event_Detail