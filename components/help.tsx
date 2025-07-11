"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, HelpCircle, Mail, FileText, Shield } from "lucide-react"
import Link from "next/link"

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "How do I create an account?",
        answer:
          "Click 'Create Account' on the homepage, fill in your details including full name, email, 11-digit phone number, and create an 11-character password. Your phone number will serve as your Account ID.",
      },
      {
        question: "What documents do I need?",
        answer:
          "You need a valid government ID, proof of income, and proof of address. All documents can be uploaded during the application process.",
      },
      {
        question: "How long does approval take?",
        answer:
          "Our approval process typically takes just a few minutes. You'll see real-time progress through our 4-step verification: Application Received → Document Verification → Credit Assessment → Final Approval.",
      },
    ],
  },
  {
    category: "Loans",
    questions: [
      {
        question: "What are the loan terms?",
        answer:
          "We offer loans from ₱10,000 to ₱1,000,000 with terms from 3 to 60 months at a fixed 4% annual interest rate.",
      },
      {
        question: "How often can I apply for a loan?",
        answer:
          "You can apply for a new loan once every 24 hours. If you try to apply sooner, you'll see a countdown timer showing when you can apply again.",
      },
      {
        question: "How do I repay my loan?",
        answer:
          "Go to 'Repay Loan' from your dashboard, select your loan, choose to repay all or a specific amount, and complete the OTP verification process.",
      },
    ],
  },
  {
    category: "Transfers & Payments",
    questions: [
      {
        question: "How do I transfer funds?",
        answer:
          "Use the 'Transfer Funds' feature from your dashboard. Select Bank or GCash, enter recipient details, amount, and verify with OTP. Transfer fee is ₱15.",
      },
      {
        question: "What is OTP and how do I get it?",
        answer:
          "OTP (One-Time Password) is a 6-digit security code required for transactions. Click 'Get OTP' during any transaction - this costs ₱1,500 per request.",
      },
      {
        question: "OTP not received - what should I do?",
        answer:
          "To receive an OTP, you must click on the 'Get OTP' button which will open our secure verification portal. Make sure you have a stable internet connection and try again.",
      },
    ],
  },
  {
    category: "Account & Security",
    questions: [
      {
        question: "How do I change my password?",
        answer:
          "Go to Settings → Security, enter your current password, then create a new 11-character password containing only letters and digits.",
      },
      {
        question: "Is my information secure?",
        answer:
          "Yes, we use bank-level encryption and security measures to protect your personal and financial information. All transactions require OTP verification.",
      },
      {
        question: "How do I update my profile?",
        answer:
          "Visit Settings → Account Settings to update your name, email, and phone number. Changes are saved immediately.",
      },
    ],
  },
]

const troubleshootingGuides = [
  {
    title: "OTP Issues",
    description: "Common OTP-related problems and solutions",
    steps: [
      "Ensure you click the 'Get OTP' button to open the verification portal",
      "Check your internet connection",
      "Wait for the OTP to be generated (may take a few moments)",
      "Enter the 6-digit code exactly as received",
      "Contact support if issues persist",
    ],
  },
  {
    title: "Login Problems",
    description: "Can't access your account?",
    steps: [
      "Verify your email address is correct",
      "Ensure your password is exactly 11 characters",
      "Check if Caps Lock is on",
      "Clear your browser cache and cookies",
      "Try using a different browser",
    ],
  },
  {
    title: "Transfer Failures",
    description: "Transfer not going through?",
    steps: [
      "Check your available balance (including ₱15 transfer fee)",
      "Verify recipient account details are correct",
      "Ensure you have a valid OTP code",
      "Check your internet connection",
      "Try the transaction again",
    ],
  },
]

export function Help() {
  const [searchTerm, setSearchTerm] = useState("")
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)

  const filteredFAQs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>

        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Help & Support</h1>
          <p className="text-gray-600">Find answers to common questions and get support</p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for help..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* FAQs */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Find quick answers to common questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filteredFAQs.map((category, categoryIndex) => (
                    <div key={categoryIndex}>
                      <h3 className="font-semibold text-lg mb-4 text-blue-600">{category.category}</h3>
                      <div className="space-y-2">
                        {category.questions.map((faq, faqIndex) => (
                          <Collapsible key={`${categoryIndex}-${faqIndex}`}>
                            <CollapsibleTrigger>
                              <Button
                                variant="ghost"
                                className="w-full justify-between text-left p-4 h-auto bg-transparent hover:bg-gray-50"
                                onClick={() =>
                                  setOpenFAQ(
                                    openFAQ === `${categoryIndex}-${faqIndex}` ? null : `${categoryIndex}-${faqIndex}`,
                                  )
                                }
                              >
                                <span className="font-medium">{faq.question}</span>
                                <ChevronDown
                                  className={`w-4 h-4 transition-transform ${openFAQ === `${categoryIndex}-${faqIndex}` ? "rotate-180" : ""}`}
                                />
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-4 pb-4">
                              <p className="text-gray-600 text-sm">{faq.answer}</p>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Troubleshooting Guides */}
            <Card>
              <CardHeader>
                <CardTitle>Troubleshooting Guides</CardTitle>
                <CardDescription>Step-by-step solutions for common issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {troubleshootingGuides.map((guide, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">{guide.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{guide.description}</p>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        {guide.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="text-gray-700">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Us */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>Contact Us</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Email Support</h4>
                  <a href="mailto:moneymax016@gmail.com" className="text-blue-600 hover:underline text-sm">
                    moneymax016@gmail.com
                  </a>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Response Time</h4>
                  <p className="text-sm text-gray-600">We typically respond within 24 hours</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Legal & Policies</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/terms" className="block text-sm text-blue-600 hover:underline">
                  Terms and Conditions
                </Link>
                <Link href="/privacy" className="block text-sm text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
                <Link href="/disclaimer" className="block text-sm text-blue-600 hover:underline">
                  Disclaimer
                </Link>
              </CardContent>
            </Card>

            {/* Glossary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Glossary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>OTP:</strong> One-Time Password - A 6-digit security code for transactions
                </div>
                <div>
                  <strong>Account ID:</strong> Your 11-digit phone number used for identification
                </div>
                <div>
                  <strong>APR:</strong> Annual Percentage Rate - The yearly interest rate (4% fixed)
                </div>
                <div>
                  <strong>Principal:</strong> The original loan amount borrowed
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
