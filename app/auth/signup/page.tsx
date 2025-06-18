"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import { useAuth } from "@/lib/contexts/auth"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  })
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({})
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const router = useRouter()
  const { register, isLoading, error, clearError, isAuthenticated } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  // Clear errors when form data changes
  useEffect(() => {
    if (error) {
      clearError()
    }
    setValidationErrors({})
    setRegistrationSuccess(false)
  }, [formData, error, clearError])

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {}

    if (!formData.name.trim()) {
      errors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters"
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required"
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    // Phone is optional, but if provided, should be valid
    if (formData.phone.trim() && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const success = await register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      phone: formData.phone.trim() || undefined
    })

    if (success) {
      setRegistrationSuccess(true)
      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
      })

      // Optionally redirect to login or home page
      setTimeout(() => {
        router.push('/auth/login')
      }, 5000)

    } 
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
          {/* Success Message */}
          {registrationSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-green-700 text-sm">
                Registration successful! Please check your email to verify your account.
              </span>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`bg-white border-primary-200 focus:border-primary-400 focus:ring-primary-400 ${
                  validationErrors.name ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : ''
                }`}
                disabled={isLoading}
                required
              />
              {validationErrors.name && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
              )}
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`bg-white border-primary-200 focus:border-primary-400 focus:ring-primary-400 ${
                  validationErrors.email ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : ''
                }`}
                disabled={isLoading}
                required
              />
              {validationErrors.email && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
              )}
            </div>
            <div>
              <Input
                type="tel"
                placeholder="Phone (optional)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`bg-white border-primary-200 focus:border-primary-400 focus:ring-primary-400 ${
                  validationErrors.phone ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : ''
                }`}
                disabled={isLoading}
              />
              {validationErrors.phone && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
              )}
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`bg-white border-primary-200 focus:border-primary-400 focus:ring-primary-400 pr-10 ${
                  validationErrors.password ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : ''
                }`}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500 hover:text-secondary-700 disabled:opacity-50"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {validationErrors.password && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                'Sign Up'
              )}
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
