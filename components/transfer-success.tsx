"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Copy } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function TransferSuccess() {
  const router = useRouter()
  const [transferData, setTransferData] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem("transfer_success_data")
    if (!data) {
      router.push("/dashboard")
      return
    }
    setTransferData(JSON.parse(data))
  }, [router])

  const handleCopyReference = () => {
    if (transferData?.reference) {
      navigator.clipboard.writeText(transferData.reference)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!transferData) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">Transfer Successful!</h1>
          <p className="text-gray-600">Your money has been sent successfully</p>
        </div>

        {/* Amount Transferred Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">Amount Transferred</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">₱{transferData.amount.toLocaleString()}</div>
            <p className="text-gray-600">+ ₱{transferData.fee} transfer fee</p>
          </CardContent>
        </Card>

        {/* Transfer Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Transfer Details</CardTitle>
            <p className="text-sm text-gray-600">Complete transaction information</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Date</p>
                <p className="font-medium">{transferData.date}</p>
              </div>
              <div>
                <p className="text-gray-600">Time</p>
                <p className="font-medium">{transferData.time}</p>
              </div>
              <div>
                <p className="text-gray-600">Transfer Method</p>
                <p className="font-medium">{transferData.method}</p>
              </div>
              <div>
                <p className="text-gray-600">Bank Name</p>
                <p className="font-medium">{transferData.bankName}</p>
              </div>
              <div>
                <p className="text-gray-600">Account Name</p>
                <p className="font-medium">{transferData.accountName}</p>
              </div>
              <div>
                <p className="text-gray-600">Account Number</p>
                <p className="font-medium">{transferData.accountNumber}</p>
              </div>
              <div>
                <p className="text-gray-600">Transfer Amount</p>
                <p className="font-medium">₱{transferData.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Transfer Fee</p>
                <p className="font-medium">₱{transferData.fee}</p>
              </div>
              <div className="col-span-2 pt-2 border-t">
                <p className="text-gray-600">Total Amount</p>
                <p className="font-bold text-lg">₱{transferData.total.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reference Number */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Reference Number</CardTitle>
            <p className="text-sm text-gray-600">Save this for your records</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <span className="font-mono text-lg font-bold">{transferData.reference}</span>
              <Button variant="outline" size="sm" onClick={handleCopyReference} className="ml-4 bg-transparent">
                <Copy className="w-4 h-4 mr-2" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Link href="/dashboard">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
