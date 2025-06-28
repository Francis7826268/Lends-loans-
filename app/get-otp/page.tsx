"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, ExternalLink, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function GetOtpPage() {
  const handleGetOtp = () => {
    window.open("https://www.facebook.com/profile.php?id=61577793063769", "_blank")
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

        <Card>
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle>Get OTP Code</CardTitle>
            <CardDescription>Request a one-time password for secure transactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-800">Important Notice</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Each OTP request costs ₱1,500. Only use this service when you need to complete a transaction.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Secure OTP System:</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Enhanced Security</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your OTP codes are now generated securely and validated through our encrypted system. No codes are
                      displayed for security purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Click the button below to request your OTP code through our secure channel.
              </p>

              <Button onClick={handleGetOtp} className="w-full" size="lg">
                <ExternalLink className="h-4 w-4 mr-2" />
                Get OTP Code
              </Button>

              <p className="text-xs text-gray-500">
                This will open our secure Facebook page where you can request your OTP.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">How to use OTP:</h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Click "Get OTP Code" to visit our secure page</li>
                <li>2. Request your OTP through the official channel</li>
                <li>3. Use the provided 6-digit code in your transaction</li>
                <li>4. Complete your transfer, repayment, or bill payment</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
