"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { financialApi } from "@/lib/api/financial-api"
import type { RevenueReport } from "@/lib/types/financial"
import { formatCurrency, formatPercentage, formatNumber, formatDate } from "@/lib/utils"
import { DollarSign, TrendingUp, Calendar, Search, Download } from "lucide-react"

type PeriodType = "today" | "week" | "month" | "year" | "custom"

export function RevenueReportView() {
  const [report, setReport] = useState<RevenueReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState<PeriodType>("month")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const loadReport = async () => {
    try {
      setLoading(true)
      setError(null)
      let data: RevenueReport

      switch (period) {
        case "today":
          data = await financialApi.getTodayRevenue()
          break
        case "week":
          data = await financialApi.getWeekRevenue()
          break
        case "month":
          data = await financialApi.getMonthRevenue()
          break
        case "year":
          data = await financialApi.getYearRevenue()
          break
        case "custom":
          if (!startDate || !endDate) {
            setError("Please select both start and end dates")
            setLoading(false)
            return
          }
          data = await financialApi.getRevenueReport(startDate, endDate)
          break
      }

      setReport(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load revenue report")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Report Filters</CardTitle>
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
                  <SelectItem value="week">This Week</SelectItem>
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
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(report.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(report.startDate)} - {formatDate(report.endDate)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(report.netRevenue)}</div>
                <p className="text-xs text-muted-foreground mt-1">After taxes & charges</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Daily Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(report.averageDailyRate)}</div>
                <p className="text-xs text-muted-foreground mt-1">ADR</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">RevPAR</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(report.revenuePerAvailableRoom)}</div>
                <p className="text-xs text-muted-foreground mt-1">Revenue per available room</p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Breakdown */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Room Revenue</span>
                  <span className="font-semibold">{formatCurrency(report.roomRevenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Service Revenue</span>
                  <span className="font-semibold">{formatCurrency(report.serviceRevenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Other Revenue</span>
                  <span className="font-semibold">{formatCurrency(report.otherRevenue)}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Tax</span>
                    <span className="text-muted-foreground">{formatCurrency(report.totalTax)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm">Service Charges</span>
                    <span className="text-muted-foreground">{formatCurrency(report.totalServiceCharges)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Booking Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Bookings</span>
                  <Badge variant="outline">{formatNumber(report.totalBookings)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Confirmed</span>
                  <Badge variant="secondary">{formatNumber(report.confirmedBookings)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Completed</span>
                  <Badge variant="outline">{formatNumber(report.completedBookings)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cancelled</span>
                  <Badge variant="destructive">{formatNumber(report.cancelledBookings)}</Badge>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Booking Value</span>
                    <span className="font-semibold">{formatCurrency(report.averageBookingValue)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Status */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Paid Bookings</p>
                  <p className="text-2xl font-bold text-green-600">{formatNumber(report.paidBookings)}</p>
                  <p className="text-sm mt-1">{formatCurrency(report.totalPaidAmount)}</p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Unpaid Bookings</p>
                  <p className="text-2xl font-bold text-orange-600">{formatNumber(report.unpaidBookings)}</p>
                  <p className="text-sm mt-1">{formatCurrency(report.totalUnpaidAmount)}</p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Partially Paid</p>
                  <p className="text-2xl font-bold text-blue-600">{formatNumber(report.partiallyPaidBookings)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue by Channel */}
          {report.revenueByChannel && Object.keys(report.revenueByChannel).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Booking Channel</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Channel</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(report.revenueByChannel).map(([channel, revenue]) => (
                      <TableRow key={channel}>
                        <TableCell className="font-medium">{channel.replace(/_/g, " ")}</TableCell>
                        <TableCell className="text-right">{formatCurrency(revenue)}</TableCell>
                        <TableCell className="text-right">
                          {formatPercentage((revenue / report.totalRevenue) * 100)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Revenue by Room Type */}
          {report.revenueByRoomType && Object.keys(report.revenueByRoomType).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Room Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room Type</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(report.revenueByRoomType).map(([roomType, revenue]) => (
                      <TableRow key={roomType}>
                        <TableCell className="font-medium">{roomType}</TableCell>
                        <TableCell className="text-right">{formatCurrency(revenue)}</TableCell>
                        <TableCell className="text-right">
                          {formatPercentage((revenue / report.totalRevenue) * 100)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
