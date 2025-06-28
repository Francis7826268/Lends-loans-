"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  CreditCard,
  Send,
  Shield,
  RefreshCw,
  Receipt,
  Home,
  Inbox,
  FileText,
  User,
  Calendar,
  TrendingUp,
  Settings,
  HelpCircle,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface UserData {
  fullName: string
  email: string
  phoneNumber: string
  dateJoined: string
  availableBalance: number
  hasActiveLoan: boolean
  loanDetails?: {
    amount: number
    monthlyPayment: number
    nextPaymentDate: string
    progress: number
    interestRate: number
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [activeTab, setActiveTab] = useState("home")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("moneymax_authenticated")
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Load user data
    const userDataStr = localStorage.getItem("moneymax_user")
    if (userDataStr) {
      const data = JSON.parse(userDataStr)

      // Verify user still exists in registered users (in case of data corruption)
      const registeredUsers = JSON.parse(localStorage.getItem("moneymax_registered_users") || "[]")
      const userExists = registeredUsers.some((user: any) => user.email === data.email)

      if (userExists) {
        setUserData(data)
      } else {
        // User data is corrupted, redirect to login
        localStorage.removeItem("moneymax_authenticated")
        localStorage.removeItem("moneymax_user")
        router.push("/login")
        return
      }
    } else {
      // No user data found, redirect to login
      router.push("/login")
      return
    }

    setIsLoading(false)
  }, [router])

  // Create demo account if it doesn't exist
  useEffect(() => {
    const registeredUsers = JSON.parse(localStorage.getItem("moneymax_registered_users") || "[]")
    const demoExists = registeredUsers.some((user: any) => user.email === "demo@moneymax.com")

    if (!demoExists) {
      const demoUser = {
        fullName: "Demo User",
        email: "demo@moneymax.com",
        phoneNumber: "09123456789",
        password: "demo1234567",
        dateJoined: new Date().toISOString(),
        availableBalance: 50000,
        hasActiveLoan: true,
        loanDetails: {
          amount: 100000,
          monthlyPayment: 9167,
          nextPaymentDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          progress: 25,
          interestRate: 4,
        },
      }

      registeredUsers.push(demoUser)
      localStorage.setItem("moneymax_registered_users", JSON.stringify(registeredUsers))
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return <div>Loading...</div>
  }

  const BottomNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center p-2 ${activeTab === "home" ? "text-blue-600" : "text-gray-500"}`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </button>
        <Link href="/inbox" className="flex flex-col items-center p-2 text-gray-500">
          <Inbox className="h-5 w-5" />
          <span className="text-xs mt-1">Inbox</span>
        </Link>
        <div className="flex flex-col items-center p-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">MM</span>
          </div>
        </div>
        <Link href="/transactions" className="flex flex-col items-center p-2 text-gray-500">
          <FileText className="h-5 w-5" />
          <span className="text-xs mt-1">Transactions</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center p-2 text-gray-500">
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MM</span>
              </div>
              <span className="text-xl font-bold">MoneyMax</span>
            </div>
            <Link href="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Welcome Message */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userData.fullName}!</h1>
          <p className="text-gray-600 mt-1">Ready to manage your finances?</p>
        </div>

        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-blue-100 text-sm">Available Balance</p>
                <p className="text-3xl font-bold">₱{userData.availableBalance.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Account ID</p>
                <p className="text-lg font-medium">{userData.phoneNumber}</p>
              </div>
              <div className="flex space-x-3 pt-2">
                <Link href="/apply-loan" className="flex-1">
                  <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Apply for Loan
                  </Button>
                </Link>
                <Link href="/transfer" className="flex-1">
                  <Button className="w-full bg-blue-500 hover:bg-blue-400">
                    <Send className="h-4 w-4 mr-2" />
                    Transfer Funds
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions - Updated Layout */}
        <div className="space-y-4">
          {/* Top Row */}
          <div className="grid grid-cols-3 gap-4">
            <Link href="/get-otp">
              <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                <Shield className="h-6 w-6" />
                <span className="text-xs">Get OTP Code</span>
              </Button>
            </Link>
            <Link href="/repay-loan">
              <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                <RefreshCw className="h-6 w-6" />
                <span className="text-xs">Repay Loan</span>
              </Button>
            </Link>
            <Link href="/pay-bills">
              <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                <Receipt className="h-6 w-6" />
                <span className="text-xs">Pay Bills</span>
              </Button>
            </Link>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-3 gap-4">
            <Link href="/loan-status">
              <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                <TrendingUp className="h-6 w-6" />
                <span className="text-xs">Loan Status</span>
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                <Settings className="h-6 w-6" />
                <span className="text-xs">Settings</span>
              </Button>
            </Link>
            <Link href="/help">
              <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                <HelpCircle className="h-6 w-6" />
                <span className="text-xs">Help</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Loan Analytics (if user has active loan) */}
        {userData.hasActiveLoan && userData.loanDetails && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Loan Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Interest Rate</p>
                  <p className="text-lg font-semibold">{userData.loanDetails.interestRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Next Payment</p>
                  <p className="text-lg font-semibold">₱{userData.loanDetails.monthlyPayment.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600">Due Date</p>
                  <Badge variant="outline">
                    <Calendar className="h-3 w-3 mr-1" />
                    {userData.loanDetails.nextPaymentDate}
                  </Badge>
                </div>
                <Progress value={userData.loanDetails.progress} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">{userData.loanDetails.progress}% completed</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest transactions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Account Verified</p>
                    <p className="text-xs text-gray-500">Welcome to MoneyMax!</p>
                  </div>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  )
}
