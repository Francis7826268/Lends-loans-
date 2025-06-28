"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Shield, CheckCircle, X } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function VerifyOtpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get("returnUrl") || "/dashboard"
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  // Update the validOtps array to use the new secure codes
  const validOtps = [
    "356667",
    "887555",
    "246789",
    "790986",
    "566447",
    "378899",
    "145667",
    "899976",
    "356788",
    "468999",
    "087644",
    "356888",
    "357886",
  ]

  const handleVerifyOtp = () => {
    if (!otp) {
      setError("Please enter OTP code")
      return
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits")
      return
    }

    setIsVerifying(true)

    setTimeout(() => {
      if (validOtps.includes(otp)) {
        // Store OTP verification status
        localStorage.setItem("otp_verified", "true")
        localStorage.setItem("otp_timestamp", Date.now().toString())

        // Redirect to return URL
        router.push(returnUrl)
      } else {
        setError("❌ Invalid OTP. Please check your code and try again.")
        setIsVerifying(false)
      }
    }, 1500)
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
            <CardTitle>Verify OTP</CardTitle>
            <CardDescription>Enter the 6-digit code to verify your identity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Enter 6-Digit OTP</Label>
              <Input
                type="text"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  setError("")
                }}
                placeholder="000000"
                maxLength={6}
                className="text-center text-2xl tracking-widest font-mono"
                disabled={isVerifying}
              />
              {error && (
                <Alert variant="destructive">
                  <X className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Remove the visible OTP codes section and replace with: */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Secure Verification:</h4>
              <p className="text-sm text-blue-700">
                Enter the 6-digit OTP code you received through our secure channel. For security purposes, valid codes
                are not displayed.
              </p>
            </div>

            <Button onClick={handleVerifyOtp} className="w-full" disabled={!otp || isVerifying}>
              {isVerifying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify OTP
                </>
              )}
            </Button>

            <div className="text-center">
              <Link href="/get-otp" className="text-sm text-blue-600 hover:text-blue-700">
                Need a new OTP code?
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
