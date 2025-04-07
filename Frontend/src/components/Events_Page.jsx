"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Event_Card from "../components/Event_Card.jsx"
import { motion } from "framer-motion"
import { useToast_v2 } from "../components/ui/toast_v2.jsx"

const Events_Page = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast_v2()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/event/getAllEvent")
        setEvents(response.data.events)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching events:", error)
        toast({
          title: "Error",
          description: "Failed to load events. Please try again.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchEvents()
  }, [toast])

  const handleJoinEvent = async (eventId) => {
    try {
      // First API call to join the event
      await axios.get(`http://localhost:3000/api/v1/volunteer/joinEvent/${eventId}`)

      // Second API call to update NGO schema
      await axios.post(`http://localhost:3000/api/v1/ngo/volunteerJoinNGO/${eventId}`)

      toast({
        title: "Success!",
        description: "You have successfully joined this event.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error joining event:", error)
      toast({
        title: "Error",
        description: "Failed to join the event. Please try again.",
        variant: "destructive",
      })
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="ml-[16%] min-h-screen w-[84%] py-8 px-4 md:px-8 bg-gray-50">
      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Upcoming Events
      </motion.h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {events.length > 0 ? (
            events.map((event) => (
              <Event_Card key={event._id} event={event} onJoin={() => handleJoinEvent(event._id)} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              No events available at the moment. Check back later!
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default Events_Page

