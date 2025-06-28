"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Inbox, CheckCircle, Bell, User, FileText, Calendar } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  title: string
  content: string
  date: string
  type: "welcome" | "loan" | "payment" | "notification"
  read: boolean
}

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    // Load messages from localStorage or create default welcome message
    const storedMessages = localStorage.getItem("moneymax_messages")
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages))
    } else {
      const defaultMessages: Message[] = [
        {
          id: "welcome_001",
          title: "Welcome to MoneyMax!",
          content:
            "Your account was successfully created. You can now apply for loans, transfer funds, and manage your finances with ease.",
          date: new Date().toLocaleDateString(),
          type: "welcome",
          read: false,
        },
      ]
      setMessages(defaultMessages)
      localStorage.setItem("moneymax_messages", JSON.stringify(defaultMessages))
    }
  }, [])

  const getMessageIcon = (type: string) => {
    switch (type) {
      case "welcome":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "loan":
        return <FileText className="h-5 w-5 text-blue-600" />
      case "payment":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "notification":
        return <Bell className="h-5 w-5 text-orange-600" />
      default:
        return <Inbox className="h-5 w-5 text-gray-600" />
    }
  }

  const markAsRead = (messageId: string) => {
    const updatedMessages = messages.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg))
    setMessages(updatedMessages)
    localStorage.setItem("moneymax_messages", JSON.stringify(updatedMessages))
  }

  const BottomNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <Link href="/dashboard" className="flex flex-col items-center p-2 text-gray-500">
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <button className="flex flex-col items-center p-2 text-blue-600">
          <Inbox className="h-5 w-5" />
          <span className="text-xs mt-1">Inbox</span>
        </button>
        <div className="flex flex-col items-center p-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">MM</span>
          </div>
        </div>
        <Link href="/transactions" className="flex flex-col items-center p-2 text-gray-500">
          <FileText className="h-5 w-5" />
          <span className="text-xs mt-1">Transactions</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center p-2 text-gray-500">
          <User className="h-5 w-5" />
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
              <Inbox className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold">Inbox</h1>
            </div>
            {messages.filter((msg) => !msg.read).length > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {messages.filter((msg) => !msg.read).length}
              </Badge>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        {messages.length === 0 ? (
          <Card>
            <CardHeader className="text-center">
              <Inbox className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <CardTitle className="text-gray-600">No Messages</CardTitle>
              <CardDescription>Your notifications and updates will appear here.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Messages & Notifications</CardTitle>
                <CardDescription>Stay updated with your MoneyMax activities</CardDescription>
              </CardHeader>
            </Card>

            {messages.map((message) => (
              <Card
                key={message.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  !message.read ? "border-blue-200 bg-blue-50" : ""
                }`}
                onClick={() => markAsRead(message.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    {getMessageIcon(message.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-medium ${!message.read ? "font-bold" : ""}`}>{message.title}</h3>
                        {!message.read && (
                          <Badge variant="secondary" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{message.content}</p>
                      <div className="flex items-center text-xs text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {message.date}
                      </div>
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
