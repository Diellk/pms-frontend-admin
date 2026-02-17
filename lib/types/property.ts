export enum RoomStatus {
  READY = "READY",
  CLEANING = "CLEANING",
  MAINTENANCE = "MAINTENANCE",
  OCCUPIED = "OCCUPIED",
  OUT_OF_ORDER = "OUT_OF_ORDER"
}

export enum BedType {
  KING = "King",
  QUEEN = "Queen",
  TWIN = "Twin",
  DOUBLE = "Double",
  SINGLE = "Single",
  KING_SOFA_BED = "King + Sofa Bed"
}

export interface RoomType {
  id: number;
  typeName: string;
  basePrice: number;
  maxOccupancy: number;
  description?: string;
  size?: number;
  bedType?: string;
  numberOfBeds?: number;
  amenities: string[];
  images: string[];
  active: boolean;
  totalRooms: number;
  availableRooms: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomTypeRequest {
  typeName: string;
  basePrice: number;
  maxOccupancy: number;
  description?: string;
  size?: number;
  bedType?: string;
  numberOfBeds?: number;
  amenities?: string[];
  images?: string[];
  active?: boolean;
}

export interface UpdateRoomTypeRequest {
  typeName?: string;
  basePrice?: number;
  maxOccupancy?: number;
  description?: string;
  size?: number;
  bedType?: string;
  numberOfBeds?: number;
  amenities?: string[];
  images?: string[];
  active?: boolean;
}

export interface Room {
  id: number;
  number: string;
  name: string;
  floor: number;
  roomType: RoomType;
  roomStatus: RoomStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BulkCreateRoomsRequest {
  roomTypeId: number;
  floor: number;
  roomNumbers: string[];
  status: RoomStatus;
}

export interface BulkUpdateStatusRequest {
  roomIds: number[];
  status: RoomStatus;
  notes?: string;
}

export interface BulkOperationResponse {
  successCount: number;
  failureCount: number;
  totalCount: number;
  successMessages: string[];
  errorMessages: string[];
  allSuccessful: boolean;
}

export interface PropertyStatistics {
  totalRoomTypes: number;
  activeRoomTypes: number;
  inactiveRoomTypes: number;
  totalRooms: number;
  readyRooms: number;
  occupiedRooms: number;
  cleaningRooms: number;
  maintenanceRooms: number;
  outOfOrderRooms: number;
  totalFloors: number;
  roomsPerFloor: number;
  availabilityRate: number;
  maintenanceRate: number;
}

export interface FloorUpdateResponse {
  message: string;
  count: number;
}

// Common amenities for room types
export const COMMON_AMENITIES = [
  "WiFi",
  "TV",
  "Mini Bar",
  "Air Conditioning",
  "Safe",
  "Hair Dryer",
  "Coffee Maker",
  "Balcony",
  "Sea View",
  "City View",
  "Bathtub",
  "Shower",
  "Work Desk",
  "Sofa",
  "Kitchen",
  "Smart TV",
  "Jacuzzi",
  "Living Room",
  "Microwave",
  "Refrigerator"
] as const;

export const ROOM_STATUS_LABELS: Record<RoomStatus, string> = {
  [RoomStatus.READY]: "Ready",
  [RoomStatus.CLEANING]: "Cleaning",
  [RoomStatus.MAINTENANCE]: "Maintenance",
  [RoomStatus.OCCUPIED]: "Occupied",
  [RoomStatus.OUT_OF_ORDER]: "Out of Order"
};

export const ROOM_STATUS_COLORS: Record<RoomStatus, string> = {
  [RoomStatus.READY]: "text-green-600 border-green-600",
  [RoomStatus.CLEANING]: "text-blue-600 border-blue-600",
  [RoomStatus.MAINTENANCE]: "text-orange-600 border-orange-600",
  [RoomStatus.OCCUPIED]: "text-purple-600 border-purple-600",
  [RoomStatus.OUT_OF_ORDER]: "text-red-600 border-red-600"
};
