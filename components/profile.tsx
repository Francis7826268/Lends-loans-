"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, Calendar, CreditCard, TrendingUp, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Profile() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalLoans: 0,
    activeLoans: 0,
    totalBorrowed: 0,
    totalRepaid: 0,
    totalTransactions: 0,
  })

  useEffect(() => {
    const currentUser = localStorage.getItem("moneymax_current_user")
    if (!currentUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Calculate user statistics
    const loans = userData.loans || []
    const transactions = userData.transactions || []

    const totalBorrowed = loans.reduce((sum: number, loan: any) => sum + loan.amount, 0)
    const totalRepaid = transactions
      .filter((t: any) => t.type === "Loan Repayment")
      .reduce((sum: number, t: any) => sum + t.amount, 0)

    setStats({
      totalLoans: loans.length,
      activeLoans: loans.filter((loan: any) => loan.status === "Active").length,
      totalBorrowed,
      totalRepaid,
      totalTransactions: transactions.length,
    })
  }, [router])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20 md:pb-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">View and manage your account information</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{user.fullName}</CardTitle>
                      <CardDescription>MoneyMax Member</CardDescription>
                    </div>
                  </div>
                  <Link href="/settings">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email Address</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone Number (Account ID)</p>
                        <p className="font-medium font-mono">{user.phoneNumber}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Date Joined</p>
                        <p className="font-medium">{new Date(user.dateJoined).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Account Status</p>
                        <Badge className="bg-green-500">Active</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Account Statistics</CardTitle>
                <CardDescription>Your financial activity summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">Total Loans</span>
                      <span className="text-lg font-bold text-blue-600">{stats.totalLoans}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Active Loans</span>
                      <span className="text-lg font-bold text-green-600">{stats.activeLoans}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium">Total Transactions</span>
                      <span className="text-lg font-bold text-purple-600">{stats.totalTransactions}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-sm font-medium">Total Borrowed</span>
                      <span className="text-lg font-bold text-orange-600">₱{stats.totalBorrowed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
                      <span className="text-sm font-medium">Total Repaid</span>
                      <span className="text-lg font-bold text-teal-600">₱{stats.totalRepaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Available Balance</span>
                      <span className="text-lg font-bold text-gray-600">₱{user.availableBalance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest financial activities</CardDescription>
              </CardHeader>
              <CardContent>
                {user.transactions && user.transactions.length > 0 ? (
                  <div className="space-y-3">
                    {user.transactions
                      .slice(-5)
                      .reverse()
                      .map((transaction: any, index: number) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                          <div>
                            <p className="font-medium text-sm">{transaction.type}</p>
                            <p className="text-xs text-gray-600">{new Date(transaction.date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-bold text-sm ${
                                transaction.type === "Loan Approved" ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {transaction.type === "Loan Approved" ? "+" : "-"}₱{transaction.amount.toLocaleString()}
                            </p>
                            <Badge className="text-xs" variant="outline">
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">No recent activity</p>
                )}
                <div className="mt-4 pt-4 border-t">
                  <Link href="/transactions">
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Transactions
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/apply-loan">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Apply for Loan
                  </Button>
                </Link>
                <Link href="/transfer">
                  <Button variant="outline" className="w-full bg-transparent">
                    Transfer Funds
                  </Button>
                </Link>
                <Link href="/repay-loan">
                  <Button variant="outline" className="w-full bg-transparent">
                    Repay Loan
                  </Button>
                </Link>
                <Link href="/pay-bills">
                  <Button variant="outline" className="w-full bg-transparent">
                    Pay Bills
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Account Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Account Health</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Credit Score</span>
                    <Badge className="bg-green-500">Excellent</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Payment History</span>
                    <Badge className="bg-green-500">On Time</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Account Standing</span>
                    <Badge className="bg-green-500">Good</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/help">
                  <Button variant="outline" className="w-full bg-transparent">
                    Help & Support
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="outline" className="w-full bg-transparent">
                    Account Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
