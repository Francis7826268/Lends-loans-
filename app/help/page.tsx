"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, HelpCircle, Phone, Mail, MessageCircle, FileText } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I apply for a loan?",
      answer:
        "Go to the dashboard and click 'Apply for Loan'. Fill out the calculator, complete the application form, and wait for approval.",
    },
    {
      question: "What are the interest rates?",
      answer: "MoneyMax offers competitive rates starting at 4% annual interest rate for qualified borrowers.",
    },
    {
      question: "How long does approval take?",
      answer:
        "Most applications are approved within minutes. You'll see real-time processing updates during your application.",
    },
    {
      question: "What payment methods are accepted?",
      answer: "We support bank transfers and GCash for both receiving funds and making repayments.",
    },
    {
      question: "How do I get an OTP code?",
      answer:
        "Click 'Get OTP' in any transaction screen. This will direct you to our secure channel where you can request your code.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <HelpCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle>Help & Support</CardTitle>
            <CardDescription>Get answers to your questions</CardDescription>
          </CardHeader>
        </Card>

        {/* Contact Options */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>Reach out for immediate assistance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Phone className="h-4 w-4 mr-2" />
              Call Support: +63 917 123 4567
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Mail className="h-4 w-4 mr-2" />
              Email: support@moneymax.ph
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <MessageCircle className="h-4 w-4 mr-2" />
              Live Chat (9AM - 6PM)
            </Button>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <FileText className="h-4 w-4 mr-2" />
              User Guide
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <FileText className="h-4 w-4 mr-2" />
              Terms & Conditions
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <FileText className="h-4 w-4 mr-2" />
              Privacy Policy
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
