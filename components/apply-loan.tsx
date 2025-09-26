"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function ApplyLoan() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loanAmount, setLoanAmount] = useState([100000])
  const [duration, setDuration] = useState([12])
  const [applicationData, setApplicationData] = useState({
    purpose: "",
    employment: "",
    monthlyIncome: "",
    address: "",
  })
  const [processing, setProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const [applicationId, setApplicationId] = useState("")
  const [canApply, setCanApply] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Check 24-hour restriction
    const currentUser = JSON.parse(localStorage.getItem("moneymax_current_user") || "{}")
    const lastLoanApplication = localStorage.getItem(`last_loan_${currentUser.id}`)

    if (lastLoanApplication) {
      const lastApplicationTime = new Date(lastLoanApplication).getTime()
      const now = new Date().getTime()
      const timeDiff = now - lastApplicationTime
      const hoursRemaining = 24 - timeDiff / (1000 * 60 * 60)

      if (hoursRemaining > 0) {
        setCanApply(false)
        setTimeRemaining(hoursRemaining * 60 * 60) // Convert to seconds
      }
    }
  }, [])

  useEffect(() => {
    if (!canApply && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setCanApply(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [canApply, timeRemaining])

  const calculateLoan = (amount: number, months: number) => {
    const interestRate = 0.04 // 4% annual
    const monthlyRate = interestRate / 12
    const monthlyPayment =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    const totalRepayment = monthlyPayment * months
    const totalInterest = totalRepayment - amount

    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(totalInterest),
      totalRepayment: Math.round(totalRepayment),
    }
  }

  const loanCalc = calculateLoan(loanAmount[0], duration[0])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    return `${hours}h ${minutes}m ${secs}s`
  }

  // Check if all required fields are properly filled
  const isFormComplete = () => {
    const purposeValid = applicationData.purpose.trim().length > 0
    const employmentValid = applicationData.employment.trim().length > 0
    const addressValid = applicationData.address.trim().length >= 10

    // Check monthly income is valid number
    const incomeValue = applicationData.monthlyIncome.trim()
    const incomeNumber = Number.parseFloat(incomeValue)
    const incomeValid = incomeValue.length > 0 && !isNaN(incomeNumber) && incomeNumber > 0

    return purposeValid && employmentValid && incomeValid && addressValid
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}

    if (!applicationData.purpose.trim()) {
      newErrors.purpose = "Loan purpose is required"
    }

    if (!applicationData.employment.trim()) {
      newErrors.employment = "Employment status is required"
    }

    if (!applicationData.monthlyIncome.trim()) {
      newErrors.monthlyIncome = "Monthly income is required"
    } else {
      const income = Number.parseFloat(applicationData.monthlyIncome)
      if (isNaN(income) || income <= 0) {
        newErrors.monthlyIncome = "Please enter a valid monthly income"
      }
    }

    if (!applicationData.address.trim()) {
      newErrors.address = "Complete address is required"
    } else if (applicationData.address.trim().length < 10) {
      newErrors.address = "Please provide a complete address (minimum 10 characters)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleStepSubmit = () => {
    if (currentStep === 1) {
      setCurrentStep(2)
    } else if (currentStep === 2) {
      // Validate form before proceeding
      if (!isFormComplete()) {
        validateStep2() // This will set error messages
        return
      }

      if (!validateStep2()) {
        return
      }

      // Start processing
      setProcessing(true)
      setApplicationId(`APP${Date.now()}`)

      const steps = ["Application Received", "Document Verification", "Credit Assessment", "Final Approval"]
      let stepIndex = 0

      const processSteps = () => {
        if (stepIndex < steps.length) {
          setProcessingStep(stepIndex)
          stepIndex++
          setTimeout(processSteps, 2000)
        } else {
          // Complete application
          const currentUser = JSON.parse(localStorage.getItem("moneymax_current_user") || "{}")

          // Update user balance
          currentUser.availableBalance += loanAmount[0]

          // Add loan record
          const newLoan = {
            id: applicationId,
            amount: loanAmount[0],
            duration: duration[0],
            monthlyPayment: loanCalc.monthlyPayment,
            totalRepayment: loanCalc.totalRepayment,
            interestRate: 4,
            startDate: new Date().toISOString(),
            dueDate: new Date(Date.now() + duration[0] * 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: "Active",
            remainingBalance: loanCalc.totalRepayment,
          }

          currentUser.loans = currentUser.loans || []
          currentUser.loans.push(newLoan)

          // Add transaction
          const transaction = {
            id: Date.now().toString(),
            type: "Loan Approved",
            amount: loanAmount[0],
            date: new Date().toISOString(),
            status: "Completed",
            reference: applicationId,
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

          // Set 24-hour restriction
          localStorage.setItem(`last_loan_${currentUser.id}`, new Date().toISOString())

          setCurrentStep(3)
        }
      }

      processSteps()
    }
  }

  if (!canApply) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <CardTitle className="text-2xl text-yellow-600">Please wait 24 hours before applying again</CardTitle>
              <CardDescription>
                You can apply for another loan in: <strong>{formatTime(timeRemaining)}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button>Return to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>

        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Loan Calculator</CardTitle>
              <CardDescription>Calculate your loan terms and monthly payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label className="text-lg font-semibold">Loan Amount</Label>
                    <div className="mt-2">
                      <Slider
                        value={loanAmount}
                        onValueChange={setLoanAmount}
                        max={1000000}
                        min={20000}
                        step={5000}
                        className="mb-4"
                      />
                      <Input
                        type="number"
                        value={loanAmount[0]}
                        onChange={(e) => setLoanAmount([Number.parseInt(e.target.value) || 20000])}
                        min={20000}
                        max={1000000}
                        className="text-lg"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">₱20,000 - ₱1,000,000</p>
                  </div>
                  <div>
                    <Label className="text-lg font-semibold">Duration (Months)</Label>
                    <div className="mt-2">
                      <Slider value={duration} onValueChange={setDuration} max={60} min={3} step={1} className="mb-4" />
                      <Input
                        type="number"
                        value={duration[0]}
                        onChange={(e) => setDuration([Number.parseInt(e.target.value) || 3])}
                        min={3}
                        max={60}
                        className="text-lg"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">3 - 60 months</p>
                  </div>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-xl font-bold mb-4">Loan Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Loan Amount:</span>
                      <span className="font-bold">₱{loanAmount[0].toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Loan Duration:</span>
                      <span className="font-bold">{duration[0]} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Payment:</span>
                      <span className="font-bold">₱{loanCalc.monthlyPayment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Interest:</span>
                      <span className="font-bold">₱{loanCalc.totalInterest.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Repayment:</span>
                      <span className="font-bold text-blue-600">₱{loanCalc.totalRepayment.toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span>Interest Rate:</span>
                        <span className="font-bold">4% (fixed)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Start Date:</span>
                        <span className="font-bold">{new Date().toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Due Date:</span>
                        <span className="font-bold">
                          {new Date(Date.now() + duration[0] * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Button onClick={handleStepSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
                  Continue to Application
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && !processing && (
          <Card>
            <CardHeader>
              <CardTitle>Application Form</CardTitle>
              <CardDescription>Please provide your information to complete your loan application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="purpose">Loan Purpose *</Label>
                  <Input
                    id="purpose"
                    value={applicationData.purpose}
                    onChange={(e) => setApplicationData((prev) => ({ ...prev, purpose: e.target.value }))}
                    placeholder="e.g., Business expansion, Home improvement, Education"
                    className={errors.purpose ? "border-red-500" : ""}
                    required
                  />
                  {errors.purpose && <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>}
                </div>
                <div>
                  <Label htmlFor="employment">Employment Status *</Label>
                  <Input
                    id="employment"
                    value={applicationData.employment}
                    onChange={(e) => setApplicationData((prev) => ({ ...prev, employment: e.target.value }))}
                    placeholder="e.g., Employed, Self-employed, Business owner"
                    className={errors.employment ? "border-red-500" : ""}
                    required
                  />
                  {errors.employment && <p className="text-red-500 text-sm mt-1">{errors.employment}</p>}
                </div>
                <div>
                  <Label htmlFor="monthlyIncome">Monthly Income (₱) *</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    value={applicationData.monthlyIncome}
                    onChange={(e) => setApplicationData((prev) => ({ ...prev, monthlyIncome: e.target.value }))}
                    placeholder="Enter your monthly income"
                    className={errors.monthlyIncome ? "border-red-500" : ""}
                    required
                  />
                  {errors.monthlyIncome && <p className="text-red-500 text-sm mt-1">{errors.monthlyIncome}</p>}
                </div>
                <div>
                  <Label htmlFor="address">Complete Address *</Label>
                  <Input
                    id="address"
                    value={applicationData.address}
                    onChange={(e) => setApplicationData((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter your complete address (street, city, province)"
                    className={errors.address ? "border-red-500" : ""}
                    required
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  <p className="text-sm text-gray-600 mt-1">Please provide a complete address</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> All fields marked with * are required. Please ensure all information is
                  accurate as it will be used for loan processing and verification.
                </p>
              </div>

              <div className="mt-8">
                <Button
                  onClick={handleStepSubmit}
                  disabled={!isFormComplete()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Submit Application
                </Button>
                {!isFormComplete() && (
                  <p className="text-red-500 text-sm mt-2 text-center">
                    Please fill in all required fields to submit your application
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {processing && (
          <Card>
            <CardHeader>
              <CardTitle>Processing Your Application</CardTitle>
              <CardDescription>Please wait while we process your loan application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  {["Application Received", "Document Verification", "Credit Assessment", "Final Approval"].map(
                    (step, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            index <= processingStep ? "bg-green-500 text-white" : "bg-gray-200"
                          }`}
                        >
                          {index <= processingStep ? <CheckCircle className="w-5 h-5" /> : <span>{index + 1}</span>}
                        </div>
                        <p className="text-sm mt-2 text-center">{step}</p>
                      </div>
                    ),
                  )}
                </div>
                <Progress value={(processingStep + 1) * 25} className="w-full" />

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Application Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Application ID: {applicationId}</div>
                    <div>Amount: ₱{loanAmount[0].toLocaleString()}</div>
                    <div>Term: {duration[0]} months</div>
                    <div>Monthly Payment: ₱{loanCalc.monthlyPayment.toLocaleString()}</div>
                    <div>Purpose: {applicationData.purpose}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">Loan Approved!</CardTitle>
              <CardDescription>Your loan has been successfully processed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h4 className="text-xl font-bold mb-4">Loan Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Application ID</p>
                    <p className="font-bold">{applicationId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Loan Amount</p>
                    <p className="font-bold">₱{loanAmount[0].toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-bold">{duration[0]} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Interest Rate</p>
                    <p className="font-bold">4%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Monthly Payment</p>
                    <p className="font-bold">₱{loanCalc.monthlyPayment.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Repayment</p>
                    <p className="font-bold">₱{loanCalc.totalRepayment.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-bold">{new Date().toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Due Date</p>
                    <p className="font-bold">
                      {new Date(Date.now() + duration[0] * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">Reference Code</p>
                  <p className="font-bold text-lg">{applicationId}</p>
                </div>
              </div>
              <Link href="/dashboard">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Return to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
