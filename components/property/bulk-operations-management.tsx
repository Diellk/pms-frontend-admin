"use client"

import { BulkCreateRoomsDialog } from "./bulk-create-rooms-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PackagePlus, RefreshCw, Trash2, ArrowRightLeft } from "lucide-react"

export function BulkOperationsManagement() {
  const handleRefresh = () => {
    // Placeholder for refresh functionality
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Bulk Operations</h2>
        <p className="text-muted-foreground mt-1">Perform operations on multiple rooms at once</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackagePlus className="size-5" />
              Bulk Create Rooms
            </CardTitle>
            <CardDescription>
              Create multiple rooms at once with the same configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BulkCreateRoomsDialog onSuccess={handleRefresh} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="size-5" />
              Bulk Update Status
            </CardTitle>
            <CardDescription>
              Update the status of multiple rooms simultaneously
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Select rooms from the floor management or room list to update their status in bulk.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="size-5" />
              Bulk Assign Room Type
            </CardTitle>
            <CardDescription>
              Reassign multiple rooms to a different room type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Useful for property reorganization or room type migrations.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="size-5 text-destructive" />
              Bulk Delete Rooms
            </CardTitle>
            <CardDescription>
              Delete multiple rooms at once (with safety checks)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Occupied rooms cannot be deleted. Use with caution.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Test bulk operations on a small set before full deployment</li>
            <li>Double-check room IDs before bulk deletion operations</li>
            <li>Use floor-wide updates for consistency across an entire floor</li>
            <li>Always review the operation response for any failures</li>
            <li>Keep a backup strategy for major bulk changes</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
