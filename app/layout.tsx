import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MoneyMax - Fast Cash Advances for Filipinos",
  description: "Quick, reliable money advances for Filipinos. Get approved fast and transfer to your bank or GCash.",
  keywords: "money advance, loan, Philippines, cash advance, GCash, bank transfer",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
