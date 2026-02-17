"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { propertyApi } from "@/lib/api/property-api"
import type { PropertyStatistics } from "@/lib/types/property"
import { Building2, Bed, CheckCircle2, Users, Wrench, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PropertyStatisticsCard() {
  const [statistics, setStatistics] = useState<PropertyStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await propertyApi.getStatistics()
      setStatistics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load statistics")
    } finally {
      setLoading(false)
    }
  }

  if (loading && !statistics) {
    return (
      <div className="bg-card rounded-xl border p-8">
        <div className="text-center text-muted-foreground">Loading statistics...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-card rounded-xl border p-8">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadStatistics} variant="outline" size="sm">
            <RefreshCw className="size-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (!statistics) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Property Overview</h2>
        <Button onClick={loadStatistics} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Room Types</CardTitle>
            <Building2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalRoomTypes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {statistics.activeRoomTypes} active, {statistics.inactiveRoomTypes} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <Bed className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalRooms}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {statistics.totalFloors} floors ({statistics.roomsPerFloor} avg/floor)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready Rooms</CardTitle>
            <CheckCircle2 className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statistics.readyRooms}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {statistics.availabilityRate.toFixed(1)}% availability
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <Users className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{statistics.occupiedRooms}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((statistics.occupiedRooms / statistics.totalRooms) * 100).toFixed(1)}% occupancy
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cleaning</CardTitle>
            <div className="size-4 rounded-full bg-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.cleaningRooms}</div>
            <p className="text-xs text-muted-foreground mt-1">In housekeeping</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Wrench className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.maintenanceRooms}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {statistics.maintenanceRate.toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Order</CardTitle>
            <AlertCircle className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statistics.outOfOrderRooms}</div>
            <p className="text-xs text-muted-foreground mt-1">Long-term unavailable</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
