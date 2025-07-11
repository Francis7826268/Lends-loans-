"use client"

import { Home, Inbox, FileText, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/inbox", icon: Inbox, label: "Inbox" },
    { href: "/transactions", icon: FileText, label: "Transactions" },
    { href: "/profile", icon: User, label: "Profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-around items-center py-2">
        {/* Home */}
        <Link
          href="/dashboard"
          className={`flex flex-col items-center py-2 px-3 ${pathname === "/dashboard" ? "text-blue-600" : "text-gray-600"}`}
        >
          <Home className="w-5 h-5 mb-1" />
          <span className="text-xs">Home</span>
        </Link>

        {/* Inbox */}
        <Link
          href="/inbox"
          className={`flex flex-col items-center py-2 px-3 ${pathname === "/inbox" ? "text-blue-600" : "text-gray-600"}`}
        >
          <Inbox className="w-5 h-5 mb-1" />
          <span className="text-xs">Inbox</span>
        </Link>

        {/* MM Logo in center */}
        <div className="flex flex-col items-center py-2 px-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-1">
            <span className="text-white font-bold text-sm">MM</span>
          </div>
        </div>

        {/* Transactions */}
        <Link
          href="/transactions"
          className={`flex flex-col items-center py-2 px-3 ${pathname === "/transactions" ? "text-blue-600" : "text-gray-600"}`}
        >
          <FileText className="w-5 h-5 mb-1" />
          <span className="text-xs">Transactions</span>
        </Link>

        {/* Profile */}
        <Link
          href="/profile"
          className={`flex flex-col items-center py-2 px-3 ${pathname === "/profile" ? "text-blue-600" : "text-gray-600"}`}
        >
          <User className="w-5 h-5 mb-1" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </nav>
  )
}
