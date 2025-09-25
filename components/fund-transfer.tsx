"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, AlertTriangle, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const DEMO_OTP_CODES = [
  "739281",
  "501746",
  "825903",
  "164872",
  "930517",
  "472185",
  "291064",
  "618390",
  "057429",
  "386250",
]

export function FundTransfer() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [transferData, setTransferData] = useState({
    method: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
    amount: "",
  })
  const [otp, setOtp] = useState("")
  const [otpError, setOtpError] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const banks = [
    "BDO",
    "BPI",
    "Metrobank",
    "Landbank",
    "PNB",
    "UnionBank",
    "Security Bank",
    "RCBC",
    "Chinabank",
    "EastWest Bank",
    "GCash",
    "PayMaya",
  ]

  const isContinueEnabled = () => {
    // Check all required fields are filled
    if (!transferData.method) return false
    if (!transferData.bankName) return false
    if (!transferData.accountName.trim()) return false
    if (!transferData.accountNumber.trim()) return false

    // Check amount is valid
    const amount = Number.parseFloat(transferData.amount)
    if (!amount || amount <= 0) return false

    // Check sufficient balance (no transfer fee)
    const currentUser = JSON.parse(localStorage.getItem("moneymax_current_user") || "{}")
    if (amount > currentUser.availableBalance) return false

    return true
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!transferData.method) newErrors.method = "Transfer method is required"
    if (!transferData.bankName) newErrors.bankName = "Bank name is required"
    if (!transferData.accountName.trim()) newErrors.accountName = "Account name is required"
    if (!transferData.accountNumber.trim()) newErrors.accountNumber = "Account number is required"

    const amount = Number.parseFloat(transferData.amount)
    if (!amount || amount <= 0) {
      newErrors.amount = "Amount must be greater than 0"
    } else {
      // Check if user has sufficient balance (no transfer fee)
      const currentUser = JSON.parse(localStorage.getItem("moneymax_current_user") || "{}")
      if (amount > currentUser.availableBalance) {
        newErrors.amount = "Insufficient balance"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleStep1Submit = () => {
    if (validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handleGetOTP = () => {
    window.open("https://m.me/829131176945949?source=qr_link_share", "_blank")
  }

  const handleTransferSubmit = () => {
    if (!otp.trim()) {
      setOtpError("OTP is required")
      return
    }

    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits")
      return
    }

    // Check if OTP is valid (demo codes)
    if (!DEMO_OTP_CODES.includes(otp)) {
      setOtpError("Incorrect OTP. Please try again or request a new code.")
      return
    }

    // Process transfer
    const currentUser = JSON.parse(localStorage.getItem("moneymax_current_user") || "{}")
    const transferAmount = Number.parseFloat(transferData.amount)

    // Deduct from balance (no transfer fee)
    currentUser.availableBalance -= transferAmount

    // Add transaction
    const transaction = {
      id: Date.now().toString(),
      type: "Fund Transfer",
      amount: transferAmount,
      fee: 0, // No transfer fee
      date: new Date().toISOString(),
      status: "Completed",
      method: transferData.method,
      bankName: transferData.bankName,
      accountName: transferData.accountName,
      accountNumber: transferData.accountNumber,
      reference: `REF${Math.floor(Math.random() * 1000000)}`,
    }

    currentUser.transactions = currentUser.transactions || []
    currentUser.transactions.push(transaction)

    // Update localStorage
    localStorage.setItem("moneymax_current_user", JSON.stringify(currentUser))

    // Update users array
    const users = JSON.parse(localStorage.getItem("moneymax_users") || "[]")
    const userIndex = users.findIndex((u: any) => u.id === currentUser.id)
    if (userIndex !== -1) {
      users[userIndex] = currentUser
      localStorage.setItem("moneymax_users", JSON.stringify(users))
    }

    // Store transfer data for success page
    localStorage.setItem(
      "transfer_success_data",
      JSON.stringify({
        ...transferData,
        amount: transferAmount,
        fee: 0, // No transfer fee
        total: transferAmount, // Total is just the amount
        reference: transaction.reference,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      }),
    )

    // Show success notification
    const notification = document.createElement("div")
    notification.className = "fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50"
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
        <span>Transfer Successful – ₱${transferAmount.toLocaleString()} has been sent.</span>
      </div>
    `
    document.body.appendChild(notification)

    setTimeout(() => {
      document.body.removeChild(notification)
      router.push("/transfer-success")
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>

        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Fund Transfer</CardTitle>
              <CardDescription>Transfer funds to bank account or GCash</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="method">Transfer Method</Label>
                  <Select
                    value={transferData.method}
                    onValueChange={(value) => setTransferData((prev) => ({ ...prev, method: value }))}
                  >
                    <SelectTrigger className={errors.method ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select transfer method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bank">Bank Transfer</SelectItem>
                      <SelectItem value="GCash">GCash</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.method && <p className="text-red-500 text-sm mt-1">{errors.method}</p>}
                </div>

                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Select
                    value={transferData.bankName}
                    onValueChange={(value) => setTransferData((prev) => ({ ...prev, bankName: value }))}
                  >
                    <SelectTrigger className={errors.bankName ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
                </div>

                <div>
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    value={transferData.accountName}
                    onChange={(e) => setTransferData((prev) => ({ ...prev, accountName: e.target.value }))}
                    placeholder="Enter account holder name"
                    className={errors.accountName ? "border-red-500" : ""}
                  />
                  {errors.accountName && <p className="text-red-500 text-sm mt-1">{errors.accountName}</p>}
                </div>

                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={transferData.accountNumber}
                    onChange={(e) => setTransferData((prev) => ({ ...prev, accountNumber: e.target.value }))}
                    placeholder="Enter account number"
                    className={errors.accountNumber ? "border-red-500" : ""}
                  />
                  {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>}
                </div>

                <div>
                  <Label htmlFor="amount">Amount (₱)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={transferData.amount}
                    onChange={(e) => setTransferData((prev) => ({ ...prev, amount: e.target.value }))}
                    placeholder="Enter amount"
                    className={errors.amount ? "border-red-500" : ""}
                  />
                  {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                  <p className="text-sm text-green-600 mt-1">No transfer fees!</p>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  onClick={handleStep1Submit}
                  disabled={!isContinueEnabled()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Verify Your Transfer</CardTitle>
              <CardDescription>
                Please confirm your transfer details and enter a valid 6-digit OTP code to proceed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Transfer Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Transfer Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span>₱{Number.parseFloat(transferData.amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Method:</span>
                      <span>{transferData.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bank Name:</span>
                      <span>{transferData.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Account Number:</span>
                      <span>{transferData.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Account Name:</span>
                      <span>{transferData.accountName}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>Transfer Fee:</span>
                      <span className="text-green-600 font-semibold">FREE</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>₱{Number.parseFloat(transferData.amount).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* OTP Section */}
                <div>
                  <Label htmlFor="otp">Enter 6-digit OTP</Label>
                  <div className="flex space-x-2 mt-2">
                    <div className="relative flex-1">
                      <Input
                        id="otp"
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => {
                          setOtp(e.target.value.replace(/\D/g, ""))
                          setOtpError("")
                        }}
                        placeholder="000000"
                        className={`text-center text-lg tracking-widest ${otpError ? "border-red-500" : ""}`}
                      />
                      <Shield className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  {otpError && (
                    <div className="flex items-center space-x-2 mt-2 text-red-600 bg-red-50 p-3 rounded-md">
                      <X className="w-4 h-4" />
                      <span className="text-sm">{otpError}</span>
                    </div>
                  )}
                </div>

                {/* Get OTP Button */}
                <div className="text-center">
                  <Button type="button" variant="outline" onClick={handleGetOTP} className="mb-2 bg-transparent">
                    <Shield className="w-4 h-4 mr-2" />
                    Get OTP
                  </Button>
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                    <div className="flex items-center space-x-2 text-yellow-800">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-medium">OTP Cost: ₱1,500 per request</span>
                    </div>
                  </div>
                </div>

                <Button onClick={handleTransferSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
                  Confirm Transfer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
