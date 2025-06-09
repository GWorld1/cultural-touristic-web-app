"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"
import { useAuth } from "@/lib/contexts/auth"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [validationError, setValidationError] = useState("")
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()
  const { requestPasswordReset, isLoading, error, clearError, isAuthenticated } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  // Clear errors when email changes
  useEffect(() => {
    if (error) {
      clearError()
    }
    setValidationError("")
    setSuccess(false)
  }, [email, error, clearError])

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setValidationError("Email is required")
      return false
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError("Please enter a valid email address")
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateEmail()) {
      return
    }

    const result = await requestPasswordReset(email.trim())

    if (result) {
      setSuccess(true)
      setEmail("")
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
          <CardTitle className="text-2xl font-bold text-secondary-800">Reset Password</CardTitle>
          <p className="text-secondary-600">Enter your email to receive reset instructions</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-green-700 text-sm">
                Password reset instructions have been sent to your email.
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
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`bg-white border-primary-200 focus:border-primary-400 focus:ring-primary-400 ${
                  validationError ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : ''
                }`}
                disabled={isLoading}
                required
              />
              {validationError && (
                <p className="text-red-500 text-xs mt-1">{validationError}</p>
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
                  <span>Sending...</span>
                </div>
              ) : (
                'Send Reset Instructions'
              )}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <Link 
              href="/auth/login" 
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Login
            </Link>
          </div>

          <div className="text-center">
            <span className="text-sm text-secondary-600">{"Don't have an account? "}</span>
            <Link href="/auth/signup" className="text-sm font-semibold text-primary-600 hover:text-primary-800">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
