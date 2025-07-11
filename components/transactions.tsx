"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Search, Download } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Transactions() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    const currentUser = localStorage.getItem("moneymax_current_user")
    if (!currentUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    const userTransactions = userData.transactions || []
    setTransactions(userTransactions.reverse()) // Show newest first
    setFilteredTransactions(userTransactions)
  }, [router])

  useEffect(() => {
    let filtered = transactions

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.billerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.bankName?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((transaction) => transaction.type === filterType)
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((transaction) => transaction.status === filterStatus)
    }

    setFilteredTransactions(filtered)
  }, [searchTerm, filterType, filterStatus, transactions])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500"
      case "Pending":
        return "bg-yellow-500"
      case "Failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Loan Approved":
        return "💰"
      case "Fund Transfer":
        return "📤"
      case "Loan Repayment":
        return "💳"
      case "Bill Payment":
        return "🧾"
      default:
        return "📄"
    }
  }

  const exportTransactions = () => {
    const csvContent = [
      ["Date", "Type", "Amount", "Status", "Reference", "Details"].join(","),
      ...filteredTransactions.map((transaction) =>
        [
          new Date(transaction.date).toLocaleDateString(),
          transaction.type,
          transaction.amount,
          transaction.status,
          transaction.reference || "",
          transaction.billerName || transaction.bankName || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `moneymax-transactions-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20 md:pb-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Transaction History</h1>
          <p className="text-gray-600">View and manage all your financial transactions</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Loan Approved">Loan Approved</SelectItem>
                  <SelectItem value="Fund Transfer">Fund Transfer</SelectItem>
                  <SelectItem value="Loan Repayment">Loan Repayment</SelectItem>
                  <SelectItem value="Bill Payment">Bill Payment</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportTransactions} variant="outline" className="bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold">{transactions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">₱</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Inflow</p>
                  <p className="text-2xl font-bold">
                    ₱
                    {transactions
                      .filter((t) => t.type === "Loan Approved")
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 font-bold">₱</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Outflow</p>
                  <p className="text-2xl font-bold">
                    ₱
                    {transactions
                      .filter((t) => t.type !== "Loan Approved")
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>
              {filteredTransactions.length} of {transactions.length} transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                <p className="text-gray-600">
                  {transactions.length === 0
                    ? "You haven't made any transactions yet."
                    : "Try adjusting your search or filter criteria."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((transaction, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{getTypeIcon(transaction.type)}</div>
                        <div>
                          <h4 className="font-medium">{transaction.type}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>{new Date(transaction.date).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{new Date(transaction.date).toLocaleTimeString()}</span>
                            {transaction.reference && (
                              <>
                                <span>•</span>
                                <span className="font-mono">{transaction.reference}</span>
                              </>
                            )}
                          </div>
                          {(transaction.billerName || transaction.bankName) && (
                            <p className="text-sm text-gray-600 mt-1">
                              {transaction.billerName || transaction.bankName}
                              {transaction.accountNumber && ` - ${transaction.accountNumber}`}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-3">
                          <div>
                            <p
                              className={`text-lg font-bold ${
                                transaction.type === "Loan Approved" ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {transaction.type === "Loan Approved" ? "+" : "-"}₱{transaction.amount.toLocaleString()}
                            </p>
                            {transaction.fee && <p className="text-sm text-gray-600">Fee: ₱{transaction.fee}</p>}
                          </div>
                          <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
