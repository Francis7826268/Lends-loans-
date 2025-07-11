"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Calendar, DollarSign, Clock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function LoanStatus() {
  const router = useRouter()
  const [loans, setLoans] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = localStorage.getItem("moneymax_current_user")
    if (!currentUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)
    setLoans(userData.loans || [])
  }, [router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-blue-500"
      case "Paid":
        return "bg-green-500"
      case "Overdue":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getProgressPercentage = (loan: any) => {
    if (loan.status === "Paid") return 100
    const paid = loan.amount - loan.remainingBalance
    return Math.round((paid / loan.totalRepayment) * 100)
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loan Status</h1>
          <p className="text-gray-600">Track your loan progress and payment history</p>
        </div>

        {loans.length === 0 ? (
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <CardTitle>No Loans Found</CardTitle>
              <CardDescription>You don't have any loans yet</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/apply-loan">
                <Button className="bg-blue-600 hover:bg-blue-700">Apply for Loan</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Loan Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Borrowed</p>
                      <p className="text-2xl font-bold">
                        ₱{loans.reduce((sum, loan) => sum + loan.amount, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Outstanding Balance</p>
                      <p className="text-2xl font-bold">
                        ₱{loans.reduce((sum, loan) => sum + (loan.remainingBalance || 0), 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Active Loans</p>
                      <p className="text-2xl font-bold">{loans.filter((loan) => loan.status === "Active").length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Individual Loan Cards */}
            {loans.map((loan, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>Loan #{loan.id}</span>
                        <Badge className={getStatusColor(loan.status)}>{loan.status}</Badge>
                      </CardTitle>
                      <CardDescription>Applied on {new Date(loan.startDate).toLocaleDateString()}</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Monthly Payment</p>
                      <p className="text-lg font-bold">₱{loan.monthlyPayment.toLocaleString()}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Repayment Progress</span>
                        <span className="text-sm text-gray-600">{getProgressPercentage(loan)}%</span>
                      </div>
                      <Progress value={getProgressPercentage(loan)} className="h-2" />
                    </div>

                    {/* Loan Details Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Loan Amount:</span>
                          <span className="font-medium">₱{loan.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Interest Rate:</span>
                          <span className="font-medium">{loan.interestRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">{loan.duration} months</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Repayment:</span>
                          <span className="font-medium">₱{loan.totalRepayment.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Start Date:</span>
                          <span className="font-medium">{new Date(loan.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Due Date:</span>
                          <span className="font-medium">{new Date(loan.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Remaining Balance:</span>
                          <span className="font-bold text-red-600">
                            ₱{(loan.remainingBalance || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <Badge className={getStatusColor(loan.status)}>{loan.status}</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {loan.status === "Active" && loan.remainingBalance > 0 && (
                      <div className="flex space-x-4 pt-4 border-t">
                        <Link href="/repay-loan" className="flex-1">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">Make Payment</Button>
                        </Link>
                        <Button variant="outline" className="flex-1 bg-transparent">
                          <Calendar className="w-4 h-4 mr-2" />
                          Payment Schedule
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
