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

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const authenticateUser = (email: string, password: string) => {
    // Get all registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem("moneymax_registered_users") || "[]")

    // Find user with matching email and password
    const user = registeredUsers.find(
      (user: any) => user.email.toLowerCase() === email.toLowerCase() && user.password === password,
    )

    return user
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    // Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    // Simulate loading delay for better UX
    setTimeout(() => {
      // Authenticate user
      const authenticatedUser = authenticateUser(formData.email, formData.password)

      if (authenticatedUser) {
        // Load complete user state including transactions and session data
        const userTransactions = JSON.parse(localStorage.getItem("moneymax_transactions") || "[]")
        const userSpecificTransactions = userTransactions.filter(
          (transaction: any) => transaction.userId === authenticatedUser.email,
        )

        // Set current user data and authentication status
        localStorage.setItem("moneymax_user", JSON.stringify(authenticatedUser))
        localStorage.setItem("moneymax_authenticated", "true")

        // Restore user's transaction history
        if (userSpecificTransactions.length > 0) {
          localStorage.setItem("moneymax_transactions", JSON.stringify(userSpecificTransactions))
        }

        // Show success message
        alert(`✅ Welcome back, ${authenticatedUser.fullName}! Your session has been restored.`)

        // Redirect to dashboard
        router.push("/dashboard")
      } else {
        // Check if email exists but password is wrong
        const registeredUsers = JSON.parse(localStorage.getItem("moneymax_registered_users") || "[]")
        const emailExists = registeredUsers.some(
          (user: any) => user.email.toLowerCase() === formData.email.toLowerCase(),
        )

        if (emailExists) {
          setError("❌ Incorrect password. Please check your password and try again.")
        } else {
          setError("❌ No account found with this email. Please register first or check your email address.")
        }
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (error) {
      setError("")
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
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your MoneyMax account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                    maxLength={11}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Create account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
