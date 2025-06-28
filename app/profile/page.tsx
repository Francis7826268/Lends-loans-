"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Mail, Phone, Calendar, LogOut, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface UserData {
  fullName: string
  email: string
  phoneNumber: string
  dateJoined: string
  availableBalance: number
}

export default function ProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    const userDataStr = localStorage.getItem("moneymax_user")
    if (userDataStr) {
      const data = JSON.parse(userDataStr)
      setUserData(data)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("moneymax_authenticated")
    localStorage.removeItem("moneymax_user")
    router.push("/")
  }

  const BottomNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <Link href="/dashboard" className="flex flex-col items-center p-2 text-gray-500">
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/inbox" className="flex flex-col items-center p-2 text-gray-500">
          <Mail className="h-5 w-5" />
          <span className="text-xs mt-1">Inbox</span>
        </Link>
        <div className="flex flex-col items-center p-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">MM</span>
          </div>
        </div>
        <Link href="/transactions" className="flex flex-col items-center p-2 text-gray-500">
          <Calendar className="h-5 w-5" />
          <span className="text-xs mt-1">Transactions</span>
        </Link>
        <button className="flex flex-col items-center p-2 text-blue-600">
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  )

  if (!userData) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex items-center space-x-2">
              <User className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold">Profile</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{userData.fullName}</h2>
            <p className="text-gray-600">MoneyMax Member</p>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <User className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium">{userData.fullName}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{userData.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Phone Number</p>
                <p className="font-medium">{userData.phoneNumber}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Date Joined</p>
                <p className="font-medium">{new Date(userData.dateJoined).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card>
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Account Verified</p>
                  <p className="text-sm text-green-600">Your account is secure and verified</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogout} variant="destructive" className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  )
}
