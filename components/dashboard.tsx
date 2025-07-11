"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Send, Shield, Coins, Receipt, TrendingUp, Settings, HelpCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MobileNav } from "@/components/mobile-nav"

interface DashboardUser {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  availableBalance: number
  loans: any[]
  transactions: any[]
}

export function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])

  useEffect(() => {
    const currentUser = localStorage.getItem("moneymax_current_user")
    if (!currentUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Load recent transactions
    const transactions = userData.transactions || []
    setRecentTransactions(transactions.slice(-5).reverse())
  }, [router])

  if (!user) {
    return <div>Loading...</div>
  }

  const features = [
    {
      title: "Get OTP Code",
      icon: Shield,
      href: "/otp",
      description: "Generate secure OTP",
    },
    {
      title: "Repay Loan",
      icon: Coins,
      href: "/repay-loan",
      description: "Make loan payments",
    },
    {
      title: "Pay Bills",
      icon: Receipt,
      href: "/pay-bills",
      description: "Pay your bills",
    },
    {
      title: "Loan Status",
      icon: TrendingUp,
      href: "/loan-status",
      description: "Check loan progress",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
      description: "Account settings",
    },
    {
      title: "Help",
      icon: HelpCircle,
      href: "/help",
      description: "Get support",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">MM</span>
              </div>
              <span className="text-xl font-bold text-gray-900">MoneyMax</span>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem("moneymax_current_user")
                router.push("/")
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.fullName}!</h1>
          <p className="text-gray-600">Ready to manage your finances?</p>
        </div>

        {/* Balance Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-blue-100 mb-2">Available Balance</p>
                <p className="text-3xl font-bold">₱{user.availableBalance.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-blue-100 mb-2">Account ID</p>
                <p className="font-mono">{user.phoneNumber}</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link href="/apply-loan" className="flex-1">
                <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Apply for Loan
                </Button>
              </Link>
              <Link href="/transfer" className="flex-1">
                <Button className="w-full bg-blue-500 hover:bg-blue-400">
                  <Send className="w-4 h-4 mr-2" />
                  Transfer Funds
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {features.map((feature, index) => (
            <Link key={index} href={feature.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest transactions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{transaction.type}</p>
                      <p className="text-sm text-gray-600">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₱{transaction.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{transaction.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No recent activity</p>
            )}
          </CardContent>
        </Card>
      </div>

      <MobileNav />
    </div>
  )
}
