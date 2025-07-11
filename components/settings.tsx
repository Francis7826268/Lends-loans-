"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, SettingsIcon, Shield, Bell, Lock, Palette } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Settings() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: true,
    dataSharing: false,
    language: "English",
    theme: "Light",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const currentUser = localStorage.getItem("moneymax_current_user")
    if (!currentUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)
    setFormData({
      fullName: userData.fullName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })

    // Load preferences from localStorage
    const savedPreferences = localStorage.getItem(`preferences_${userData.id}`)
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences))
    }
  }, [router])

  const handleUpdateProfile = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
    } else if (!/^\d{11}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be exactly 11 digits"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      // Update user data
      const updatedUser = {
        ...user,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
      }

      localStorage.setItem("moneymax_current_user", JSON.stringify(updatedUser))

      // Update users array
      const users = JSON.parse(localStorage.getItem("moneymax_users") || "[]")
      const userIndex = users.findIndex((u: any) => u.id === user.id)
      if (userIndex !== -1) {
        users[userIndex] = updatedUser
        localStorage.setItem("moneymax_users", JSON.stringify(users))
      }

      setUser(updatedUser)
      alert("Profile updated successfully!")
    }
  }

  const handleChangePassword = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required"
    } else if (formData.currentPassword !== user.password) {
      newErrors.currentPassword = "Current password is incorrect"
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (formData.newPassword.length !== 11) {
      newErrors.newPassword = "Password must be exactly 11 characters"
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.newPassword)) {
      newErrors.newPassword = "Password must contain only letters and digits"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required"
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      // Update password
      const updatedUser = {
        ...user,
        password: formData.newPassword,
      }

      localStorage.setItem("moneymax_current_user", JSON.stringify(updatedUser))

      // Update users array
      const users = JSON.parse(localStorage.getItem("moneymax_users") || "[]")
      const userIndex = users.findIndex((u: any) => u.id === user.id)
      if (userIndex !== -1) {
        users[userIndex] = updatedUser
        localStorage.setItem("moneymax_users", JSON.stringify(users))
      }

      setUser(updatedUser)
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
      alert("Password changed successfully!")
    }
  }

  const handlePreferenceChange = (key: string, value: any) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
    localStorage.setItem(`preferences_${user.id}`, JSON.stringify(newPreferences))
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <SettingsIcon className="w-5 h-5" />
                <CardTitle>Account Settings</CardTitle>
              </div>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                    className={errors.fullName ? "border-red-500" : ""}
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                    className={errors.phoneNumber ? "border-red-500" : ""}
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                </div>
              </div>
              <Button onClick={handleUpdateProfile} className="bg-blue-600 hover:bg-blue-700">
                Update Profile
              </Button>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <CardTitle>Security</CardTitle>
              </div>
              <CardDescription>Change your password and manage security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={(e) => setFormData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                      className={errors.currentPassword ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.currentPassword && <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>}
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, newPassword: e.target.value }))}
                    className={errors.newPassword ? "border-red-500" : ""}
                  />
                  {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
              <Button onClick={handleChangePassword} className="bg-blue-600 hover:bg-blue-700">
                Change Password
              </Button>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Login Activity</h4>
                <p className="text-sm text-gray-600">Last login: {new Date().toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={preferences.smsNotifications}
                  onCheckedChange={(checked) => handlePreferenceChange("smsNotifications", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <CardTitle>Privacy</CardTitle>
              </div>
              <CardDescription>Control your privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dataSharing">Data Sharing</Label>
                  <p className="text-sm text-gray-600">Allow sharing of anonymized data for service improvement</p>
                </div>
                <Switch
                  id="dataSharing"
                  checked={preferences.dataSharing}
                  onCheckedChange={(checked) => handlePreferenceChange("dataSharing", checked)}
                />
              </div>
              <div>
                <Button variant="outline" className="bg-transparent">
                  View Privacy Policy
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* App Preferences */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <CardTitle>App Preferences</CardTitle>
              </div>
              <CardDescription>Customize your app experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) => handlePreferenceChange("language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Filipino">Filipino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={preferences.theme} onValueChange={(value) => handlePreferenceChange("theme", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Light">Light Mode</SelectItem>
                      <SelectItem value="Dark">Dark Mode</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
