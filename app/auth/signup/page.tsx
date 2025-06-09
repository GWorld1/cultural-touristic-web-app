"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Eye, EyeOff } from "lucide-react"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup logic here
    console.log("Signup attempt:", formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-100 to-accent-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-primary-200 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-primary-500 rounded-full shadow-lg">
              <Camera className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-secondary-800">TourismCam</CardTitle>
          <p className="text-secondary-600">Join to share your travel adventures</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="bg-white border-primary-200 focus:border-primary-400 focus:ring-primary-400"
                required
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="bg-white border-primary-200 focus:border-primary-400 focus:ring-primary-400"
                required
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-white border-primary-200 focus:border-primary-400 focus:ring-primary-400"
                required
              />
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-white border-primary-200 focus:border-primary-400 focus:ring-primary-400 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500 hover:text-secondary-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button
              type="submit"
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold shadow-lg"
            >
              Sign Up
            </Button>
          </form>

          <div className="text-center text-xs text-secondary-500 px-4">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-secondary-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-secondary-500">Or</span>
            </div>
          </div>

          <div className="text-center">
            <span className="text-sm text-secondary-600">Already have an account? </span>
            <Link href="/auth/login" className="text-sm font-semibold text-primary-600 hover:text-primary-800">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
