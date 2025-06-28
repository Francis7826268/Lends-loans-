"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  })

  const checkEmailExists = (email: string) => {
    // Get all registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem("moneymax_registered_users") || "[]")
    return registeredUsers.some((user: any) => user.email.toLowerCase() === email.toLowerCase())
  }

  const checkPhoneExists = (phone: string) => {
    // Get all registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem("moneymax_registered_users") || "[]")
    return registeredUsers.some((user: any) => user.phoneNumber === phone)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    } else if (!formData.email.endsWith(".com") && !formData.email.endsWith(".ph")) {
      newErrors.email = "Email must end with .com or .ph"
    } else if (checkEmailExists(formData.email)) {
      newErrors.email = "This email is already registered. Please use a different email or login instead."
    }

    // Phone number validation (exactly 11 digits starting with 09)
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
    } else if (!/^09\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must start with 09 and be exactly 11 digits"
    } else if (checkPhoneExists(formData.phoneNumber)) {
      newErrors.phoneNumber = "This phone number is already registered. Please use a different number."
    }

    // Password validation (exactly 11 characters, letters or digits only)
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length !== 11) {
      newErrors.password = "Password must be exactly 11 characters"
    } else if (!/^[a-zA-Z0-9]{11}$/.test(formData.password)) {
      newErrors.password = "Password must contain only letters and digits"
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // Create user data
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password, // In production, this should be hashed
        dateJoined: new Date().toISOString(),
        availableBalance: 0,
        hasActiveLoan: false,
      }

      // Get existing registered users
      const registeredUsers = JSON.parse(localStorage.getItem("moneymax_registered_users") || "[]")

      // Add new user to registered users list
      registeredUsers.push(userData)
      localStorage.setItem("moneymax_registered_users", JSON.stringify(registeredUsers))

      // Set current user data
      localStorage.setItem("moneymax_user", JSON.stringify(userData))
      localStorage.setItem("moneymax_authenticated", "true")

      // Show success message
      alert("✅ Account created successfully! Welcome to MoneyMax!")

      // Redirect to dashboard
      router.push("/dashboard")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">MM</span>
              </div>
              <span className="text-2xl font-bold">MoneyMax</span>
            </div>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Join MoneyMax and get access to fast cash advances</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.fullName}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.email}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value.replace(/\D/g, "").slice(0, 11))}
                  placeholder="09123456789"
                  maxLength={11}
                />
                <p className="text-sm text-gray-500">This will be used as your Account ID</p>
                {errors.phoneNumber && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.phoneNumber}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value.slice(0, 11))}
                    placeholder="Exactly 11 characters"
                    maxLength={11}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-sm text-gray-500">Must be exactly 11 characters (letters and digits only)</p>
                {errors.password && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.password}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value.slice(0, 11))}
                    placeholder="Confirm your password"
                    maxLength={11}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.confirmPassword}</AlertDescription>
                  </Alert>
                )}
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
