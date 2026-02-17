"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { propertyApi } from "@/lib/api/property-api"
import type { CreateRoomTypeRequest } from "@/lib/types/property"
import { COMMON_AMENITIES, BedType } from "@/lib/types/property"
import { Plus, X } from "lucide-react"

interface CreateRoomTypeDialogProps {
  onSuccess: () => void
}

export function CreateRoomTypeDialog({ onSuccess }: CreateRoomTypeDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [typeName, setTypeName] = useState("")
  const [basePrice, setBasePrice] = useState("")
  const [maxOccupancy, setMaxOccupancy] = useState("")
  const [description, setDescription] = useState("")
  const [size, setSize] = useState("")
  const [bedType, setBedType] = useState("")
  const [numberOfBeds, setNumberOfBeds] = useState("")
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [active, setActive] = useState(true)

  const resetForm = () => {
    setTypeName("")
    setBasePrice("")
    setMaxOccupancy("")
    setDescription("")
    setSize("")
    setBedType("")
    setNumberOfBeds("")
    setSelectedAmenities([])
    setImageUrl("")
    setImages([])
    setActive(true)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!typeName.trim()) {
      setError("Room type name is required")
      return
    }
    if (!basePrice || parseFloat(basePrice) <= 0) {
      setError("Base price must be greater than 0")
      return
    }
    if (!maxOccupancy || parseInt(maxOccupancy) < 1) {
      setError("Max occupancy must be at least 1")
      return
    }

    const request: CreateRoomTypeRequest = {
      typeName: typeName.trim(),
      basePrice: parseFloat(basePrice),
      maxOccupancy: parseInt(maxOccupancy),
      description: description.trim() || undefined,
      size: size ? parseFloat(size) : undefined,
      bedType: bedType || undefined,
      numberOfBeds: numberOfBeds ? parseInt(numberOfBeds) : undefined,
      amenities: selectedAmenities,
      images,
      active
    }

    try {
      setLoading(true)
      await propertyApi.createRoomType(request)
      setOpen(false)
      resetForm()
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create room type")
    } finally {
      setLoading(false)
    }
  }

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity))
    } else {
      setSelectedAmenities([...selectedAmenities, amenity])
    }
  }

  const addImage = () => {
    if (imageUrl.trim() && !images.includes(imageUrl.trim())) {
      setImages([...images, imageUrl.trim()])
      setImageUrl("")
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen) resetForm()
    }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4 mr-2" />
          New Room Type
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Room Type</DialogTitle>
          <DialogDescription>
            Add a new room type to your property inventory
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="typeName">Type Name *</Label>
              <Input
                id="typeName"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
                placeholder="e.g., Deluxe King"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price (per night) *</Label>
              <Input
                id="basePrice"
                type="number"
                step="0.01"
                min="0"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="250.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxOccupancy">Max Occupancy *</Label>
              <Input
                id="maxOccupancy"
                type="number"
                min="1"
                value={maxOccupancy}
                onChange={(e) => setMaxOccupancy(e.target.value)}
                placeholder="2"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Room Size (m²)</Label>
              <Input
                id="size"
                type="number"
                step="0.1"
                min="0"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="35.0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedType">Bed Type</Label>
              <Select value={bedType} onValueChange={setBedType}>
                <SelectTrigger id="bedType">
                  <SelectValue placeholder="Select bed type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {Object.values(BedType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfBeds">Number of Beds</Label>
              <Input
                id="numberOfBeds"
                type="number"
                min="1"
                value={numberOfBeds}
                onChange={(e) => setNumberOfBeds(e.target.value)}
                placeholder="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Spacious room with king bed and city view"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Amenities</Label>
            <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {COMMON_AMENITIES.map((amenity) => (
                  <Badge
                    key={amenity}
                    variant={selectedAmenities.includes(amenity) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleAmenity(amenity)}
                  >
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Images</Label>
            <div className="flex gap-2">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addImage()
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addImage}>
                <Plus className="size-4" />
              </Button>
            </div>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {images.map((img, index) => (
                  <Badge key={index} variant="secondary" className="pr-1">
                    <span className="max-w-[200px] truncate">{img}</span>
                    <X
                      className="size-3 ml-2 cursor-pointer"
                      onClick={() => removeImage(index)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="active"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="size-4"
            />
            <Label htmlFor="active" className="cursor-pointer">
              Active (available for booking)
            </Label>
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
              {loading ? "Creating..." : "Create Room Type"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
