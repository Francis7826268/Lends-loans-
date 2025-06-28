"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, TrendingUp, TrendingDown, Receipt, RefreshCw, Send } from "lucide-react"
import Link from "next/link"

interface Transaction {
  id: string
  date: string
  type: string
  status: string
  amount: number
  description: string
  reference: string
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("moneymax_user") || "{}")
    const allTransactions = JSON.parse(localStorage.getItem("moneymax_transactions") || "[]")

    // Filter transactions for current user
    const userTransactions = allTransactions.filter(
      (transaction: any) => transaction.userId === userData.email || !transaction.userId, // Include legacy transactions without userId
    )

    setTransactions(userTransactions)
  }, [])

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "Loan":
        return <TrendingUp className="h-5 w-5 text-green-600" />
      case "Transfer":
        return <Send className="h-5 w-5 text-blue-600" />
      case "Repayment":
        return <RefreshCw className="h-5 w-5 text-orange-600" />
      case "Bill Payment":
        return <Receipt className="h-5 w-5 text-purple-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const BottomNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <Link href="/dashboard" className="flex flex-col items-center p-2 text-gray-500">
          <TrendingUp className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/inbox" className="flex flex-col items-center p-2 text-gray-500">
          <FileText className="h-5 w-5" />
          <span className="text-xs mt-1">Inbox</span>
        </Link>
        <div className="flex flex-col items-center p-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">MM</span>
          </div>
        </div>
        <button className="flex flex-col items-center p-2 text-blue-600">
          <FileText className="h-5 w-5" />
          <span className="text-xs mt-1">Transactions</span>
        </button>
        <Link href="/profile" className="flex flex-col items-center p-2 text-gray-500">
          <TrendingDown className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold">Transactions</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        {transactions.length === 0 ? (
          <Card>
            <CardHeader className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <CardTitle className="text-gray-600">No Transactions Yet</CardTitle>
              <CardDescription>
                Your transaction history will appear here once you start using MoneyMax services.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Your recent financial activities</CardDescription>
              </CardHeader>
            </Card>

            {transactions.map((transaction) => (
              <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium text-sm">{transaction.type}</p>
                        <p className="text-xs text-gray-500">{transaction.description}</p>
                        <p className="text-xs text-gray-400">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold text-lg ${
                          transaction.type === "Loan" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.type === "Loan" ? "+" : "-"}₱{transaction.amount.toLocaleString()}
                      </p>
                      <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>{transaction.status}</Badge>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Reference: {transaction.reference}</span>
                      <span>ID: {transaction.id}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}
