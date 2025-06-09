"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, Search, PlusSquare, User, Camera, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/contexts/auth"

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/search", icon: Search, label: "Search" },
    { href: "/upload", icon: PlusSquare, label: "Upload" },
    { href: "/profile", icon: User, label: "Profile" },
  ]

  const handleLogout = async () => {
    await logout()
    router.push('/auth/login')
  }

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-primary-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="p-2 bg-primary-500 rounded-lg shadow-md">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-primary-600">TourismCam</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${
                      isActive
                        ? "bg-primary-500 text-white shadow-md"
                        : "text-secondary-600 hover:text-secondary-800 hover:bg-primary-50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="ml-2">{item.label}</span>
                  </Button>
                </Link>
              )
            })}

            {/* User Info and Logout */}
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-primary-200">
              {user && (
                <span className="text-sm text-secondary-600">
                  Welcome, {user.name}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={isLoading}
                className="text-secondary-600 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-2">Logout</span>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={isLoading}
              className="text-secondary-600 hover:text-red-600"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-primary-100 z-50 shadow-lg">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${isActive ? "bg-primary-500 text-white shadow-md" : "text-secondary-600"} p-3`}
                >
                  <Icon className="h-6 w-6" />
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
