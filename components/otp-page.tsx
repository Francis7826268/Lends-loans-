"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { Shield } from "lucide-react" // Declare the Shield variable

export function OTPPage() {
  const handleGetOTP = () => {
    window.open("https://www.facebook.com/share/1DLgUmQRWp/", "_blank")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Get OTP Code</CardTitle>
            <CardDescription>Generate secure OTP for transactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Official OTP Method */}
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">Official OTP Request</h3>
              <p className="text-blue-800 text-sm mb-4">
                Click the button below to request an official OTP code. This will open our secure verification portal.
              </p>
              <Button onClick={handleGetOTP} className="w-full bg-blue-600 hover:bg-blue-700">
                <ExternalLink className="w-4 h-4 mr-2" />
                Get Official OTP
              </Button>
              <p className="text-xs text-blue-700 mt-2 text-center">Cost: ₱1,500 per OTP request</p>
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">How to Use OTP</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Request an OTP code using the official method above</li>
                <li>Copy the 6-digit code you receive</li>
                <li>Enter the code when prompted during transactions</li>
                <li>Complete your transaction securely</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
