"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FinancialDashboardView } from "./financial-dashboard-view"
import { RevenueReportView } from "./revenue-report-view"
import { ExpenseReportView } from "./expense-report-view"
import { OccupancyReportView } from "./occupancy-report-view"
import { BarChart3, DollarSign, Receipt, Bed } from "lucide-react"

export function FinancialReportsPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financial Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Comprehensive financial insights and performance metrics
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="gap-2">
            <BarChart3 className="size-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="revenue" className="gap-2">
            <DollarSign className="size-4" />
            <span className="hidden sm:inline">Revenue</span>
          </TabsTrigger>
          <TabsTrigger value="expenses" className="gap-2">
            <Receipt className="size-4" />
            <span className="hidden sm:inline">Expenses</span>
          </TabsTrigger>
          <TabsTrigger value="occupancy" className="gap-2">
            <Bed className="size-4" />
            <span className="hidden sm:inline">Occupancy</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4 mt-6">
          <FinancialDashboardView />
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4 mt-6">
          <RevenueReportView />
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4 mt-6">
          <ExpenseReportView />
        </TabsContent>

        <TabsContent value="occupancy" className="space-y-4 mt-6">
          <OccupancyReportView />
        </TabsContent>
      </Tabs>
    </div>
  )
}
