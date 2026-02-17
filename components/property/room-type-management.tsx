"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { propertyApi } from "@/lib/api/property-api"
import type { RoomType } from "@/lib/types/property"
import { CreateRoomTypeDialog } from "./create-room-type-dialog"
import { EditRoomTypeDialog } from "./edit-room-type-dialog"
import { MoreVertical, Edit, CheckCircle2, XCircle, Trash2, RefreshCw, Filter } from "lucide-react"

export function RoomTypeManagement() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null)
  const [deletingRoomType, setDeletingRoomType] = useState<RoomType | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    loadRoomTypes()
  }, [statusFilter])

  const loadRoomTypes = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let data: RoomType[]
      if (statusFilter === "active") {
        data = await propertyApi.getAllRoomTypes(true)
      } else if (statusFilter === "inactive") {
        data = await propertyApi.getAllRoomTypes(false)
      } else {
        data = await propertyApi.getAllRoomTypes()
      }
      
      setRoomTypes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load room types")
    } finally {
      setLoading(false)
    }
  }

  const handleActivateRoomType = async (id: number) => {
    setActionLoading(id)
    try {
      await propertyApi.activateRoomType(id)
      await loadRoomTypes()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to activate room type")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeactivateRoomType = async (id: number) => {
    setActionLoading(id)
    try {
      await propertyApi.deactivateRoomType(id)
      await loadRoomTypes()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to deactivate room type")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteRoomType = async () => {
    if (!deletingRoomType) return
    
    setActionLoading(deletingRoomType.id)
    try {
      await propertyApi.deleteRoomType(deletingRoomType.id)
      setDeletingRoomType(null)
      await loadRoomTypes()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete room type")
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Room Types</h2>
          <p className="text-muted-foreground mt-1">Manage your property's room categories</p>
        </div>
        <CreateRoomTypeDialog onSuccess={loadRoomTypes} />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter:</span>
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="inactive">Inactive Only</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={loadRoomTypes} disabled={loading}>
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {error && (
        <div className="text-destructive text-sm bg-destructive/10 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-card rounded-xl border">
        {loading && roomTypes.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading room types...
          </div>
        ) : roomTypes.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No room types found. Create your first room type to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type Name</TableHead>
                <TableHead>Base Price</TableHead>
                <TableHead>Max Occupancy</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Total Rooms</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roomTypes.map((roomType) => (
                <TableRow key={roomType.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{roomType.typeName}</div>
                      {roomType.bedType && (
                        <div className="text-xs text-muted-foreground">
                          {roomType.bedType} {roomType.numberOfBeds && `× ${roomType.numberOfBeds}`}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>${roomType.basePrice.toFixed(2)}</TableCell>
                  <TableCell>{roomType.maxOccupancy} guests</TableCell>
                  <TableCell>{roomType.size ? `${roomType.size} m²` : "-"}</TableCell>
                  <TableCell>{roomType.totalRooms}</TableCell>
                  <TableCell>{roomType.availableRooms}</TableCell>
                  <TableCell>
                    {roomType.active ? (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-600 border-gray-600">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" disabled={actionLoading === roomType.id}>
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingRoomType(roomType)}>
                          <Edit className="size-4 mr-2" />
                          Edit Room Type
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {roomType.active ? (
                          <DropdownMenuItem onClick={() => handleDeactivateRoomType(roomType.id)}>
                            <XCircle className="size-4 mr-2" />
                            Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleActivateRoomType(roomType.id)}>
                            <CheckCircle2 className="size-4 mr-2" />
                            Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeletingRoomType(roomType)}
                          className="text-destructive focus:text-destructive"
                          disabled={roomType.totalRooms > 0}
                        >
                          <Trash2 className="size-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {editingRoomType && (
        <EditRoomTypeDialog
          roomType={editingRoomType}
          open={!!editingRoomType}
          onOpenChange={(open) => !open && setEditingRoomType(null)}
          onSuccess={loadRoomTypes}
        />
      )}

      <AlertDialog open={!!deletingRoomType} onOpenChange={(open) => !open && setDeletingRoomType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deletingRoomType?.typeName}</strong>? 
              This action cannot be undone.
              {deletingRoomType && deletingRoomType.totalRooms > 0 && (
                <div className="mt-2 text-destructive">
                  Cannot delete: There are {deletingRoomType.totalRooms} room(s) of this type.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteRoomType}
              disabled={actionLoading === deletingRoomType?.id || (deletingRoomType?.totalRooms ?? 0) > 0}
            >
              {actionLoading === deletingRoomType?.id ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
