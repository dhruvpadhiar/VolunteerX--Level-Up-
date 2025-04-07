"use client"

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import axios from "axios"
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';

export default function NGOLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useSelector(store => store.auth);

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:3000/api/v1/user/login', { email, password }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
        setEmail(""); setPassword("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">NGO Login</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your NGO account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={loginHandler} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ngo.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup/ngo" className="font-medium text-primary underline underline-offset-4 hover:text-primary/90">
              Sign up as NGO
            </Link>
          </div>
          <div className="text-center">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-primary">
              ← Back to login options
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
