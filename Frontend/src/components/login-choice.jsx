"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginChoice() {
  const [activeTab, setActiveTab] = useState("volunteer")

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Choose your account type to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="volunteer" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
              <TabsTrigger value="ngo">NGO</TabsTrigger>
            </TabsList>
            <TabsContent value="volunteer" className="mt-6 flex justify-center">
              <Link to="/login/volunteer" className="w-full">
                <Button className="w-full">Continue as Volunteer</Button>
              </Link>
            </TabsContent>
            <TabsContent value="ngo" className="mt-6 flex justify-center">
              <Link to="/login/ngo" className="w-full">
                <Button className="w-full">Continue as NGO</Button>
              </Link>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-primary underline underline-offset-4 hover:text-primary/90">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

