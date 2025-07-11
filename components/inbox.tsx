"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { InboxIcon, Mail, Search, Trash2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Inbox() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [filteredMessages, setFilteredMessages] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<any>(null)

  useEffect(() => {
    const currentUser = localStorage.getItem("moneymax_current_user")
    if (!currentUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Load messages from localStorage
    const inboxMessages = JSON.parse(localStorage.getItem("moneymax_inbox") || "[]")

    // Add system messages based on user activity
    const systemMessages = generateSystemMessages(userData)
    const allMessages = [...inboxMessages, ...systemMessages].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )

    setMessages(allMessages)
    setFilteredMessages(allMessages)
  }, [router])

  useEffect(() => {
    if (searchTerm) {
      const filtered = messages.filter(
        (message) =>
          message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.message.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredMessages(filtered)
    } else {
      setFilteredMessages(messages)
    }
  }, [searchTerm, messages])

  const generateSystemMessages = (userData: any) => {
    const systemMessages = []
    const loans = userData.loans || []
    const transactions = userData.transactions || []

    // Loan status updates
    loans.forEach((loan: any) => {
      systemMessages.push({
        id: `loan-${loan.id}`,
        title: "Loan Approved",
        message: `Your loan application #${loan.id} for ₱${loan.amount.toLocaleString()} has been approved and funds have been added to your account.`,
        date: loan.startDate,
        read: false,
        type: "loan",
      })
    })

    // Payment confirmations
    transactions.forEach((transaction: any) => {
      if (transaction.type === "Fund Transfer") {
        systemMessages.push({
          id: `transfer-${transaction.id}`,
          title: "Transfer Completed",
          message: `Your transfer of ₱${transaction.amount.toLocaleString()} to ${transaction.accountName} has been completed successfully.`,
          date: transaction.date,
          read: false,
          type: "transfer",
        })
      } else if (transaction.type === "Loan Repayment") {
        systemMessages.push({
          id: `repayment-${transaction.id}`,
          title: "Payment Received",
          message: `Your loan repayment of ₱${transaction.amount.toLocaleString()} has been processed successfully.`,
          date: transaction.date,
          read: false,
          type: "payment",
        })
      } else if (transaction.type === "Bill Payment") {
        systemMessages.push({
          id: `bill-${transaction.id}`,
          title: "Bill Payment Successful",
          message: `Your bill payment of ₱${transaction.amount.toLocaleString()} to ${transaction.billerName} has been processed.`,
          date: transaction.date,
          read: false,
          type: "bill",
        })
      }
    })

    return systemMessages
  }

  const markAsRead = (messageId: string) => {
    const updatedMessages = messages.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg))
    setMessages(updatedMessages)
    setFilteredMessages(
      updatedMessages.filter(
        (msg) =>
          !searchTerm ||
          msg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.message.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    )
  }

  const deleteMessage = (messageId: string) => {
    const updatedMessages = messages.filter((msg) => msg.id !== messageId)
    setMessages(updatedMessages)
    setFilteredMessages(
      updatedMessages.filter(
        (msg) =>
          !searchTerm ||
          msg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.message.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    )
    setSelectedMessage(null)
  }

  const getMessageIcon = (type: string) => {
    switch (type) {
      case "loan":
        return "💰"
      case "transfer":
        return "📤"
      case "payment":
        return "💳"
      case "bill":
        return "🧾"
      default:
        return "📧"
    }
  }

  const unreadCount = messages.filter((msg) => !msg.read).length

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Inbox</h1>
          <p className="text-gray-600">Messages and notifications {unreadCount > 0 && `(${unreadCount} unread)`}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search */}
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Messages */}
            <div className="space-y-2">
              {filteredMessages.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <InboxIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-medium text-gray-900 mb-2">No messages found</h3>
                    <p className="text-sm text-gray-600">
                      {messages.length === 0
                        ? "You don't have any messages yet."
                        : "Try adjusting your search criteria."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredMessages.map((message, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedMessage?.id === message.id ? "ring-2 ring-blue-500" : ""
                    } ${!message.read ? "bg-blue-50 border-blue-200" : ""}`}
                    onClick={() => {
                      setSelectedMessage(message)
                      if (!message.read) {
                        markAsRead(message.id)
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="text-xl">{getMessageIcon(message.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-sm font-medium truncate ${!message.read ? "font-bold" : ""}`}>
                              {message.title}
                            </h4>
                            {!message.read && <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>}
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2">{message.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{new Date(message.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getMessageIcon(selectedMessage.type)}</div>
                      <div>
                        <CardTitle>{selectedMessage.title}</CardTitle>
                        <CardDescription>
                          {new Date(selectedMessage.date).toLocaleDateString()} at{" "}
                          {new Date(selectedMessage.date).toLocaleTimeString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!selectedMessage.read && <Badge className="bg-blue-500">New</Badge>}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMessage(selectedMessage.id)}
                        className="bg-transparent"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">{selectedMessage.message}</p>
                  </div>

                  {selectedMessage.type === "loan" && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800">Loan Approved</span>
                      </div>
                      <p className="text-sm text-green-700">
                        Your funds are now available in your account. You can start using them immediately.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a message</h3>
                  <p className="text-gray-600">Choose a message from the list to view its contents</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
