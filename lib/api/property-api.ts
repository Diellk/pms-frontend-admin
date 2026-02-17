import type {
  RoomType,
  CreateRoomTypeRequest,
  UpdateRoomTypeRequest,
  Room,
  BulkCreateRoomsRequest,
  BulkUpdateStatusRequest,
  BulkOperationResponse,
  PropertyStatistics,
  FloorUpdateResponse,
  RoomStatus
} from "@/lib/types/property"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

// Helper function to get auth token
function getAuthToken(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken") || ""
  }
  return ""
}

// Helper function to create headers
function getHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAuthToken()}`
  }
}

// Room Type API Endpoints

export const roomTypeApi = {
  // Create room type
  async createRoomType(request: CreateRoomTypeRequest): Promise<RoomType> {
    const response = await fetch(`${API_BASE_URL}/api/admin/room-types`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create room type")
    }

    return response.json()
  },

  // Get all room types
  async getAllRoomTypes(activeOnly?: boolean): Promise<RoomType[]> {
    const url = activeOnly !== undefined
      ? `${API_BASE_URL}/api/admin/room-types?active=${activeOnly}`
      : `${API_BASE_URL}/api/admin/room-types`

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders()
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to fetch room types")
    }

    return response.json()
  },

  // Get active room types
  async getActiveRoomTypes(): Promise<RoomType[]> {
    const response = await fetch(`${API_BASE_URL}/api/admin/room-types/active`, {
      method: "GET",
      headers: getHeaders()
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to fetch active room types")
    }

    return response.json()
  },

  // Get inactive room types
  async getInactiveRoomTypes(): Promise<RoomType[]> {
    const response = await fetch(`${API_BASE_URL}/api/admin/room-types/inactive`, {
      method: "GET",
      headers: getHeaders()
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to fetch inactive room types")
    }

    return response.json()
  },

  // Get room type by ID
  async getRoomTypeById(id: number): Promise<RoomType> {
    const response = await fetch(`${API_BASE_URL}/api/admin/room-types/${id}`, {
      method: "GET",
      headers: getHeaders()
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to fetch room type")
    }

    return response.json()
  },

  // Get room type by name
  async getRoomTypeByName(typeName: string): Promise<RoomType> {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/room-types/name/${encodeURIComponent(typeName)}`,
      {
        method: "GET",
        headers: getHeaders()
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to fetch room type")
    }

    return response.json()
  },

  // Update room type
  async updateRoomType(id: number, request: UpdateRoomTypeRequest): Promise<RoomType> {
    const response = await fetch(`${API_BASE_URL}/api/admin/room-types/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to update room type")
    }

    return response.json()
  },

  // Activate room type
  async activateRoomType(id: number): Promise<RoomType> {
    const response = await fetch(`${API_BASE_URL}/api/admin/room-types/${id}/activate`, {
      method: "POST",
      headers: getHeaders()
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to activate room type")
    }

    return response.json()
  },

  // Deactivate room type
  async deactivateRoomType(id: number): Promise<RoomType> {
    const response = await fetch(`${API_BASE_URL}/api/admin/room-types/${id}/deactivate`, {
      method: "POST",
      headers: getHeaders()
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to deactivate room type")
    }

    return response.json()
  },

  // Delete room type
  async deleteRoomType(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/admin/room-types/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to delete room type")
    }

    return response.json()
  },

  // Get property statistics
  async getStatistics(): Promise<PropertyStatistics> {
    const response = await fetch(`${API_BASE_URL}/api/admin/room-types/statistics`, {
      method: "GET",
      headers: getHeaders()
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to fetch statistics")
    }

    return response.json()
  }
}

// Bulk Operations API Endpoints

export const bulkOperationsApi = {
  // Bulk create rooms
  async bulkCreateRooms(request: BulkCreateRoomsRequest): Promise<BulkOperationResponse> {
    const response = await fetch(`${API_BASE_URL}/api/admin/property/rooms/bulk-create`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create rooms")
    }

    return response.json()
  },

  // Bulk update room status
  async bulkUpdateStatus(request: BulkUpdateStatusRequest): Promise<BulkOperationResponse> {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/property/rooms/bulk-update-status`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(request)
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to update room status")
    }

    return response.json()
  },

  // Bulk delete rooms
  async bulkDeleteRooms(roomIds: number[]): Promise<BulkOperationResponse> {
    const response = await fetch(`${API_BASE_URL}/api/admin/property/rooms/bulk-delete`, {
      method: "DELETE",
      headers: getHeaders(),
      body: JSON.stringify(roomIds)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to delete rooms")
    }

    return response.json()
  },

  // Bulk assign room type
  async bulkAssignType(
    roomIds: number[],
    roomTypeId: number
  ): Promise<BulkOperationResponse> {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/property/rooms/bulk-assign-type?roomIds=${roomIds.join(",")}&roomTypeId=${roomTypeId}`,
      {
        method: "POST",
        headers: getHeaders()
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to assign room type")
    }

    return response.json()
  },

  // Get rooms by floor
  async getRoomsByFloor(floor: number): Promise<Room[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/property/floors/${floor}/rooms`,
      {
        method: "GET",
        headers: getHeaders()
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to fetch floor rooms")
    }

    return response.json()
  },

  // Bulk update floor status
  async bulkUpdateFloorStatus(
    floor: number,
    status: RoomStatus
  ): Promise<FloorUpdateResponse> {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/property/floors/${floor}/bulk-update-status?status=${status}`,
      {
        method: "POST",
        headers: getHeaders()
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to update floor status")
    }

    return response.json()
  }
}

// Export combined API
export const propertyApi = {
  ...roomTypeApi,
  ...bulkOperationsApi
}
