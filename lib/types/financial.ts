export interface FinancialDashboard {
  todayRevenue: number;
  todayExpenses: number;
  todayBookings: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  todayOccupancyRate: number;
  monthToDateRevenue: number;
  monthToDateExpenses: number;
  monthToDateBookings: number;
  monthToDateOccupancyRate: number;
  yearToDateRevenue: number;
  yearToDateExpenses: number;
  yearToDateBookings: number;
  yearToDateOccupancyRate: number;
  totalUnpaidAmount: number;
  unpaidBookingsCount: number;
  revenueGrowthPercentage: number;
  occupancyGrowthPercentage: number;
}

export interface DailyRevenueDTO {
  date: string;
  totalRevenue: number;
  roomRevenue: number;
  serviceRevenue: number;
  bookingsCount: number;
  checkInsCount: number;
  checkOutsCount: number;
  averageDailyRate: number;
  occupancyRate: number;
}

export interface RevenueReport {
  startDate: string;
  endDate: string;
  period: string;
  totalRevenue: number;
  roomRevenue: number;
  serviceRevenue: number;
  otherRevenue: number;
  totalTax: number;
  totalServiceCharges: number;
  netRevenue: number;
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  completedBookings: number;
  paidBookings: number;
  unpaidBookings: number;
  partiallyPaidBookings: number;
  totalPaidAmount: number;
  totalUnpaidAmount: number;
  averageBookingValue: number;
  averageDailyRate: number;
  revenuePerAvailableRoom: number;
  revenueByChannel?: Record<string, number>;
  revenueByRoomType?: Record<string, number>;
  dailyBreakdown?: DailyRevenueDTO[];
}

export interface ExpenseReport {
  startDate: string;
  endDate: string;
  totalExpenses: number;
  paidExpenses: number;
  unpaidExpenses: number;
  reversedExpenses: number;
  expensesByCategory?: Record<string, number>;
  totalTransactions: number;
  paidTransactions: number;
  unpaidTransactions: number;
  reversedTransactions: number;
  averageExpenseAmount: number;
  averageDailyExpenses: number;
}

export interface DailyOccupancyDTO {
  date: string;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  occupancyRate: number;
  checkIns: number;
  checkOuts: number;
}

export interface OccupancyReport {
  startDate: string;
  endDate: string;
  averageOccupancyRate: number;
  totalRooms: number;
  averageOccupiedRooms: number;
  averageAvailableRooms: number;
  totalRoomNights: number;
  occupiedRoomNights: number;
  availableRoomNights: number;
  dailyOccupancy?: DailyOccupancyDTO[];
}

export interface QuickStats {
  todayRevenue: number;
  monthRevenue: number;
  yearRevenue: number;
  generatedAt: string;
}

export type ReportPeriod = "TODAY" | "WEEK" | "MONTH" | "YEAR" | "CUSTOM";
