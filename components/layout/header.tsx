"use client"

import { useAuth } from "@/lib/contexts/auth-context"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Hotel, LogOut, User } from "lucide-react"
import Link from "next/link"

export function Header() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  // Don't show header on login page
  if (!user || pathname === "/login") return null

  return (
    <header className="border-b bg-background sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Hotel className="size-6 text-primary" />
          <span className="font-bold text-lg">Hotel PMS Admin</span>
        </Link>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="size-4" />
                <span className="hidden sm:inline">
                  {user.name} {user.surname}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user.name} {user.surname}</p>
                  <p className="text-xs text-muted-foreground font-normal">{user.email}</p>
                  <p className="text-xs text-muted-foreground font-normal mt-1">
                    Role: {user.userType.replace(/_/g, " ")}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                <LogOut className="size-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
