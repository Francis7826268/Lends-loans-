"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, Download, Share, Copy } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

interface TransferDetails {
  amount: string
  method: string
  bankName: string
  accountName: string
  accountNumber: string
  reference: string
  date: string
  time: string
  fee: number
  totalAmount: number
}

export default function TransferSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [transferDetails, setTransferDetails] = useState<TransferDetails | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Get transfer details from URL parameters
    const amount = searchParams.get("amount")
    const method = searchParams.get("method")
    const bankName = searchParams.get("bankName")
    const accountName = searchParams.get("accountName")
    const accountNumber = searchParams.get("accountNumber")
    const reference = searchParams.get("reference")

    if (amount && method && bankName && accountName && accountNumber && reference) {
      const details: TransferDetails = {
        amount,
        method,
        bankName,
        accountName,
        accountNumber,
        reference,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        fee: 15,
        totalAmount: Number.parseFloat(amount) + 15,
      }
      setTransferDetails(details)
    } else {
      // If no parameters, redirect to dashboard after a short delay
      const timer = setTimeout(() => {
        router.push("/dashboard")
      }, 100)

      return () => clearTimeout(timer)
    }
  }, []) // Empty dependency array since we only want this to run once

  const handleCopyReference = () => {
    if (transferDetails) {
      navigator.clipboard.writeText(transferDetails.reference)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownloadReceipt = () => {
    // In a real app, this would generate a PDF receipt
    alert("Receipt download feature will be available soon!")
  }

  const handleShareReceipt = async () => {
    if (transferDetails) {
      const shareData = {
        title: "MoneyMax Transfer Receipt",
        text: `Transfer successful! ₱${Number.parseFloat(transferDetails.amount).toLocaleString()} sent to ${
          transferDetails.accountName
        }. Reference: ${transferDetails.reference}`,
      }

      // Check if Web Share API is supported and available
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData)
        } catch (error) {
          // Handle user cancellation or permission denied
          if (error.name === "AbortError") {
            // User cancelled the share - do nothing
            return
          } else {
            // Permission denied or other error - fall back to copy
            handleCopyToClipboard(shareData.text)
          }
        }
      } else {
        // Web Share API not supported - fall back to copy
        handleCopyToClipboard(shareData.text)
      }
    }
  }

  const handleCopyToClipboard = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert("Receipt details copied to clipboard!")
        })
        .catch(() => {
          // Fallback for older browsers
          fallbackCopyTextToClipboard(text)
        })
    } else {
      // Fallback for older browsers
      fallbackCopyTextToClipboard(text)
    }
  }

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea")
    textArea.value = text
    textArea.style.top = "0"
    textArea.style.left = "0"
    textArea.style.position = "fixed"
    textArea.style.opacity = "0"

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      document.execCommand("copy")
      alert("Receipt details copied to clipboard!")
    } catch (err) {
      alert("Unable to share or copy receipt details")
    }

    document.body.removeChild(textArea)
  }

  if (!transferDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transfer details...</p>
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

        {/* Success Header */}
        <Card className="mb-6 bg-green-50 border-green-200">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <CardTitle className="text-2xl text-green-600">Transfer Successful! ✅</CardTitle>
            <CardDescription className="text-green-700">Your money has been sent successfully</CardDescription>
          </CardHeader>
        </Card>

        {/* Transfer Amount */}
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Amount Transferred</p>
            <p className="text-4xl font-bold text-blue-600">
              ₱{Number.parseFloat(transferDetails.amount).toLocaleString()}
            </p>
            <Badge variant="secondary" className="mt-2">
              + ₱{transferDetails.fee} transfer fee
            </Badge>
          </CardContent>
        </Card>

        {/* Transfer Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Transfer Details</CardTitle>
            <CardDescription>Complete transaction information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">{transferDetails.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-medium">{transferDetails.time}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Transfer Method</span>
                <span className="font-medium">{transferDetails.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bank Name</span>
                <span className="font-medium">{transferDetails.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Name</span>
                <span className="font-medium">{transferDetails.accountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Number</span>
                <span className="font-medium">{transferDetails.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transfer Amount</span>
                <span className="font-medium">₱{Number.parseFloat(transferDetails.amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transfer Fee</span>
                <span className="font-medium">₱{transferDetails.fee}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-600 font-medium">Total Amount</span>
                <span className="font-bold text-blue-600">₱{transferDetails.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reference Number */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Reference Number</CardTitle>
            <CardDescription>Save this for your records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-mono text-lg font-bold">{transferDetails.reference}</span>
              <Button onClick={handleCopyReference} variant="outline" size="sm">
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button onClick={handleDownloadReceipt} variant="outline" className="w-full bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
          <Button onClick={handleShareReceipt} variant="outline" className="w-full bg-transparent">
            <Share className="h-4 w-4 mr-2" />
            Share Receipt
          </Button>
          <Link href="/dashboard">
            <Button className="w-full">Return to Dashboard</Button>
          </Link>
        </div>

        {/* Important Notice */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-800 mb-2">Important Notice</h4>
            <p className="text-sm text-blue-700">
              Your transfer has been processed successfully. The recipient should receive the funds within 1-3 business
              days depending on the bank. Keep your reference number for tracking purposes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
