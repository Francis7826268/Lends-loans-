"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Settings, Bell, Shield, Eye, Smartphone } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(true)
  const [biometric, setBiometric] = useState(false)
  const [autoLock, setAutoLock] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <Settings className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle>Settings</CardTitle>
            <CardDescription>Manage your account preferences and security</CardDescription>
          </CardHeader>
        </Card>

        {/* Notifications */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </CardTitle>
            <CardDescription>Control how you receive updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-gray-500">Receive app notifications</p>
              </div>
              <Switch id="push-notifications" checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-alerts">SMS Alerts</Label>
                <p className="text-sm text-gray-500">Get SMS for important updates</p>
              </div>
              <Switch id="sms-alerts" checked={smsAlerts} onCheckedChange={setSmsAlerts} />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security
            </CardTitle>
            <CardDescription>Protect your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="biometric">Biometric Login</Label>
                <p className="text-sm text-gray-500">Use fingerprint or face ID</p>
              </div>
              <Switch id="biometric" checked={biometric} onCheckedChange={setBiometric} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-lock">Auto Lock</Label>
                <p className="text-sm text-gray-500">Lock app when inactive</p>
              </div>
              <Switch id="auto-lock" checked={autoLock} onCheckedChange={setAutoLock} />
            </div>

            <Button variant="outline" className="w-full bg-transparent">
              <Shield className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              Privacy Policy
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              Terms of Service
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              Data Usage
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="h-5 w-5 mr-2" />
              App Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Build</span>
              <span className="font-medium">2024.01.15</span>
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              Check for Updates
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
