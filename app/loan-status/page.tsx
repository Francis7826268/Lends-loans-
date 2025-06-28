"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, Calendar, DollarSign, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

interface LoanDetails {
  amount: number
  monthlyPayment: number
  nextPaymentDate: string
  progress: number
  interestRate: number
  startDate?: string
  totalPaid?: number
  remainingBalance?: number
}

export default function LoanStatusPage() {
  const [loanDetails, setLoanDetails] = useState<LoanDetails | null>(null)
  const [hasActiveLoan, setHasActiveLoan] = useState(false)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("moneymax_user") || "{}")
    if (userData.hasActiveLoan && userData.loanDetails) {
      setLoanDetails(userData.loanDetails)
      setHasActiveLoan(true)
    }
  }, [])

  if (!hasActiveLoan || !loanDetails) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>

          <Card>
            <CardHeader className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <CardTitle className="text-gray-600">No Active Loan</CardTitle>
              <CardDescription>You don't have any active loans at the moment.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/apply-loan">
                <Button className="w-full">Apply for a Loan</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const totalLoanAmount = loanDetails.amount
  const totalPaid = Math.round((loanDetails.progress / 100) * totalLoanAmount)
  const remainingBalance = totalLoanAmount - totalPaid

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        {/* Loan Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Loan Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-600">Original Amount</p>
                <p className="text-xl font-bold text-blue-800">₱{totalLoanAmount.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-600">Total Paid</p>
                <p className="text-xl font-bold text-green-800">₱{totalPaid.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-sm text-orange-600">Remaining Balance</p>
              <p className="text-2xl font-bold text-orange-800">₱{remainingBalance.toLocaleString()}</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Loan Progress</span>
                <span className="text-sm font-medium">{loanDetails.progress}%</span>
              </div>
              <Progress value={loanDetails.progress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium">Monthly Payment</p>
                  <p className="text-sm text-gray-600">Due every month</p>
                </div>
              </div>
              <span className="text-lg font-bold">₱{loanDetails.monthlyPayment.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium">Next Payment Due</p>
                  <p className="text-sm text-gray-600">Don't miss your payment</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-yellow-100">
                {loanDetails.nextPaymentDate}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Interest Rate</p>
                  <p className="text-sm text-gray-600">Annual percentage rate</p>
                </div>
              </div>
              <span className="text-lg font-bold text-blue-600">{loanDetails.interestRate}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/repay-loan">
              <Button className="w-full" variant="default">
                <DollarSign className="h-4 w-4 mr-2" />
                Make Payment
              </Button>
            </Link>
            <Link href="/transactions">
              <Button className="w-full bg-transparent" variant="outline">
                <CheckCircle className="h-4 w-4 mr-2" />
                View Payment History
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
