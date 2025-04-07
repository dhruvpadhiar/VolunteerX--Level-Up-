"use client"

import { useState, useRef } from "react"
import { Upload, X, Loader2 } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useSelector } from "react-redux"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordian"

const CaptionGenerator = () => {
  const { user } = useSelector((store) => store.auth)
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [captions, setCaptions] = useState(null)
  const fileInputRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      setPreviewUrl(URL.createObjectURL(file))
      setCaptions(null)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file)
      setPreviewUrl(URL.createObjectURL(file))
      setCaptions(null)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first")
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append("image", selectedImage)

    try {
      console.log("Sending request to API...")
      
      // Using explicit configuration for better error handling and CORS compatibility
      const response = await axios({
        method: 'post',
        url: 'https://amoeba-master-gladly.ngrok-free.app/generate-captions',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          // If ngrok requires bypass-tunnel-reminder header
          'Bypass-Tunnel-Reminder': 'true'
        },
        // Increase timeout for image processing
        timeout: 60000,
        // Important for CORS
        withCredentials: false
      })
      
      console.log("Response received:", response.data)
      setCaptions(response.data)
      toast.success("Image processed successfully!")
    } catch (error) {
      console.error("Error uploading image:", error)
      
      // Better error handling
      if (error.response) {
        // Server responded with an error
        toast.error(`Server error: ${error.response.status} - ${error.response.data?.error || 'Unknown error'}`)
      } else if (error.request) {
        // Request was made but no response
        toast.error("No response from server. Check your network connection and CORS settings.")
      } else {
        // Error setting up the request
        toast.error(`Error setting up request: ${error.message}`)
      }
      
      // For development/testing purposes only - can be removed in production
      // This helps with diagnosing CORS issues
      toast.error("If experiencing CORS issues, try using a CORS proxy or adjusting server headers")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setPreviewUrl(null)
    setCaptions(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto py-6 px-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 p-4 border-b border-gray-100">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.profilePicture} alt={user?.username} />
            <AvatarFallback className="text-green-600">
              {user?.username?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-sm">{user?.username || "User"}</h1>
            <span className="text-gray-600 text-xs">Create a new post</span>
          </div>
        </div>

        {/* Upload Area */}
        {!previewUrl ? (
          <div
            className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-300 rounded-md m-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Upload className="w-12 h-12 text-green-600 mb-2" />
            <p className="text-gray-700 font-medium mb-1">Upload an image</p>
            <p className="text-gray-500 text-sm text-center mb-4">Drag and drop or click to select</p>
            <button
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md font-medium shadow-sm hover:shadow-md transition-all"
            >
              Select Image
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
          </div>
        ) : (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full object-cover max-h-[500px]"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Actions */}
        {previewUrl && !captions && (
          <div className="p-4 flex justify-center">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Generate Captions"
              )}
            </button>
          </div>
        )}

        {/* Captions */}
        {captions && (
          <div className="p-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="instagram_caption" className="border-b border-gray-200">
                <AccordionTrigger className="py-3 text-green-700 hover:text-green-800 font-medium">
                  Instagram Caption
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 py-3 px-2 bg-gray-50 rounded-md">
                  {captions.instagram_caption}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="instagram_story" className="border-b border-gray-200">
                <AccordionTrigger className="py-3 text-green-700 hover:text-green-800 font-medium">
                  Instagram Story
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 py-3 px-2 bg-gray-50 rounded-md">
                  {captions.instagram_story}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="facebook_post" className="border-b border-gray-200">
                <AccordionTrigger className="py-3 text-green-700 hover:text-green-800 font-medium">
                  Facebook Post
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 py-3 px-2 bg-gray-50 rounded-md">
                  {captions.facebook_post}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="twitter_post" className="border-b border-gray-200">
                <AccordionTrigger className="py-3 text-green-700 hover:text-green-800 font-medium">
                  Twitter Post
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 py-3 px-2 bg-gray-50 rounded-md">
                  {captions.twitter_post}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="blog_description" className="border-b border-gray-200">
                <AccordionTrigger className="py-3 text-green-700 hover:text-green-800 font-medium">
                  Blog Description
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 py-3 px-2 bg-gray-50 rounded-md">
                  {captions.blog_description}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            {/* Copy All Button */}
            <button 
              onClick={() => {
                const allCaptions = `
Instagram Caption:
${captions.instagram_caption}

Instagram Story:
${captions.instagram_story}

Facebook Post:
${captions.facebook_post}

Twitter Post:
${captions.twitter_post}

Blog Description:
${captions.blog_description}
                `;
                navigator.clipboard.writeText(allCaptions);
                toast.success("All captions copied to clipboard!");
              }}
              className="mt-4 w-full py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
            >
              Copy All Captions
            </button>
          </div>
        )}

        {/* Engagement */}
        <div className="p-4 flex items-center gap-4 border-t border-gray-100">
          <button className="text-gray-700 hover:text-green-600 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <button className="text-gray-700 hover:text-green-600 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>
          <button className="text-gray-700 hover:text-green-600 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>
          <button className="text-gray-700 hover:text-green-600 transition-colors ml-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CaptionGenerator