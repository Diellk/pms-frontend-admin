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
import type { ExpenseReport } from "@/lib/types/financial"
import { formatCurrency, formatPercentage, formatNumber, formatDate } from "@/lib/utils"
import { Receipt, Search, TrendingDown } from "lucide-react"

type PeriodType = "today" | "month" | "year" | "custom"

export function ExpenseReportView() {
  const [report, setReport] = useState<ExpenseReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState<PeriodType>("month")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const loadReport = async () => {
    try {
      setLoading(true)
      setError(null)
      let data: ExpenseReport

      switch (period) {
        case "today":
          data = await financialApi.getTodayExpenses()
          break
        case "month":
          data = await financialApi.getMonthExpenses()
          break
        case "year":
          data = await financialApi.getYearExpenses()
          break
        case "custom":
          if (!startDate || !endDate) {
            setError("Please select both start and end dates")
            setLoading(false)
            return
          }
          data = await financialApi.getExpenseReport(startDate, endDate)
          break
      }

      setReport(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load expense report")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Report Filters</CardTitle>
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
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(report.totalExpenses)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(report.startDate)} - {formatDate(report.endDate)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Paid Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(report.paidExpenses)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatPercentage((report.paidExpenses / report.totalExpenses) * 100)} of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Unpaid Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(report.unpaidExpenses)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatPercentage((report.unpaidExpenses / report.totalExpenses) * 100)} of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Daily Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(report.averageDailyExpenses)}</div>
                <p className="text-xs text-muted-foreground mt-1">Per day average</p>
              </CardContent>
            </Card>
          </div>

          {/* Transaction Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                  <p className="text-2xl font-bold">{formatNumber(report.totalTransactions)}</p>
                  <p className="text-xs text-muted-foreground mt-1">All transactions</p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Paid Transactions</p>
                  <p className="text-2xl font-bold text-green-600">{formatNumber(report.paidTransactions)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatPercentage((report.paidTransactions / report.totalTransactions) * 100)}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Unpaid Transactions</p>
                  <p className="text-2xl font-bold text-red-600">{formatNumber(report.unpaidTransactions)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatPercentage((report.unpaidTransactions / report.totalTransactions) * 100)}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Average Amount</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(report.averageExpenseAmount)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Per transaction</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expenses by Category */}
          {report.expensesByCategory && Object.keys(report.expensesByCategory).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(report.expensesByCategory)
                      .sort(([, a], [, b]) => b - a)
                      .map(([category, amount]) => (
                        <TableRow key={category}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Receipt className="size-4 text-muted-foreground" />
                              {category.replace(/_/g, " ")}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold">{formatCurrency(amount)}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline">
                              {formatPercentage((amount / report.totalExpenses) * 100)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Reversed Expenses */}
          {report.reversedExpenses > 0 && (
            <Card className="border-yellow-200 bg-yellow-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="size-5 text-yellow-600" />
                  Reversed Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Reversed Amount</p>
                    <p className="text-3xl font-bold text-yellow-600">{formatCurrency(report.reversedExpenses)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reversed Transactions</p>
                    <p className="text-3xl font-bold text-yellow-600">{formatNumber(report.reversedTransactions)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
