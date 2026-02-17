"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { userApi } from "@/lib/api/user-api"
import type { UserStatistics } from "@/lib/types/user"
import { Users, UserCheck, UserX, Shield, Briefcase, Home, Wrench } from "lucide-react"

export function UserStatisticsCard() {
  const [statistics, setStatistics] = useState<UserStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await userApi.getUserStatistics()
      setStatistics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load statistics")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Loading statistics...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-sm">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!statistics) return null

  const stats = [
    {
      label: "Total Users",
      value: statistics.totalUsers,
      icon: Users,
      color: "text-blue-600"
    },
    {
      label: "Active",
      value: statistics.activeUsers,
      icon: UserCheck,
      color: "text-green-600"
    },
    {
      label: "Inactive",
      value: statistics.inactiveUsers,
      icon: UserX,
      color: "text-gray-600"
    },
    {
      label: "Administrators",
      value: statistics.administratorCount,
      icon: Shield,
      color: "text-purple-600"
    },
    {
      label: "Front Desk",
      value: statistics.frontDeskCount,
      icon: Briefcase,
      color: "text-orange-600"
    },
    {
      label: "Housekeeping",
      value: statistics.housekeepingCount,
      icon: Home,
      color: "text-teal-600"
    },
    {
      label: "Maintenance",
      value: statistics.maintenanceCount,
      icon: Wrench,
      color: "text-amber-600"
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Icon className={`size-5 ${stat.color}`} />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-muted-foreground text-xs">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
