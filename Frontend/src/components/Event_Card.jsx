"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, Users } from "lucide-react"

const Event_Card = ({ event, onJoin }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [joining, setJoining] = useState(false)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // const handleJoinClick = async (e) => {
  //   e.stopPropagation()
  //   setJoining(true)
  //   await onJoin()
  //   setJoining(false)
  // }
  const handleJoinClick = (e) => {
    e.stopPropagation()
    setJoining(true)
    setTimeout(() => {
      alert("You have joined the event!") // simple hardcoded action
      setJoining(false)
    }, 1000)
  }
  

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  // Determine status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-green-500 hover:bg-green-600"
      case "ongoing":
        return "bg-blue-500 hover:bg-blue-600"
      case "active":
        return "bg-green-500 hover:bg-green-600"
      case "past":
        return "bg-gray-500 hover:bg-gray-600"
      default:
        return "bg-green-500 hover:bg-green-600"
    }
  }

  return (
    <motion.div
      variants={item}
      whileHover={{
        scale: 1.03,
        transition: { duration: 0.2 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <Card className="overflow-hidden h-full border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300">
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.photo || "/placeholder.svg?height=200&width=400"}
            alt={event.name || event.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
            style={{
              transform: isHovered ? "scale(1.1)" : "scale(1)",
            }}
          />
          <div className="absolute top-2 right-2">
            <Badge className={`${getStatusColor(event.status)} text-white font-medium`}>
              {event.status || "upcoming"}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold line-clamp-1">{event.name || event.title}</CardTitle>
          <CardDescription className="flex items-center gap-1 text-gray-600">
            <MapPin size={14} className="text-green-600" />
            {event.location}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={16} className="text-green-600" />
              <span className="text-sm">{formatDate(event.startDate || event.date)}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={16} className="text-green-600" />
              <span className="text-sm">{event.totalHours || event.duration} hours</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Users size={16} className="text-green-600" />
              <span className="text-sm">{event.volunteerCapacity || event.volunteersNeeded} volunteers needed</span>
            </div>

            <p className="text-sm line-clamp-2 mt-2 text-gray-700">
              {event.description || "Join us for this exciting volunteer opportunity!"}
            </p>

            <div className="flex flex-wrap gap-1 mt-3">
              {(event.skillsRequired || event.tags || []).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                  {skill}
                </Badge>
              ))}

              {/* If no skills/tags are provided, show some default ones */}
              {!event.skillsRequired && !event.tags && (
                <>
                  <Badge variant="outline" className="text-xs bg-gray-50">
                    teamwork
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-gray-50">
                    communication
                  </Badge>
                </>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0 flex justify-between items-center">
          <Badge variant="secondary" className="bg-gray-100">
            {event.type || event.category || "Community"}
          </Badge>
          <Button
            size="sm"
            disabled={event.status === "past" || joining}
            onClick={handleJoinClick}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {joining ? (
              <>
                <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-b-transparent"></div>
                Joining...
              </>
            ) : event.status === "past" ? (
              "Event Ended"
            ) : (
              "Join Event"
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default Event_Card


