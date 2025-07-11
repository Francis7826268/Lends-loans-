"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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

export function PayBills() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [billData, setBillData] = useState({
    category: "",
    billerName: "",
    accountNumber: "",
    amount: "",
    remarks: "",
  })
  const [otp, setOtp] = useState("")
  const [otpError, setOtpError] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories = ["Electricity", "Water", "Internet", "Phone"]

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!billData.category) newErrors.category = "Category is required"
    if (!billData.billerName.trim()) newErrors.billerName = "Biller name is required"
    if (!billData.accountNumber.trim()) newErrors.accountNumber = "Account number/reference is required"

    const amount = Number.parseFloat(billData.amount)
    if (!amount || amount <= 0) {
      newErrors.amount = "Amount must be greater than 0"
    } else {
      // Check if user has sufficient balance
      const currentUser = JSON.parse(localStorage.getItem("moneymax_current_user") || "{}")
      if (amount > currentUser.availableBalance) {
        newErrors.amount = "Insufficient balance"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isContinueEnabled = () => {
    // Check all required fields are filled
    if (!billData.category) return false
    if (!billData.billerName.trim()) return false
    if (!billData.accountNumber.trim()) return false

    // Check amount is valid
    const amount = Number.parseFloat(billData.amount)
    if (!amount || amount <= 0) return false

    // Check sufficient balance
    const currentUser = JSON.parse(localStorage.getItem("moneymax_current_user") || "{}")
    if (amount > currentUser.availableBalance) return false

    return true
  }

  const handleStep1Submit = () => {
    if (validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handleGetOTP = () => {
    window.open("https://www.facebook.com/share/1DLgUmQRWp/", "_blank")
  }

  const handlePaymentSubmit = () => {
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

    // Process payment
    const currentUser = JSON.parse(localStorage.getItem("moneymax_current_user") || "{}")
    const billAmount = Number.parseFloat(billData.amount)

    // Deduct from balance
    currentUser.availableBalance -= billAmount

    // Add transaction
    const transaction = {
      id: Date.now().toString(),
      type: "Bill Payment",
      amount: billAmount,
      date: new Date().toISOString(),
      status: "Completed",
      category: billData.category,
      billerName: billData.billerName,
      accountNumber: billData.accountNumber,
      remarks: billData.remarks,
      reference: `BILL${Math.floor(Math.random() * 1000000)}`,
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

    // Show success notification
    const notification = document.createElement("div")
    notification.className = "fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50"
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
        <span>Bill Paid – ₱${billAmount.toLocaleString()} to ${billData.billerName}.</span>
      </div>
    `
    document.body.appendChild(notification)

    setTimeout(() => {
      document.body.removeChild(notification)
      router.push("/dashboard")
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
              <CardTitle>Pay Bills</CardTitle>
              <CardDescription>Pay your utility bills and other services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={billData.category}
                    onValueChange={(value) => setBillData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select bill category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>

                <div>
                  <Label htmlFor="billerName">Biller Name</Label>
                  <Input
                    id="billerName"
                    value={billData.billerName}
                    onChange={(e) => setBillData((prev) => ({ ...prev, billerName: e.target.value }))}
                    placeholder="Enter biller name (e.g., MERALCO, PLDT)"
                    className={errors.billerName ? "border-red-500" : ""}
                  />
                  {errors.billerName && <p className="text-red-500 text-sm mt-1">{errors.billerName}</p>}
                </div>

                <div>
                  <Label htmlFor="accountNumber">Account Number / Reference</Label>
                  <Input
                    id="accountNumber"
                    value={billData.accountNumber}
                    onChange={(e) => setBillData((prev) => ({ ...prev, accountNumber: e.target.value }))}
                    placeholder="Enter account number or reference"
                    className={errors.accountNumber ? "border-red-500" : ""}
                  />
                  {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>}
                </div>

                <div>
                  <Label htmlFor="amount">Amount (₱)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={billData.amount}
                    onChange={(e) => setBillData((prev) => ({ ...prev, amount: e.target.value }))}
                    placeholder="Enter bill amount"
                    className={errors.amount ? "border-red-500" : ""}
                  />
                  {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                </div>

                <div>
                  <Label htmlFor="remarks">Remarks (Optional)</Label>
                  <Textarea
                    id="remarks"
                    value={billData.remarks}
                    onChange={(e) => setBillData((prev) => ({ ...prev, remarks: e.target.value }))}
                    placeholder="Add any remarks"
                    rows={3}
                  />
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
              <CardTitle>Verify Your Bill Payment</CardTitle>
              <CardDescription>
                Please confirm your bill payment details and enter a valid 6-digit OTP code to proceed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Bill Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Bill Payment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span>{billData.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Biller Name:</span>
                      <span>{billData.billerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Account Number:</span>
                      <span>{billData.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-bold">₱{Number.parseFloat(billData.amount).toLocaleString()}</span>
                    </div>
                    {billData.remarks && (
                      <div className="flex justify-between">
                        <span>Remarks:</span>
                        <span>{billData.remarks}</span>
                      </div>
                    )}
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

                <Button onClick={handlePaymentSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
                  Confirm Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
