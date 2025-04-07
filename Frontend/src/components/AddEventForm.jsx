// import React, { useState } from 'react';
// import axios from 'axios';

// const AddEventForm = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     type: '',
//     description: '',
//     location: '',
//     startDate: '',
//     endDate: '',
//     skillsRequired: '',
//     volunteerCapacity: '',
//     totalHours: '',
//     photo: null,
//   });

//   const [successMessage, setSuccessMessage] = useState('');
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;
//     if (type === 'file') {
//       setFormData((prev) => ({ ...prev, photo: files[0] }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSuccessMessage('');
//     setError('');

//     try {
//       const payload = new FormData();
//       for (const key in formData) {
//         payload.append(key, formData[key]);
//       }

//     //   const token = localStorage.getItem("token"); // Make sure you stored it after login
//       const token =  `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2YxNWNkOTMxMGQzOWEyYTk5NjIzMzYiLCJpYXQiOjE3NDM4OTM4NjksImV4cCI6MTc0Mzk4MDI2OX0.yFrZna2SNxzyUFfM2nn-jt6LSjDknKp01L_GyC2pS4w`; 
//       console.log("Token:", token);

//       await axios.post("http://localhost:3000/api/v1/ngo/add-event", formData, {
//         withCredentials: true,
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
      

//       setSuccessMessage('Event created successfully!');
//       setFormData({
//         name: '',
//         type: '',
//         description: '',
//         location: '',
//         startDate: '',
//         endDate: '',
//         skillsRequired: '',
//         volunteerCapacity: '',
//         totalHours: '',
//         photo: null,
//       });
//     } catch (err) {
//       console.error(err);
//       setError('Failed to create event. Check console for details.');
//     }
//   };

//   return (
//     <div className="container" style={{ maxWidth: '600px', margin: 'auto' }}>
//       <h2>Add Event</h2>
//       {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleSubmit} encType="multipart/form-data">
//         <input type="text" name="name" placeholder="Event Name" value={formData.name} onChange={handleChange} required />
//         <input type="text" name="type" placeholder="Type" value={formData.type} onChange={handleChange} required />
//         <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
//         <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
//         <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
//         <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
//         <input type="text" name="skillsRequired" placeholder="Skills (comma separated)" value={formData.skillsRequired} onChange={handleChange} />
//         <input type="number" name="volunteerCapacity" placeholder="Volunteer Capacity" value={formData.volunteerCapacity} onChange={handleChange} required />
//         <input type="number" name="totalHours" placeholder="Total Hours" value={formData.totalHours} onChange={handleChange} required />
//         <input type="file" name="photo" onChange={handleChange} accept="image/*" />
//         <button type="submit">Create Event</button>
//       </form>
//     </div>
//   );
// };

// export default AddEventForm;
"use client"

import { useState } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, Users, Tag, FileImage, CheckCircle2, AlertCircle, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

const AddEventForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    skillsRequired: "",
    volunteerCapacity: "",
    totalHours: "",
    photo: null,
  })

  const [previewUrl, setPreviewUrl] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [skills, setSkills] = useState([])
  const [currentSkill, setCurrentSkill] = useState("")

  const handleChange = (e) => {
    const { name, value, type, files } = e.target

    if (type === "file") {
      const file = files[0]
      setFormData((prev) => ({ ...prev, photo: file }))

      // Create preview URL for the image
      if (file) {
        const fileReader = new FileReader()
        fileReader.onload = () => {
          setPreviewUrl(fileReader.result)
        }
        fileReader.readAsDataURL(file)
      } else {
        setPreviewUrl(null)
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleAddSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()])
      setCurrentSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddSkill()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage("")
    setError("")
    setLoading(true)

    try {
      const payload = new FormData()

      // Add all form fields to FormData
      for (const key in formData) {
        if (key !== "photo" && key !== "skillsRequired") {
          payload.append(key, formData[key])
        }
      }

      // Add skills as a comma-separated string
      payload.append("skillsRequired", skills.join(","))

      // Add photo if it exists
      if (formData.photo) {
        payload.append("photo", formData.photo)
      }

      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2YxNWNkOTMxMGQzOWEyYTk5NjIzMzYiLCJpYXQiOjE3NDM4OTM4NjksImV4cCI6MTc0Mzk4MDI2OX0.yFrZna2SNxzyUFfM2nn-jt6LSjDknKp01L_GyC2pS4w`

      await axios.post("http://localhost:3000/api/v1/ngo/add-event", payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setSuccessMessage("Event created successfully!")
      setFormData({
        name: "",
        type: "",
        description: "",
        location: "",
        startDate: "",
        endDate: "",
        skillsRequired: "",
        volunteerCapacity: "",
        totalHours: "",
        photo: null,
      })
      setSkills([])
      setPreviewUrl(null)

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err) {
      console.error(err)
      setError("Failed to create event. Please check all fields and try again.")
    } finally {
      setLoading(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <div className="ml-[16%] min-h-screen w-[84%] py-8 px-4 md:px-8 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="text-green-600 mr-2" />
          <h1 className="text-3xl font-bold text-center">Create New Event</h1>
        </div>

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Fill in the details to create a new volunteer event</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                {/* Basic Information */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Tag className="mr-2 h-5 w-5 text-green-600" />
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Event Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter event name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="focus-visible:ring-green-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Event Type</Label>
                      <Input
                        id="type"
                        name="type"
                        placeholder="e.g., Community Service, Education"
                        value={formData.type}
                        onChange={handleChange}
                        required
                        className="focus-visible:ring-green-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe the event and its purpose"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      className="min-h-[120px] focus-visible:ring-green-500"
                    />
                  </div>
                </motion.div>

                <Separator />

                {/* Location and Time */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-green-600" />
                    Location and Time
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="Enter event location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="focus-visible:ring-green-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          id="startDate"
                          name="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={handleChange}
                          required
                          className="pl-10 focus-visible:ring-green-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          id="endDate"
                          name="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={handleChange}
                          required
                          className="pl-10 focus-visible:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="totalHours">Total Hours</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          id="totalHours"
                          name="totalHours"
                          type="number"
                          placeholder="Total hours required"
                          value={formData.totalHours}
                          onChange={handleChange}
                          required
                          min="1"
                          className="pl-10 focus-visible:ring-green-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="volunteerCapacity">Volunteer Capacity</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          id="volunteerCapacity"
                          name="volunteerCapacity"
                          type="number"
                          placeholder="Number of volunteers needed"
                          value={formData.volunteerCapacity}
                          onChange={handleChange}
                          required
                          min="1"
                          className="pl-10 focus-visible:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                <Separator />

                {/* Skills Required */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Tag className="mr-2 h-5 w-5 text-green-600" />
                    Skills Required
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="skillInput">Add Skills</Label>
                    <div className="flex gap-2">
                      <Input
                        id="skillInput"
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g., Communication, Leadership"
                        className="focus-visible:ring-green-500"
                      />
                      <Button type="button" onClick={handleAddSkill} className="bg-green-600 hover:bg-green-700">
                        Add
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1 bg-green-50 text-green-800 hover:bg-green-100 cursor-pointer"
                          onClick={() => handleRemoveSkill(skill)}
                        >
                          {skill} &times;
                        </Badge>
                      ))}
                      {skills.length === 0 && <span className="text-sm text-gray-500 italic">No skills added yet</span>}
                    </div>
                  </div>
                </motion.div>

                <Separator />

                {/* Event Image */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <FileImage className="mr-2 h-5 w-5 text-green-600" />
                    Event Image
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="photo">Upload Image</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-500 transition-colors duration-200">
                        <Input
                          id="photo"
                          name="photo"
                          type="file"
                          onChange={handleChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <Label htmlFor="photo" className="flex flex-col items-center justify-center cursor-pointer">
                          <FileImage className="h-10 w-10 text-gray-400 mb-2" />
                          <span className="text-sm font-medium text-gray-700">Click to upload an image</span>
                          <span className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</span>
                        </Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <div className="border border-gray-200 rounded-lg overflow-hidden h-[200px] bg-gray-50 flex items-center justify-center">
                        {previewUrl ? (
                          <img
                            src={previewUrl || "/placeholder.svg"}
                            alt="Event preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm text-gray-500">No image selected</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </form>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 border-t p-6">
            <Button
              variant="outline"
              onClick={() => {
                setFormData({
                  name: "",
                  type: "",
                  description: "",
                  location: "",
                  startDate: "",
                  endDate: "",
                  skillsRequired: "",
                  volunteerCapacity: "",
                  totalHours: "",
                  photo: null,
                })
                setSkills([])
                setPreviewUrl(null)
              }}
              className="hover:bg-gray-100"
            >
              Reset
            </Button>

            <Button onClick={handleSubmit} disabled={loading} className="bg-green-600 hover:bg-green-700 min-w-[120px]">
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                  Creating...
                </>
              ) : (
                "Create Event"
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

export default AddEventForm

