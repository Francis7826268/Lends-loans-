"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Star, CheckCircle, Clock, CreditCard, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function LandingPage() {
  const [loanAmount, setLoanAmount] = useState([100000])
  const [duration, setDuration] = useState("12")

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">MM</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">MoneyMax</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Create Account</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Need Fast Cash? MoneyMax Gets You Funded in Minutes!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Quick, reliable money advances for Filipinos. Get approved fast and transfer to your bank or GCash.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Apply Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView()}
            >
              How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Apply in Minutes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Quick and easy application process. Fill out your details and get instant pre-approval.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Get Approved Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our automated system reviews your application and provides instant approval decisions.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Transfer to Bank/GCash</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Receive your funds directly to your bank account or GCash wallet within minutes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Loan Calculator */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Loan Calculator</h2>
          <Card className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Loan Amount</Label>
                  <div className="mt-2">
                    <Slider
                      value={loanAmount}
                      onValueChange={setLoanAmount}
                      max={1000000}
                      min={10000}
                      step={5000}
                      className="mb-4"
                    />
                    <Input
                      type="number"
                      value={loanAmount[0]}
                      onChange={(e) => setLoanAmount([Number.parseInt(e.target.value) || 10000])}
                      min={10000}
                      max={1000000}
                      className="text-lg"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">₱{loanAmount[0].toLocaleString()}</p>
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
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monthly Payment</span>
                    <span className="text-2xl font-bold text-blue-600">₱{loan.monthlyPayment.toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Interest</span>
                    <span className="text-lg font-semibold">₱{loan.totalInterest.toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Repayment</span>
                    <span className="text-lg font-semibold">₱{loan.totalRepayment.toLocaleString()}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="w-full justify-center py-2">
                  Interest Rate: 4% Annual
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-pink-600">VS</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Vanessa Sanchez</CardTitle>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  "MoneyMax saved me during an emergency. The application was so easy and I got my money in just 15
                  minutes!"
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-blue-600">MD</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Morgan K. Divina</CardTitle>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  "Fast, reliable, and transparent. No hidden fees and the interest rates are very reasonable. Highly
                  recommended!"
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-green-600">GC</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Gabriel A. Christopher</CardTitle>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  "The customer service is excellent and the whole process is very professional. MoneyMax is definitely
                  trustworthy."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">MM</span>
            </div>
            <span className="text-2xl font-bold">MoneyMax</span>
          </div>
          <p className="text-gray-400 mb-8">
            Money Advance Xchange - Your trusted financial partner in the Philippines
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
