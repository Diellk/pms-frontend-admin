"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { propertyApi } from "@/lib/api/property-api"
import type { Room } from "@/lib/types/property"
import { RoomStatus, ROOM_STATUS_LABELS, ROOM_STATUS_COLORS } from "@/lib/types/property"
import { Building, Search, RefreshCw } from "lucide-react"

export function FloorManagement() {
  const [floorNumber, setFloorNumber] = useState("")
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<RoomStatus>(RoomStatus.READY)

  const loadFloorRooms = async () => {
    if (!floorNumber || parseInt(floorNumber) < 1) {
      setError("Please enter a valid floor number")
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await propertyApi.getRoomsByFloor(parseInt(floorNumber))
      setRooms(data)
      
      if (data.length === 0) {
        setError(`No rooms found on floor ${floorNumber}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load floor rooms")
      setRooms([])
    } finally {
      setLoading(false)
    }
  }

  const handleFloorStatusUpdate = async () => {
    if (!floorNumber || parseInt(floorNumber) < 1) {
      setError("Please enter a valid floor number")
      return
    }

    if (!selectedStatus) {
      setError("Please select a status")
      return
    }

    try {
      setUpdateLoading(true)
      setError(null)
      const response = await propertyApi.bulkUpdateFloorStatus(
        parseInt(floorNumber),
        selectedStatus
      )
      
      // Show success message
      alert(`Success: ${response.message}`)
      
      // Reload rooms to show updated status
      await loadFloorRooms()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update floor status")
    } finally {
      setUpdateLoading(false)
    }
  }

  const getRoomStatusBadge = (status: RoomStatus) => {
    return (
      <Badge variant="outline" className={ROOM_STATUS_COLORS[status]}>
        {ROOM_STATUS_LABELS[status]}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Floor Management</h2>
        <p className="text-muted-foreground mt-1">View and manage rooms by floor</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="size-5" />
              View Floor Rooms
            </CardTitle>
            <CardDescription>
              List all rooms on a specific floor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="floorNumber">Floor Number</Label>
                <Input
                  id="floorNumber"
                  type="number"
                  min="1"
                  value={floorNumber}
                  onChange={(e) => setFloorNumber(e.target.value)}
                  placeholder="e.g., 3"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      loadFloorRooms()
                    }
                  }}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={loadFloorRooms} disabled={loading}>
                  {loading ? (
                    <RefreshCw className="size-4 animate-spin" />
                  ) : (
                    <>
                      <Building className="size-4 mr-2" />
                      Load Rooms
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="size-5" />
              Update Floor Status
            </CardTitle>
            <CardDescription>
              Change status of all rooms on a floor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="statusSelect">New Status</Label>
              <Select value={selectedStatus} onValueChange={(val) => setSelectedStatus(val as RoomStatus)}>
                <SelectTrigger id="statusSelect">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(RoomStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {ROOM_STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleFloorStatusUpdate} 
              disabled={updateLoading || !floorNumber}
              variant="secondary"
              className="w-full"
            >
              {updateLoading ? "Updating..." : `Update All Rooms on Floor ${floorNumber || "?"}`}
            </Button>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="text-destructive text-sm bg-destructive/10 p-4 rounded-lg">
          {error}
        </div>
      )}

      {rooms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Floor {floorNumber} - {rooms.length} Rooms</CardTitle>
            <CardDescription>
              Room inventory for this floor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room Number</TableHead>
                    <TableHead>Room Name</TableHead>
                    <TableHead>Room Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Base Price</TableHead>
                    <TableHead>Max Occupancy</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.number}</TableCell>
                      <TableCell>{room.name}</TableCell>
                      <TableCell>{room.roomType.typeName}</TableCell>
                      <TableCell>{getRoomStatusBadge(room.roomStatus)}</TableCell>
                      <TableCell>${room.roomType.basePrice.toFixed(2)}</TableCell>
                      <TableCell>{room.roomType.maxOccupancy} guests</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Use Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li><strong>Maintenance Mode:</strong> Set entire floor to maintenance during renovations</li>
            <li><strong>Cleaning Schedule:</strong> Mark entire floor for cleaning after events</li>
            <li><strong>Floor Inspection:</strong> Prepare entire floor for inspection</li>
            <li><strong>Seasonal Closure:</strong> Mark floor as out of order during off-season</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
