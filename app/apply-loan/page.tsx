"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calculator, FileText, Clock, CheckCircle, CreditCard } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ApplyLoanPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loanAmount, setLoanAmount] = useState([100000])
  const [duration, setDuration] = useState("12")
  const [applicationData, setApplicationData] = useState({
    purpose: "",
    monthlyIncome: "",
    employment: "",
    address: "",
  })
  const [processingStep, setProcessingStep] = useState(0)
  const [applicationId, setApplicationId] = useState("")
  const [canApply, setCanApply] = useState(true)
  const [hoursLeft, setHoursLeft] = useState(0)
useEffect(() => {
  const userData = JSON.parse(localStorage.getItem("moneymax_user") || "{}")
    const lastLoanApplication = localStorage.getItem("last_loan_application")

      if (lastLoanApplication) {
        const timeSinceLastApplication = Date.now() - Number.parseInt(lastLoanApplication)
          const cooldown = 24 * 60 * 60 * 1000

            if (timeSinceLastApplication < cooldown) {
                const hoursRemaining = Math.ceil((cooldown - timeSinceLastApplication) / (60 * 60 * 1000))
                    setCanApply(false)
                        setHoursLeft(hoursRemaining)
                            return
                              }
                              }

                        // 2. If user has applied before, enforce 24-hour cooldown
                          if (userData.hasAppliedBefore && lastLoanApplication) {
                              const timeSinceLastApplication = Date.now() - Number.parseInt(lastLoanApplication)
                                  const cooldown = 24 * 60 * 60 * 1000

                                      if (timeSinceLastApplication < cooldown) {
                                            const hoursRemaining = Math.ceil((cooldown - timeSinceLastApplication) / (60 * 60 * 1000))
                                                  setCanApply(false)
                                                        setHoursLeft(hoursRemaining)
                                                              return
                                                                  }
                                                                    }

                                                                      // 3. Allow application
                                                                        setCanApply(true)
                                                                        }, [])
  
  const [isClient, setIsClient] = useState(false)

  // Check if we're on the client side and handle 24-hour restriction
  useEffect(() => {
    setIsClient(true)

      if (typeof window !== "undefined") {
          const lastLoanApplication = localStorage.getItem("last_loan_application")
              const userData = JSON.parse(localStorage.getItem("moneymax_user") || "{}")

                  // Check if user has an active loan
                      if (userData.hasActiveLoan) {
                            setCanApply(false)
                                  setHoursLeft(-1) // Sentinel value to indicate active loan, not time-based restriction
                                        return
                                            }

                                               
                                               if (lastLoanApplication) {
                                                      const timeLeft = 24 * 60 * 60 * 1000 - (Date.now() - Number.parseInt(lastLoanApplication))
                                                            if (timeLeft > 0) {
                                                                    setCanApply(false)
                                                                            setHoursLeft(Math.ceil(timeLeft / (60 * 60 * 1000)))
                                                                                  }
                                                                                      }
                                                                                        }
                                                                                        }, [])
  
  // Create demo account if it doesn't exist (only on client side)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const registeredUsers = JSON.parse(localStorage.getItem("moneymax_registered_users") || "[]")
      const demoExists = registeredUsers.some((user: any) => user.email === "demo@moneymax.com")

      if (!demoExists) {
        const demoUser = {
          fullName: "Demo User",
          email: "demo@moneymax.com",
          phoneNumber: "09123456789",
          password: "demo1234567",
          dateJoined: new Date().toISOString(),
          availableBalance: 50000,
          hasActiveLoan: true,
          loanDetails: {
            amount: 100000,
            monthlyPayment: 9167,
            nextPaymentDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            progress: 25,
            interestRate: 4,
          },
        }

        registeredUsers.push(demoUser)
        localStorage.setItem("moneymax_registered_users", JSON.stringify(registeredUsers))
      }
    }
  }, [])

  const calculateLoan = () => {
    const principal = loanAmount[0]
    const months = Number.parseInt(duration)
    const interestRate = 0.04 // 4% annual
    const monthlyRate = interestRate / 12
    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    const totalRepayment = monthlyPayment * months
    const totalInterest = totalRepayment - principal

    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(totalInterest),
      totalRepayment: Math.round(totalRepayment),
    }
  }

  const loan = calculateLoan()

  const handleNextStep = () => {
    if (currentStep === 2) {
      // Start processing
      setCurrentStep(3)
      startProcessing()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const startProcessing = () => {
    const id = `MM${Date.now().toString().slice(-8)}`
    setApplicationId(id)

    // Simulate processing steps
    const steps = [
      { delay: 1000, step: 1 },
      { delay: 2000, step: 2 },
      { delay: 3000, step: 3 },
      { delay: 4000, step: 4 },
    ]

    steps.forEach(({ delay, step }) => {
      setTimeout(() => {
        setProcessingStep(step)
        if (step === 4) {
          setTimeout(() => {
              setCurrentStep(4)
                  handleLoanSuccess()
                    }, 1000)
        }
      }, delay)
    })
  }

  const handleLoanSuccess = () => {
    if (typeof window !== "undefined") {
      // Update user data
      const userData = JSON.parse(localStorage.getItem("moneymax_user") || "{}")
      userData.availableBalance = (userData.availableBalance || 0) + loanAmount[0]
      userData.hasActiveLoan = true
      userData.loanDetails = {
        amount: loanAmount[0],
        monthlyPayment: loan.monthlyPayment,
        nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        progress: 0,
        interestRate: 4,
      }
      localStorage.setItem("moneymax_user", JSON.stringify(userData))
      localStorage.setItem("last_loan_application", Date.now().toString())

      // Enhanced transaction logging
      const transactions = JSON.parse(localStorage.getItem("moneymax_transactions") || "[]")
      const newTransaction = {
        id: `TXN${Date.now()}`,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        type: "Loan",
        status: "Completed",
        amount: loanAmount[0],
        description: `Loan approved - ${applicationData.purpose}`,
        reference: `REF${applicationId}`,
        applicationId: applicationId,
        purpose: applicationData.purpose,
        duration: duration,
        monthlyPayment: loan.monthlyPayment,
        interestRate: 4,
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
    }

    router.push("/dashboard")
  }

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!canApply) {
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
              <Clock className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <CardTitle>Loan Application Restricted</CardTitle>
              <CardDescription>Please wait 24 hours before applying again.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {hoursLeft === -1 ? (
                <>
                    <p className="text-2xl font-bold text-red-600 mb-2">Active Loan Detected</p>
                        <p className="text-gray-600">You currently have an active loan. Please repay it before applying for a new one.</p>
                          </>
                          ) : (
                            <>
                                <p className="text-2xl font-bold text-orange-600 mb-2">{hoursLeft} hours remaining</p>
                                    <p className="text-gray-600">You can apply for your next loan after the waiting period.</p>
                                      </>
                                      )}
            
            </CardContent>
          </Card>
        </div>
      </div>
    )
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

        {/* Step 1: Calculator */}
        {currentStep === 1 && (
          <Card>
            <CardHeader className="text-center">
              <Calculator className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Loan Calculator</CardTitle>
              <CardDescription>Calculate your loan terms and monthly payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Loan Amount</Label>
                <div className="mt-2">
                  <Slider
                    value={loanAmount}
                    onValueChange={setLoanAmount}
                    max={500000}
                    min={5000}
                    step={1000}
                    className="mb-4"
                  />
                  <Input
                    type="number"
                    value={loanAmount[0]}
                    onChange={(e) =>
                      setLoanAmount([Math.min(Math.max(Number.parseInt(e.target.value) || 5000, 5000), 500000)])
                    }
                    min={5000}
                    max={500000}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  ₱{loanAmount[0].toLocaleString()} (Min: ₱5,000 - Max: ₱500,000)
                </p>
              </div>

              <div>
                <Label className="text-base font-medium">Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 58 }, (_, i) => i + 3).map((month) => (
                      <SelectItem key={month} value={month.toString()}>
                        {month} months
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Payment</span>
                  <span className="font-bold text-blue-600">₱{loan.monthlyPayment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Interest</span>
                  <span className="font-semibold">₱{loan.totalInterest.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Repayment</span>
                  <span className="font-semibold">₱{loan.totalRepayment.toLocaleString()}</span>
                </div>
              </div>

              <Button onClick={handleNextStep} className="w-full">
                Continue to Application
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Application Form */}
        {currentStep === 2 && (
          <Card>
            <CardHeader className="text-center">
              <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Application Form</CardTitle>
              <CardDescription>Please provide your information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Loan Purpose</Label>
                <Select
                  value={applicationData.purpose}
                  onValueChange={(value) => setApplicationData((prev) => ({ ...prev, purpose: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Monthly Income</Label>
                <Input
                  type="number"
                  value={applicationData.monthlyIncome}
                  onChange={(e) => setApplicationData((prev) => ({ ...prev, monthlyIncome: e.target.value }))}
                  placeholder="Enter monthly income"
                />
              </div>

              <div>
                <Label>Employment Status</Label>
                <Select
                  value={applicationData.employment}
                  onValueChange={(value) => setApplicationData((prev) => ({ ...prev, employment: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="self-employed">Self-Employed</SelectItem>
                    <SelectItem value="business-owner">Business Owner</SelectItem>
                    <SelectItem value="freelancer">Freelancer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Address</Label>
                <Input
                  value={applicationData.address}
                  onChange={(e) => setApplicationData((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter your address"
                />
              </div>

              <Button
                onClick={handleNextStep}
                className="w-full"
                disabled={
                  !applicationData.purpose ||
                  !applicationData.monthlyIncome ||
                  !applicationData.employment ||
                  !applicationData.address
                }
              >
                Submit Application
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Processing */}
        {currentStep === 3 && (
          <Card>
            <CardHeader className="text-center">
              <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Processing Application</CardTitle>
              <CardDescription>Please wait while we process your loan application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div
                  className={`flex items-center space-x-3 ${processingStep >= 1 ? "text-green-600" : "text-gray-400"}`}
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Application Received</span>
                  {processingStep >= 1 && <Badge variant="secondary">✅</Badge>}
                </div>
                <div
                  className={`flex items-center space-x-3 ${processingStep >= 2 ? "text-green-600" : "text-gray-400"}`}
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Document Verification</span>
                  {processingStep >= 2 && <Badge variant="secondary">✅</Badge>}
                </div>
                <div
                  className={`flex items-center space-x-3 ${processingStep >= 3 ? "text-green-600" : "text-gray-400"}`}
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Credit Assessment</span>
                  {processingStep >= 3 && <Badge variant="secondary">✅</Badge>}
                </div>
                <div
                  className={`flex items-center space-x-3 ${processingStep >= 4 ? "text-green-600" : "text-gray-400"}`}
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Final Approval</span>
                  {processingStep >= 4 && <Badge variant="secondary">✅</Badge>}
                </div>
              </div>

              <Progress value={(processingStep / 4) * 100} className="h-2" />

              <Card className="bg-gray-50">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Application ID</span>
                    <span className="text-sm font-medium">{applicationId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Amount</span>
                    <span className="text-sm font-medium">₱{loanAmount[0].toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Term</span>
                    <span className="text-sm font-medium">{duration} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Monthly Payment</span>
                    <span className="text-sm font-medium">₱{loan.monthlyPayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Purpose</span>
                    <span className="text-sm font-medium capitalize">{applicationData.purpose}</span>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Success */}
        {currentStep === 4 && (
          <Card>
            <CardHeader className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-green-600">Loan Approved!</CardTitle>
              <CardDescription>Congratulations! Your loan has been approved</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Application ID</span>
                    <span className="text-sm font-medium">{applicationId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Loan Amount</span>
                    <span className="text-lg font-bold text-green-600">₱{loanAmount[0].toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="text-sm font-medium">{duration} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Interest Rate</span>
                    <span className="text-sm font-medium">4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Monthly Payment</span>
                    <span className="text-sm font-medium">₱{loan.monthlyPayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Repayment</span>
                    <span className="text-sm font-medium">₱{loan.totalRepayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Start Date</span>
                    <span className="text-sm font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Due Date</span>
                    <span className="text-sm font-medium">
                      {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Reference Code</span>
                    <span className="text-sm font-medium">REF{applicationId}</span>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleLoanSuccess} className="w-full bg-green-600 hover:bg-green-700">
                <CreditCard className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
