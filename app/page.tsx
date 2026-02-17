"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Hotel, BarChart3, Building2 } from "lucide-react"

export default function Page() {
  return (
    <div className="container mx-auto py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Hotel className="size-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Hotel PMS Admin Panel</h1>
          <p className="text-muted-foreground text-lg">
            Property Management System Administration
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="size-8 text-primary" />
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage staff accounts and permissions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create, update, and manage user accounts for administrators, front desk, housekeeping, and maintenance staff.
              </p>
              <Link href="/users">
                <Button className="w-full">
                  Manage Users
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Building2 className="size-8 text-blue-600" />
                <div>
                  <CardTitle>Property Management</CardTitle>
                  <CardDescription>
                    Rooms, types, and bulk operations
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage room types, perform bulk operations, view floor details, and oversee property inventory.
              </p>
              <Link href="/property">
                <Button className="w-full">
                  Manage Property
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <BarChart3 className="size-8 text-green-600" />
                <div>
                  <CardTitle>Financial Reports</CardTitle>
                  <CardDescription>
                    Revenue, expenses, and analytics
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View comprehensive financial reports, revenue analysis, expense tracking, and occupancy analytics.
              </p>
              <Link href="/financial">
                <Button className="w-full">
                  View Reports
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
