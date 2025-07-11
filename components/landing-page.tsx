"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, Clock, Star, Users, Zap } from "lucide-react"
import Link from "next/link"

export function LandingPage() {
  const [loanAmount, setLoanAmount] = useState([100000])
  const [duration, setDuration] = useState([12])

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

  const testimonials = [
    {
      name: "Maria Santos",
      rating: 5,
      quote: "MoneyMax made getting a loan incredibly fast and easy! Highly recommend for quick cash needs.",
    },
    {
      name: "Juan Dela Cruz",
      rating: 5,
      quote: "The transfer funds feature is seamless. My money arrived instantly, saving me so much hassle.",
    },
    {
      name: "Ana Reyes",
      rating: 5,
      quote: "Repaying my loan was straightforward. The app is intuitive and helps me stay on track with payments.",
    },
    {
      name: "Carlos Mendoza",
      rating: 5,
      quote: "Finally, a financial app that understands speed and simplicity! MoneyMax is a game-changer.",
    },
    {
      name: "Rosa Garcia",
      rating: 5,
      quote: "Their customer support is top-notch, and the bill payment function works flawlessly every time.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">MM</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MoneyMax</h1>
                <p className="text-sm text-gray-600">Your Partner for Swift Financial Solutions</p>
              </div>
            </div>
            <div className="flex space-x-3">
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
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Need Fast Cash?</h2>
          <p className="text-xl md:text-2xl text-blue-600 font-semibold mb-8">MoneyMax Gets You Funded in Minutes!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                Apply Now
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
              How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>Apply in Minutes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Quick and easy application process. Get started in just a few clicks.</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>Get Approved Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Fast approval process with instant decision on your loan application.</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle>Transfer to Bank/GCash</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Receive funds directly to your bank account or GCash wallet.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Loan Calculator */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Loan Calculator</h3>
          <Card className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <Label className="text-lg font-semibold">Loan Amount</Label>
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
                  <p className="text-sm text-gray-600 mt-1">₱10,000 - ₱1,000,000</p>
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
                    <p className="text-sm text-gray-600">Interest Rate: 4% (fixed)</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h3>
          <div className="grid md:grid-cols-5 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-600" />
                </div>
                <h4 className="font-semibold mb-2">{testimonial.name}</h4>
                <div className="flex justify-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 italic">"{testimonial.quote}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">MM</span>
            </div>
            <span className="text-xl font-bold">MoneyMax</span>
          </div>
          <p className="text-gray-400 mb-8">Your Partner for Swift Financial Solutions</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <Link href="/help" className="text-gray-400 hover:text-white">
              Help & Support
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white">
              Terms & Conditions
            </Link>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-400">© 2024 MoneyMax. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
