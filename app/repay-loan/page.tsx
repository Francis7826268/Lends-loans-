"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, RefreshCw, Shield, CheckCircle, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RepayLoanPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [otp, setOtp] = useState("")
  const [otpError, setOtpError] = useState("")
  const [repaymentData, setRepaymentData] = useState({
    loanReference: "",
    amount: "",
    remarks: "",
  })

  const validOtps = [
    "356667",
    "887555",
    "246789",
    "790986",
    "566447",
    "378899",
    "145667",
    "899976",
    "356788",
    "468999",
    "087644",
    "356888",
    "357886",
  ]

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!repaymentData.loanReference.trim()) newErrors.loanReference = "Loan reference is required"
    if (!repaymentData.amount) {
      newErrors.amount = "Repayment amount is required"
    } else if (Number.parseFloat(repaymentData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than ₱0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handleGetOtp = () => {
    window.open("https://www.facebook.com/profile.php?id=61577793063769", "_blank")
  }

  const handleConfirmRepayment = () => {
    if (!otp) {
      setOtpError("Please enter OTP code")
      return
    }

    if (!validOtps.includes(otp)) {
      setOtpError("❌ Invalid OTP code. Please request a new code and try again.")
      return
    }

    // Valid OTP - process repayment
    setCurrentStep(3)

    setTimeout(() => {
      // Update loan progress
      const userData = JSON.parse(localStorage.getItem("moneymax_user") || "{}")
      if (userData.loanDetails) {
        userData.loanDetails.progress = Math.min(userData.loanDetails.progress + 20, 100)
      }
      localStorage.setItem("moneymax_user", JSON.stringify(userData))

      // Enhanced transaction logging
      const transactions = JSON.parse(localStorage.getItem("moneymax_transactions") || "[]")
      const newTransaction = {
        id: `TXN${Date.now()}`,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        type: "Repayment",
        status: "Completed",
        amount: Number.parseFloat(repaymentData.amount),
        description: `Loan repayment - ${repaymentData.loanReference}`,
        reference: `REF${Date.now().toString().slice(-6)}`,
        loanReference: repaymentData.loanReference,
        remarks: repaymentData.remarks,
        userId: userData.email,
      }
      transactions.unshift(newTransaction)
      localStorage.setItem("moneymax_transactions", JSON.stringify(transactions))

      // Update registered users database
      const registeredUsers = JSON.parse(localStorage.getItem("moneymax_registered_users") || "[]")
      const userIndex = registeredUsers.findIndex((user: any) => user.email === userData.email)
      if (userIndex !== -1) {
        registeredUsers[userIndex] = userData
        localStorage.setItem("moneymax_registered_users", JSON.stringify(registeredUsers))
      }

      alert(`✅ Loan Repayment Successful – ₱${Number.parseFloat(repaymentData.amount).toLocaleString()} paid.`)
      router.push("/dashboard")
    }, 2000)
  }

  const handleInputChange = (field: string, value: string) => {
    setRepaymentData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        {/* Step 1: Repayment Form */}
        {currentStep === 1 && (
          <Card>
            <CardHeader className="text-center">
              <RefreshCw className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Repay Loan</CardTitle>
              <CardDescription>Make a payment towards your loan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Loan Reference</Label>
                <Input
                  value={repaymentData.loanReference}
                  onChange={(e) => handleInputChange("loanReference", e.target.value)}
                  placeholder="Enter loan reference number"
                />
                {errors.loanReference && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.loanReference}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label>Repayment Amount (₱)</Label>
                <Input
                  type="number"
                  value={repaymentData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="Enter repayment amount"
                  min="1"
                />
                {errors.amount && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.amount}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label>Remarks (Optional)</Label>
                <Textarea
                  value={repaymentData.remarks}
                  onChange={(e) => handleInputChange("remarks", e.target.value)}
                  placeholder="Add any remarks or notes"
                  rows={3}
                />
              </div>

              <Button onClick={handleContinue} className="w-full">
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Verify Repayment */}
        {currentStep === 2 && (
          <Card>
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Verify Your Repayment</CardTitle>
              <CardDescription>
                Please confirm your repayment details and enter a valid 6-digit OTP code to proceed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Repayment Summary */}
              <Card className="bg-green-50 border-green-200 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">Repayment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loan Reference</span>
                    <span className="font-medium">{repaymentData.loanReference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Repayment Amount</span>
                    <span className="font-bold text-green-600">
                      ₱{Number.parseFloat(repaymentData.amount).toLocaleString()}
                    </span>
                  </div>
                  {repaymentData.remarks && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remarks</span>
                      <span className="font-medium">{repaymentData.remarks}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* OTP Section */}
              <div className="space-y-4">
                <div>
                  <Label>Enter 6-Digit OTP</Label>
                  <Input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      setOtpError("")
                    }}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                  {otpError && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>{otpError}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-600">Click below to request your OTP code.</p>
                  <Button onClick={handleGetOtp} variant="outline" className="w-full bg-transparent">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Get OTP
                  </Button>
                  <p className="text-xs text-orange-600 font-medium">
                    Important: ₱1,500 will be charged per OTP request
                  </p>
                </div>
              </div>

              <Button onClick={handleConfirmRepayment} className="w-full" disabled={!otp}>
                Confirm Repayment
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Processing */}
        {currentStep === 3 && (
          <Card>
            <CardHeader className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-green-600">Repayment Completed ✅</CardTitle>
              <CardDescription>Your repayment is being processed...</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Please wait while we process your repayment...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
