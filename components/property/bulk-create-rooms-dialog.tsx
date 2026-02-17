"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { propertyApi } from "@/lib/api/property-api"
import type { RoomType, BulkCreateRoomsRequest, BulkOperationResponse } from "@/lib/types/property"
import { RoomStatus, ROOM_STATUS_LABELS } from "@/lib/types/property"
import { PackagePlus, CheckCircle2, XCircle } from "lucide-react"

interface BulkCreateRoomsDialogProps {
  onSuccess: () => void
}

export function BulkCreateRoomsDialog({ onSuccess }: BulkCreateRoomsDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<BulkOperationResponse | null>(null)
  
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [roomTypeId, setRoomTypeId] = useState("")
  const [floor, setFloor] = useState("")
  const [roomNumbers, setRoomNumbers] = useState("")
  const [status, setStatus] = useState<RoomStatus>(RoomStatus.READY)

  useEffect(() => {
    if (open) {
      loadRoomTypes()
    }
  }, [open])

  const loadRoomTypes = async () => {
    try {
      const data = await propertyApi.getActiveRoomTypes()
      setRoomTypes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load room types")
    }
  }

  const resetForm = () => {
    setRoomTypeId("")
    setFloor("")
    setRoomNumbers("")
    setStatus(RoomStatus.READY)
    setError(null)
    setResult(null)
  }

  const parseRoomNumbers = (input: string): string[] => {
    // Parse comma-separated or newline-separated room numbers
    return input
      .split(/[\n,]+/)
      .map(num => num.trim())
      .filter(num => num.length > 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)

    if (!roomTypeId) {
      setError("Please select a room type")
      return
    }
    if (!floor || parseInt(floor) < 1) {
      setError("Please enter a valid floor number")
      return
    }

    const parsedRoomNumbers = parseRoomNumbers(roomNumbers)
    if (parsedRoomNumbers.length === 0) {
      setError("Please enter at least one room number")
      return
    }

    const request: BulkCreateRoomsRequest = {
      roomTypeId: parseInt(roomTypeId),
      floor: parseInt(floor),
      roomNumbers: parsedRoomNumbers,
      status
    }

    try {
      setLoading(true)
      const response = await propertyApi.bulkCreateRooms(request)
      setResult(response)
      
      if (response.allSuccessful) {
        setTimeout(() => {
          setOpen(false)
          resetForm()
          onSuccess()
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create rooms")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen) resetForm()
    }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PackagePlus className="size-4 mr-2" />
          Bulk Create Rooms
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Create Rooms</DialogTitle>
          <DialogDescription>
            Create multiple rooms at once with the same room type and floor
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roomType">Room Type *</Label>
              <Select value={roomTypeId} onValueChange={setRoomTypeId} required>
                <SelectTrigger id="roomType">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.typeName} - ${type.basePrice}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="floor">Floor Number *</Label>
                <Input
                  id="floor"
                  type="number"
                  min="1"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  placeholder="e.g., 3"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Initial Status *</Label>
                <Select value={status} onValueChange={(val) => setStatus(val as RoomStatus)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(RoomStatus).map((s) => (
                      <SelectItem key={s} value={s}>
                        {ROOM_STATUS_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomNumbers">Room Numbers *</Label>
              <Textarea
                id="roomNumbers"
                value={roomNumbers}
                onChange={(e) => setRoomNumbers(e.target.value)}
                placeholder="Enter room numbers (comma or line-separated)&#10;e.g., 301, 302, 303 or&#10;301&#10;302&#10;303"
                rows={5}
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter room numbers separated by commas or line breaks
              </p>
            </div>

            {error && (
              <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                {error}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : `Create ${parseRoomNumbers(roomNumbers).length || 0} Rooms`}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-6">
              {result.allSuccessful ? (
                <CheckCircle2 className="size-16 text-green-600" />
              ) : (
                <div className="text-center">
                  <CheckCircle2 className="size-16 text-orange-600 mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">Partially completed</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-center">
                <p className="text-lg font-semibold">
                  {result.successCount} of {result.totalCount} rooms created successfully
                </p>
                {result.failureCount > 0 && (
                  <p className="text-sm text-orange-600">
                    {result.failureCount} room(s) failed
                  </p>
                )}
              </div>

              {result.successMessages.length > 0 && (
                <div className="max-h-32 overflow-y-auto border rounded-lg p-3 space-y-1">
                  {result.successMessages.map((msg, idx) => (
                    <div key={idx} className="text-sm text-green-600 flex items-center gap-2">
                      <CheckCircle2 className="size-3" />
                      {msg}
                    </div>
                  ))}
                </div>
              )}

              {result.errorMessages.length > 0 && (
                <div className="max-h-32 overflow-y-auto border rounded-lg p-3 space-y-1">
                  {result.errorMessages.map((msg, idx) => (
                    <div key={idx} className="text-sm text-destructive flex items-center gap-2">
                      <XCircle className="size-3" />
                      {msg}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button onClick={() => {
                setOpen(false)
                resetForm()
                onSuccess()
              }}>
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
