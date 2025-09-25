"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Shield, AlertTriangle, X, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

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

export function RepayLoan() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loans, setLoans] = useState<any[]>([])
  const [repaymentData, setRepaymentData] = useState({
    loanReference: "",
    repaymentOption: "repay-all",
    repaymentAmount: "",
    remarks: "",
  })
  const [otp, setOtp] = useState("")
  const [otpError, setOtpError] = useState("")
  const [availableBalance, setAvailableBalance] = useState(0)

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("moneymax_current_user") || "{}")
    const userLoans = currentUser.loans || []
    const activeLoans = userLoans.filter((loan: any) => loan.status === "Active" && loan.remainingBalance > 0)

    setLoans(activeLoans)
    setAvailableBalance(currentUser.availableBalance || 0)
  }, [])

  const selectedLoan = loans.find((loan) => loan.id === repaymentData.loanReference)

  const isContinueEnabled = () => {
    // Must have a loan manually selected by user
    if (!repaymentData.loanReference || !selectedLoan) {
      return false
    }

    // If repay-selected option, must have valid amount
    if (repaymentData.repaymentOption === "repay-selected") {
      const amount = Number.parseFloat(repaymentData.repaymentAmount)
      if (!repaymentData.repaymentAmount || amount <= 0) {
        return false
      }
      if (amount > selectedLoan.remainingBalance) {
        return false
      }
      if (amount > availableBalance) {
        return false
      }
    }

    // For repay-all option, check sufficient balance
    if (repaymentData.repaymentOption === "repay-all") {
      if (selectedLoan.remainingBalance > availableBalance) {
        return false
      }
    }

    return true
  }

  const handleLoanSelection = (loanId: string) => {
    console.log("Selecting loan:", loanId)
    setRepaymentData((prev) => ({ ...prev, loanReference: loanId }))
  }

  const handleRepaymentOptionChange = (value: string) => {
    console.log("Changing repayment option to:", value)
    setRepaymentData((prev) => ({ ...prev, repaymentOption: value, repaymentAmount: "" }))
  }

  const handleStep1Submit = () => {
    console.log("Continue button clicked")
    console.log("Current repayment data:", repaymentData)
    console.log("Selected loan:", selectedLoan)
    console.log("Is continue enabled:", isContinueEnabled())

    // Force proceed to step 2 if we have a loan selected
    if (repaymentData.loanReference && selectedLoan) {
      console.log("Proceeding to step 2")
      setCurrentStep(2)
    } else {
      console.log("Cannot proceed - no loan selected")
    }
  }

  const handleGetOTP = () => {
    window.open("https://www.facebook.com/profile.php?id=61581252398388", "_blank")
  }

  const handleRepaymentSubmit = () => {
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

    // Process repayment
    const currentUser = JSON.parse(localStorage.getItem("moneymax_current_user") || "{}")
    const repayAmount =
      repaymentData.repaymentOption === "repay-all"
        ? selectedLoan.remainingBalance
        : Number.parseFloat(repaymentData.repaymentAmount)

    // Deduct from balance
    currentUser.availableBalance -= repayAmount

    // Update loan
    const loanIndex = currentUser.loans.findIndex((loan: any) => loan.id === repaymentData.loanReference)
    if (loanIndex !== -1) {
      currentUser.loans[loanIndex].remainingBalance -= repayAmount
      if (currentUser.loans[loanIndex].remainingBalance <= 0) {
        currentUser.loans[loanIndex].status = "Paid"
        currentUser.loans[loanIndex].remainingBalance = 0
      }
    }

    // Add transaction
    const transaction = {
      id: Date.now().toString(),
      type: "Loan Repayment",
      amount: repayAmount,
      date: new Date().toISOString(),
      status: "Completed",
      reference: repaymentData.loanReference,
      remarks: repaymentData.remarks,
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
        <span>Loan Repayment Successful – ₱${repayAmount.toLocaleString()} paid.</span>
      </div>
    `
    document.body.appendChild(notification)

    setTimeout(() => {
      document.body.removeChild(notification)
      router.push("/dashboard")
    }, 3000)
  }

  const getRepaymentAmount = () => {
    if (repaymentData.repaymentOption === "repay-all") {
      return selectedLoan?.remainingBalance || 0
    }
    return Number.parseFloat(repaymentData.repaymentAmount) || 0
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {loans.length === 0 && (
          <Card>
            <CardHeader className="text-center">
              <CardTitle>No Active Loans</CardTitle>
              <CardDescription>You don't have any active loans to repay</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/dashboard">
                <Button>Return to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {loans.length > 0 && currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Repay Loan - Step 1</CardTitle>
              <CardDescription>Select your loan and repayment details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Available Balance Display */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">Available Balance</p>
                  <p className="text-2xl font-bold text-blue-800">₱{availableBalance.toLocaleString()}</p>
                </div>

                <div>
                  <Label>Select Loan to Repay</Label>
                  <div className="mt-2 space-y-3">
                    {loans.map((loan) => (
                      <div
                        key={loan.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          repaymentData.loanReference === loan.id
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleLoanSelection(loan.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-4 h-4 rounded-full border-2 ${
                                repaymentData.loanReference === loan.id
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {repaymentData.loanReference === loan.id && (
                                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Loan #{loan.id}</p>
                              <p className="text-sm text-gray-600">
                                Original: ₱{loan.amount.toLocaleString()} • Monthly: ₱
                                {loan.monthlyPayment.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                Started: {new Date(loan.startDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-red-600 text-lg">
                              ₱{(loan.remainingBalance || 0).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">Remaining</p>
                            <Badge className="mt-1 bg-orange-500">{loan.status}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add this right after the loan selection section */}
                  {loans.length > 0 && !repaymentData.loanReference && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        👆 Please click on a loan above to select it for repayment
                      </p>
                    </div>
                  )}

                  {/* Selected Loan Summary */}
                  {repaymentData.loanReference && selectedLoan && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">✓ Selected Loan</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-green-700">Loan ID:</span>
                          <span className="font-medium ml-2">#{selectedLoan.id}</span>
                        </div>
                        <div>
                          <span className="text-green-700">Remaining Balance:</span>
                          <span className="font-bold ml-2">₱{selectedLoan.remainingBalance.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-green-700">Monthly Payment:</span>
                          <span className="font-medium ml-2">₱{selectedLoan.monthlyPayment.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-green-700">Interest Rate:</span>
                          <span className="font-medium ml-2">{selectedLoan.interestRate}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label>Repayment Option</Label>
                  <RadioGroup
                    value={repaymentData.repaymentOption}
                    onValueChange={handleRepaymentOptionChange}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="repay-all" id="repay-all" />
                      <Label htmlFor="repay-all">
                        Repay All Loans
                        {selectedLoan && (
                          <span className="ml-2 text-sm text-gray-600">
                            (₱{selectedLoan.remainingBalance.toLocaleString()})
                          </span>
                        )}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="repay-selected" id="repay-selected" />
                      <Label htmlFor="repay-selected">Repay Selected Amount</Label>
                    </div>
                  </RadioGroup>
                </div>

                {repaymentData.repaymentOption === "repay-selected" && (
                  <div>
                    <Label htmlFor="repaymentAmount">Repayment Amount (₱)</Label>
                    <Input
                      id="repaymentAmount"
                      type="number"
                      value={repaymentData.repaymentAmount}
                      onChange={(e) => setRepaymentData((prev) => ({ ...prev, repaymentAmount: e.target.value }))}
                      placeholder="Enter amount"
                    />
                    {selectedLoan && (
                      <p className="text-sm text-gray-600 mt-1">
                        Maximum: ₱{selectedLoan.remainingBalance.toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <Label htmlFor="remarks">Remarks (Optional)</Label>
                  <Textarea
                    id="remarks"
                    value={repaymentData.remarks}
                    onChange={(e) => setRepaymentData((prev) => ({ ...prev, remarks: e.target.value }))}
                    placeholder="Add any remarks"
                    rows={3}
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> You are obligated to repay all loaned money in full, regardless of
                    personal transfers.
                  </p>
                </div>

                {/* Balance Warning */}
                {selectedLoan && selectedLoan.remainingBalance > availableBalance && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong>Insufficient Balance:</strong> You need ₱{selectedLoan.remainingBalance.toLocaleString()}{" "}
                      but only have ₱{availableBalance.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <Button
                  onClick={handleStep1Submit}
                  disabled={!repaymentData.loanReference || !selectedLoan}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Continue to OTP Verification
                </Button>
                {(!repaymentData.loanReference || !selectedLoan) && (
                  <p className="text-red-500 text-sm mt-2 text-center">Please select a loan to continue</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Repay Loan - Step 2: OTP Verification</CardTitle>
              <CardDescription>
                Please confirm your repayment details and enter a valid 6-digit OTP code to proceed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Back Button */}
                <Button variant="outline" onClick={() => setCurrentStep(1)} className="mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Loan Selection
                </Button>

                {/* Repayment Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Repayment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Loan Reference:</span>
                      <span>#{repaymentData.loanReference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Repayment Option:</span>
                      <span>
                        {repaymentData.repaymentOption === "repay-all" ? "Repay All" : "Repay Selected Amount"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Repayment Amount:</span>
                      <span className="font-bold">₱{getRepaymentAmount().toLocaleString()}</span>
                    </div>
                    {repaymentData.remarks && (
                      <div className="flex justify-between">
                        <span>Remarks:</span>
                        <span>{repaymentData.remarks}</span>
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

                <Button onClick={handleRepaymentSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
                  Confirm Repayment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
