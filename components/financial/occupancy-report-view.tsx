"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { financialApi } from "@/lib/api/financial-api"
import type { OccupancyReport } from "@/lib/types/financial"
import { formatPercentage, formatNumber, formatDate } from "@/lib/utils"
import { Bed, Search, LogIn, LogOut } from "lucide-react"

type PeriodType = "today" | "month" | "year" | "custom"

export function OccupancyReportView() {
  const [report, setReport] = useState<OccupancyReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState<PeriodType>("month")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const loadReport = async () => {
    try {
      setLoading(true)
      setError(null)
      let data: OccupancyReport

      switch (period) {
        case "today":
          data = await financialApi.getTodayOccupancy()
          break
        case "month":
          data = await financialApi.getMonthOccupancy()
          break
        case "year":
          data = await financialApi.getYearOccupancy()
          break
        case "custom":
          if (!startDate || !endDate) {
            setError("Please select both start and end dates")
            setLoading(false)
            return
          }
          data = await financialApi.getOccupancyReport(startDate, endDate)
          break
      }

      setReport(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load occupancy report")
    } finally {
      setLoading(false)
    }
  }

  const getOccupancyColor = (rate: number) => {
    if (rate >= 90) return "text-green-600"
    if (rate >= 70) return "text-blue-600"
    if (rate >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Occupancy Report Filters</CardTitle>
          <CardDescription>Select a time period to generate the report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="grid gap-2">
              <Label htmlFor="period">Period</Label>
              <Select value={period} onValueChange={(value) => setPeriod(value as PeriodType)}>
                <SelectTrigger id="period">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {period === "custom" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="flex items-end">
              <Button onClick={loadReport} disabled={loading} className="w-full">
                <Search className="mr-2 size-4" />
                {loading ? "Loading..." : "Generate Report"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {report && (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Occupancy Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getOccupancyColor(report.averageOccupancyRate)}`}>
                  {formatPercentage(report.averageOccupancyRate)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(report.startDate)} - {formatDate(report.endDate)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(report.totalRooms)}</div>
                <p className="text-xs text-muted-foreground mt-1">Available rooms</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Occupied Rooms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatNumber(report.averageOccupiedRooms)}</div>
                <p className="text-xs text-muted-foreground mt-1">Per day average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Available Rooms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{formatNumber(report.averageAvailableRooms)}</div>
                <p className="text-xs text-muted-foreground mt-1">Per day average</p>
              </CardContent>
            </Card>
          </div>

          {/* Room Nights Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Room Nights Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Total Room Nights</p>
                  <p className="text-2xl font-bold">{formatNumber(report.totalRoomNights)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Available room nights</p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Occupied Room Nights</p>
                  <p className="text-2xl font-bold text-green-600">{formatNumber(report.occupiedRoomNights)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatPercentage((report.occupiedRoomNights / report.totalRoomNights) * 100)}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Available Room Nights</p>
                  <p className="text-2xl font-bold text-blue-600">{formatNumber(report.availableRoomNights)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatPercentage((report.availableRoomNights / report.totalRoomNights) * 100)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Occupancy */}
          {report.dailyOccupancy && report.dailyOccupancy.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Daily Occupancy Breakdown</CardTitle>
                <CardDescription>
                  Day-by-day occupancy analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Occupancy Rate</TableHead>
                      <TableHead className="text-right">Occupied</TableHead>
                      <TableHead className="text-right">Available</TableHead>
                      <TableHead className="text-right">Check-Ins</TableHead>
                      <TableHead className="text-right">Check-Outs</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.dailyOccupancy.map((day) => (
                      <TableRow key={day.date}>
                        <TableCell className="font-medium">{formatDate(day.date)}</TableCell>
                        <TableCell className="text-right">
                          <span className={`font-semibold ${getOccupancyColor(day.occupancyRate)}`}>
                            {formatPercentage(day.occupancyRate)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-green-600 font-medium">
                          {formatNumber(day.occupiedRooms)}
                        </TableCell>
                        <TableCell className="text-right text-blue-600">
                          {formatNumber(day.availableRooms)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <LogIn className="size-3 text-teal-600" />
                            {formatNumber(day.checkIns)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <LogOut className="size-3 text-indigo-600" />
                            {formatNumber(day.checkOuts)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Occupancy Status */}
          <Card className={`border-2 ${report.averageOccupancyRate >= 80 ? "border-green-200 bg-green-50/50" : report.averageOccupancyRate >= 60 ? "border-blue-200 bg-blue-50/50" : "border-yellow-200 bg-yellow-50/50"}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bed className="size-5" />
                Occupancy Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Average occupancy rate of <span className="font-bold">{formatPercentage(report.averageOccupancyRate)}</span> indicates:
                </p>
                {report.averageOccupancyRate >= 90 && (
                  <p className="text-green-600 font-medium">✓ Excellent performance - Operating at near capacity</p>
                )}
                {report.averageOccupancyRate >= 70 && report.averageOccupancyRate < 90 && (
                  <p className="text-blue-600 font-medium">✓ Good performance - Healthy occupancy levels</p>
                )}
                {report.averageOccupancyRate >= 50 && report.averageOccupancyRate < 70 && (
                  <p className="text-yellow-600 font-medium">⚠ Moderate performance - Room for improvement</p>
                )}
                {report.averageOccupancyRate < 50 && (
                  <p className="text-red-600 font-medium">⚠ Low performance - Requires attention</p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
