"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PropertyStatisticsCard } from "./property-statistics-card"
import { RoomTypeManagement } from "./room-type-management"
import { BulkOperationsManagement } from "./bulk-operations-management"
import { FloorManagement } from "./floor-management"
import { Building2, Package, Layers, BarChart3 } from "lucide-react"

export function PropertyManagementPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Property Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage room types, perform bulk operations, and oversee property inventory
          </p>
        </div>
      </div>

      <PropertyStatisticsCard />

      <Tabs defaultValue="room-types" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="room-types" className="flex items-center gap-2">
            <Building2 className="size-4" />
            <span className="hidden sm:inline">Room Types</span>
          </TabsTrigger>
          <TabsTrigger value="bulk-operations" className="flex items-center gap-2">
            <Package className="size-4" />
            <span className="hidden sm:inline">Bulk Operations</span>
          </TabsTrigger>
          <TabsTrigger value="floor-management" className="flex items-center gap-2">
            <Layers className="size-4" />
            <span className="hidden sm:inline">Floor Management</span>
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="size-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="room-types" className="space-y-6">
          <RoomTypeManagement />
        </TabsContent>

        <TabsContent value="bulk-operations" className="space-y-6">
          <BulkOperationsManagement />
        </TabsContent>

        <TabsContent value="floor-management" className="space-y-6">
          <FloorManagement />
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6">
            <div className="bg-card rounded-xl border p-6">
              <h2 className="text-xl font-semibold mb-4">Property Management Overview</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Room Type Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Create and manage different room categories with pricing, amenities, and specifications.
                    Room types define the inventory structure of your property.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Bulk Operations</h3>
                  <p className="text-sm text-muted-foreground">
                    Perform efficient mass operations on multiple rooms simultaneously. Create entire floors,
                    update room statuses, reassign room types, or manage deletions with safety checks.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Floor Management</h3>
                  <p className="text-sm text-muted-foreground">
                    View and manage rooms organized by floor. Perform floor-wide status updates for
                    maintenance, cleaning schedules, or special events.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Property Statistics</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor real-time metrics including room counts by status, occupancy rates, availability,
                    and maintenance statistics across your entire property.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Tips</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Create room types before adding individual rooms to your inventory</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Use bulk operations to save time when setting up new floors or sections</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Deactivate room types instead of deleting them to preserve historical data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Monitor the property statistics regularly to identify maintenance needs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Use floor-wide status updates for efficient housekeeping and maintenance scheduling</span>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
