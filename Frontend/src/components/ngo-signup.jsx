"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Eye, EyeOff } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import axios from "axios"

export default function NGOSignup() {
  const [formData, setFormData] = useState({
    name: "",
    registrationNo: "",
    email: "",
    password: "",
    yearOfEstablishment: "",
    contactNo: "",
    description: "",
    location: "",
    contactUrls: [],
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [urlInput, setUrlInput] = useState("")

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddUrl = () => {
    const trimmed = urlInput.trim()
    if (trimmed && !formData.contactUrls.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        contactUrls: [...prev.contactUrls, trimmed],
      }))
      setUrlInput("")
    }
  }

  const handleRemoveUrl = (url) => {
    setFormData((prev) => ({
      ...prev,
      contactUrls: prev.contactUrls.filter((u) => u !== url),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await axios.post("http://localhost:3000/api/v1ngo/register", formData)

      if (response.data.token) {
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("userType", "ngo")
        localStorage.setItem("user", JSON.stringify(response.data.user))

        dispatch({
          type: "auth/login",
          payload: {
            user: response.data.user,
            token: response.data.token,
            userType: "ngo",
          },
        })

        navigate("/")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">NGO Registration</CardTitle>
          <CardDescription className="text-center">
            Create your NGO account to connect with volunteers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-500 px-4 py-2 rounded-md text-sm">{error}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Helping Hands"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNo">Registration Number</Label>
                <Input
                  id="registrationNo"
                  name="registrationNo"
                  placeholder="REG12345"
                  value={formData.registrationNo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ngo@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearOfEstablishment">Year of Establishment</Label>
                <Input
                  id="yearOfEstablishment"
                  name="yearOfEstablishment"
                  type="number"
                  placeholder="2001"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={formData.yearOfEstablishment}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNo">Contact Number</Label>
                <Input
                  id="contactNo"
                  name="contactNo"
                  placeholder="9876543210"
                  value={formData.contactNo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Mumbai"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Tell us about your organization and its mission"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Contact URLs (Social Media, Website, etc.)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://facebook.com/helpinghands"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
                <Button type="button" variant="outline" onClick={handleAddUrl}>
                  Add
                </Button>
              </div>
              {formData.contactUrls.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.contactUrls.map((url, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-primary/10 text-primary rounded-full px-3 py-1"
                    >
                      <span>{url}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveUrl(url)}
                        className="text-primary hover:text-primary/80"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link to="/terms" className="text-primary underline underline-offset-4 hover:text-primary/90">
                  terms and conditions
                </Link>
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link
              to="/login/ngo"
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
            >
              Log in
            </Link>
          </div>
          <div className="text-center">
            <Link to="/signup" className="text-sm text-muted-foreground hover:text-primary">
              ← Back to signup options
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
