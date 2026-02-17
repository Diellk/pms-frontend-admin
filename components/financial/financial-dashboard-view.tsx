"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MetricCard } from "./metric-card"
import { financialApi } from "@/lib/api/financial-api"
import type { FinancialDashboard } from "@/lib/types/financial"
import { formatCurrency, formatPercentage, formatNumber } from "@/lib/utils"
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Users,
  LogIn,
  LogOut,
  Bed,
  Receipt,
  AlertCircle,
  CreditCard,
} from "lucide-react"

export function FinancialDashboardView() {
  const [dashboard, setDashboard] = useState<FinancialDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await financialApi.getDashboard()
      setDashboard(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading financial dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!dashboard) return null

  return (
    <div className="space-y-6">
      {/* Today's Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Today's Performance</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Today's Revenue"
            value={formatCurrency(dashboard.todayRevenue)}
            icon={DollarSign}
            color="text-green-600"
          />
          <MetricCard
            title="Today's Expenses"
            value={formatCurrency(dashboard.todayExpenses)}
            icon={Receipt}
            color="text-orange-600"
          />
          <MetricCard
            title="Bookings Today"
            value={formatNumber(dashboard.todayBookings)}
            icon={Calendar}
            color="text-blue-600"
          />
          <MetricCard
            title="Occupancy Rate"
            value={formatPercentage(dashboard.todayOccupancyRate)}
            icon={Bed}
            color="text-purple-600"
          />
        </div>
      </div>

      {/* Check-ins & Check-outs */}
      <div className="grid gap-4 md:grid-cols-2">
        <MetricCard
          title="Check-ins Today"
          value={formatNumber(dashboard.todayCheckIns)}
          subtitle="Guests arriving"
          icon={LogIn}
          color="text-teal-600"
        />
        <MetricCard
          title="Check-outs Today"
          value={formatNumber(dashboard.todayCheckOuts)}
          subtitle="Guests departing"
          icon={LogOut}
          color="text-indigo-600"
        />
      </div>

      {/* Month-to-Date Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Month-to-Date</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="MTD Revenue"
            value={formatCurrency(dashboard.monthToDateRevenue)}
            trend={{
              value: dashboard.revenueGrowthPercentage,
              isPositive: dashboard.revenueGrowthPercentage >= 0,
            }}
            icon={DollarSign}
            color="text-green-600"
          />
          <MetricCard
            title="MTD Expenses"
            value={formatCurrency(dashboard.monthToDateExpenses)}
            icon={Receipt}
            color="text-orange-600"
          />
          <MetricCard
            title="MTD Bookings"
            value={formatNumber(dashboard.monthToDateBookings)}
            icon={Calendar}
            color="text-blue-600"
          />
          <MetricCard
            title="MTD Occupancy"
            value={formatPercentage(dashboard.monthToDateOccupancyRate)}
            trend={{
              value: dashboard.occupancyGrowthPercentage,
              isPositive: dashboard.occupancyGrowthPercentage >= 0,
            }}
            icon={Bed}
            color="text-purple-600"
          />
        </div>
      </div>

      {/* Year-to-Date Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Year-to-Date</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="YTD Revenue"
            value={formatCurrency(dashboard.yearToDateRevenue)}
            icon={DollarSign}
            color="text-green-600"
          />
          <MetricCard
            title="YTD Expenses"
            value={formatCurrency(dashboard.yearToDateExpenses)}
            icon={Receipt}
            color="text-orange-600"
          />
          <MetricCard
            title="YTD Bookings"
            value={formatNumber(dashboard.yearToDateBookings)}
            icon={Users}
            color="text-blue-600"
          />
          <MetricCard
            title="YTD Occupancy"
            value={formatPercentage(dashboard.yearToDateOccupancyRate)}
            icon={Bed}
            color="text-purple-600"
          />
        </div>
      </div>

      {/* Outstanding Payments */}
      {dashboard.totalUnpaidAmount > 0 && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="size-5 text-orange-600" />
              <CardTitle>Outstanding Payments</CardTitle>
            </div>
            <CardDescription>
              Action required for unpaid bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Total Unpaid Amount</p>
                <p className="text-3xl font-bold text-orange-600">
                  {formatCurrency(dashboard.totalUnpaidAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unpaid Bookings</p>
                <p className="text-3xl font-bold text-orange-600">
                  {formatNumber(dashboard.unpaidBookingsCount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Net Profit Card */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="size-5 text-blue-600" />
            <CardTitle>Month-to-Date Net Profit</CardTitle>
          </div>
          <CardDescription>
            Revenue minus expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-blue-600">
            {formatCurrency(dashboard.monthToDateRevenue - dashboard.monthToDateExpenses)}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Profit Margin: {formatPercentage(
              ((dashboard.monthToDateRevenue - dashboard.monthToDateExpenses) / dashboard.monthToDateRevenue) * 100
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
