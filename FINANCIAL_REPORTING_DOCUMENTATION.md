# Financial Reporting & Analytics - Documentation

## Overview

The Financial Reporting & Analytics system provides comprehensive financial insights, revenue tracking, expense management, and occupancy analytics for hotel administrators. This system enables data-driven decision-making with real-time metrics and historical trend analysis.

---

## Table of Contents

1. [Architecture](#architecture)
2. [API Endpoints](#api-endpoints)
3. [Data Models](#data-models)
4. [Features](#features)
5. [Usage Examples](#usage-examples)
6. [Key Metrics](#key-metrics)

---

## Architecture

### Components

```
Controller Layer:
├── FinancialReportingController.java  # Admin-only REST endpoints

Service Layer:
├── FinancialReportingService.java     # Business logic for financial analytics

Repository Layer (Enhanced):
├── BookingRepository.java             # Financial queries for bookings
└── GuestExpenseRepository.java        # Financial queries for expenses

DTOs:
├── RevenueReportDTO.java              # Revenue report data
├── DailyRevenueDTO.java               # Daily revenue breakdown
├── ExpenseReportDTO.java              # Expense report data
├── OccupancyReportDTO.java            # Occupancy report data
├── DailyOccupancyDTO.java             # Daily occupancy breakdown
└── FinancialDashboardDTO.java         # Dashboard summary

Enums:
└── ReportPeriod.java                  # Report time periods
```

---

## API Endpoints

### Base URL
```
/api/admin/financial
```

**Note:** All endpoints require ADMIN role authentication.

---

### Dashboard

#### Get Financial Dashboard
```http
GET /api/admin/financial/dashboard
```

Returns comprehensive dashboard with:
- Today's metrics (revenue, bookings, check-ins/outs, occupancy)
- Month-to-date metrics
- Year-to-date metrics
- Pending amounts
- Growth comparisons vs previous month

**Response Example:**
```json
{
  "todayRevenue": 5420.50,
  "todayExpenses": 850.00,
  "todayBookings": 12,
  "todayCheckIns": 8,
  "todayCheckOuts": 5,
  "todayOccupancyRate": 78.5,
  "monthToDateRevenue": 125400.00,
  "monthToDateExpenses": 18500.00,
  "monthToDateBookings": 245,
  "monthToDateOccupancyRate": 82.3,
  "yearToDateRevenue": 1458900.00,
  "yearToDateExpenses": 245800.00,
  "yearToDateBookings": 3250,
  "yearToDateOccupancyRate": 79.8,
  "totalUnpaidAmount": 12400.00,
  "unpaidBookingsCount": 18,
  "revenueGrowthPercentage": 15.8,
  "occupancyGrowthPercentage": 5.2
}
```

---

### Revenue Reports

#### Custom Date Range Revenue Report
```http
GET /api/admin/financial/revenue?startDate=2026-02-01&endDate=2026-02-17
```

#### Today's Revenue
```http
GET /api/admin/financial/revenue/today
```

#### This Week's Revenue
```http
GET /api/admin/financial/revenue/week
```

#### This Month's Revenue
```http
GET /api/admin/financial/revenue/month
```

#### This Year's Revenue
```http
GET /api/admin/financial/revenue/year
```

#### Specific Month Revenue
```http
GET /api/admin/financial/revenue/month/2026/1
```

**Revenue Report Response:**
```json
{
  "startDate": "2026-02-01",
  "endDate": "2026-02-17",
  "period": "CUSTOM",
  "totalRevenue": 125400.00,
  "roomRevenue": 105200.00,
  "serviceRevenue": 20200.00,
  "otherRevenue": 0.00,
  "totalTax": 8800.00,
  "totalServiceCharges": 2500.00,
  "netRevenue": 114100.00,
  "totalBookings": 245,
  "confirmedBookings": 230,
  "cancelledBookings": 15,
  "completedBookings": 198,
  "paidBookings": 215,
  "unpaidBookings": 30,
  "partiallyPaidBookings": 0,
  "totalPaidAmount": 118900.00,
  "totalUnpaidAmount": 6500.00,
  "averageBookingValue": 511.84,
  "averageDailyRate": 457.39,
  "revenuePerAvailableRoom": 142.15,
  "revenueByChannel": {
    "DIRECT": 45600.00,
    "BOOKING_COM": 38200.00,
    "EXPEDIA": 25400.00,
    "PHONE": 16200.00
  },
  "revenueByRoomType": {
    "DELUXE": 58900.00,
    "STANDARD": 32100.00,
    "SUITE": 14200.00
  },
  "dailyBreakdown": [
    {
      "date": "2026-02-01",
      "totalRevenue": 7420.00,
      "roomRevenue": 6200.00,
      "serviceRevenue": 1220.00,
      "bookingsCount": 14,
      "checkInsCount": 9,
      "checkOutsCount": 6,
      "averageDailyRate": 442.86,
      "occupancyRate": 75.5
    }
    // ... more days
  ]
}
```

---

### Expense Reports

#### Custom Date Range Expense Report
```http
GET /api/admin/financial/expenses?startDate=2026-02-01&endDate=2026-02-17
```

#### Today's Expenses
```http
GET /api/admin/financial/expenses/today
```

#### This Month's Expenses
```http
GET /api/admin/financial/expenses/month
```

#### This Year's Expenses
```http
GET /api/admin/financial/expenses/year
```

**Expense Report Response:**
```json
{
  "startDate": "2026-02-01",
  "endDate": "2026-02-17",
  "totalExpenses": 20200.00,
  "paidExpenses": 18400.00,
  "unpaidExpenses": 1800.00,
  "reversedExpenses": 450.00,
  "expensesByCategory": {
    "ROOM_SERVICE": 8500.00,
    "MINIBAR": 4200.00,
    "LAUNDRY": 3100.00,
    "SPA": 2900.00,
    "RESTAURANT": 1500.00
  },
  "totalTransactions": 342,
  "paidTransactions": 310,
  "unpaidTransactions": 32,
  "reversedTransactions": 8,
  "averageExpenseAmount": 59.06,
  "averageDailyExpenses": 1188.24
}
```

---

### Occupancy Reports

#### Custom Date Range Occupancy Report
```http
GET /api/admin/financial/occupancy?startDate=2026-02-01&endDate=2026-02-17
```

#### Today's Occupancy
```http
GET /api/admin/financial/occupancy/today
```

#### This Month's Occupancy
```http
GET /api/admin/financial/occupancy/month
```

#### This Year's Occupancy
```http
GET /api/admin/financial/occupancy/year
```

**Occupancy Report Response:**
```json
{
  "startDate": "2026-02-01",
  "endDate": "2026-02-17",
  "averageOccupancyRate": 82.35,
  "totalRooms": 100,
  "averageOccupiedRooms": 82,
  "averageAvailableRooms": 18,
  "totalRoomNights": 1700,
  "occupiedRoomNights": 1400,
  "availableRoomNights": 300,
  "dailyOccupancy": [
    {
      "date": "2026-02-01",
      "totalRooms": 100,
      "occupiedRooms": 78,
      "availableRooms": 22,
      "occupancyRate": 78.0,
      "checkIns": 12,
      "checkOuts": 8
    }
    // ... more days
  ]
}
```

---

### Quick Stats

#### Get Quick Financial Statistics
```http
GET /api/admin/financial/stats/quick
```

**Response:**
```json
{
  "todayRevenue": 5420.50,
  "monthRevenue": 125400.00,
  "yearRevenue": 1458900.00,
  "generatedAt": "2026-02-17"
}
```

---

## Data Models

### RevenueReportDTO

Complete revenue analysis for a period:

```java
{
  "startDate": LocalDate,
  "endDate": LocalDate,
  "period": String,
  "totalRevenue": BigDecimal,
  "roomRevenue": BigDecimal,
  "serviceRevenue": BigDecimal,
  "otherRevenue": BigDecimal,
  "totalTax": BigDecimal,
  "totalServiceCharges": BigDecimal,
  "netRevenue": BigDecimal,
  "totalBookings": long,
  "confirmedBookings": long,
  "cancelledBookings": long,
  "completedBookings": long,
  "paidBookings": long,
  "unpaidBookings": long,
  "partiallyPaidBookings": long,
  "totalPaidAmount": BigDecimal,
  "totalUnpaidAmount": BigDecimal,
  "averageBookingValue": BigDecimal,
  "averageDailyRate": BigDecimal,        // ADR
  "revenuePerAvailableRoom": BigDecimal,  // RevPAR
  "revenueByChannel": Map<String, BigDecimal>,
  "revenueByRoomType": Map<String, BigDecimal>,
  "dailyBreakdown": List<DailyRevenueDTO>
}
```

### ExpenseReportDTO

Expense analysis for a period:

```java
{
  "startDate": LocalDate,
  "endDate": LocalDate,
  "totalExpenses": BigDecimal,
  "paidExpenses": BigDecimal,
  "unpaidExpenses": BigDecimal,
  "reversedExpenses": BigDecimal,
  "expensesByCategory": Map<String, BigDecimal>,
  "totalTransactions": long,
  "paidTransactions": long,
  "unpaidTransactions": long,
  "reversedTransactions": long,
  "averageExpenseAmount": BigDecimal,
  "averageDailyExpenses": BigDecimal
}
```

### OccupancyReportDTO

Occupancy analysis for a period:

```java
{
  "startDate": LocalDate,
  "endDate": LocalDate,
  "averageOccupancyRate": double,  // Percentage
  "totalRooms": int,
  "averageOccupiedRooms": int,
  "averageAvailableRooms": int,
  "totalRoomNights": long,
  "occupiedRoomNights": long,
  "availableRoomNights": long,
  "dailyOccupancy": List<DailyOccupancyDTO>
}
```

### FinancialDashboardDTO

Dashboard summary with key metrics:

```java
{
  "todayRevenue": BigDecimal,
  "todayExpenses": BigDecimal,
  "todayBookings": long,
  "todayCheckIns": long,
  "todayCheckOuts": long,
  "todayOccupancyRate": double,
  "monthToDateRevenue": BigDecimal,
  "monthToDateExpenses": BigDecimal,
  "monthToDateBookings": long,
  "monthToDateOccupancyRate": double,
  "yearToDateRevenue": BigDecimal,
  "yearToDateExpenses": BigDecimal,
  "yearToDateBookings": long,
  "yearToDateOccupancyRate": double,
  "totalUnpaidAmount": BigDecimal,
  "unpaidBookingsCount": long,
  "revenueGrowthPercentage": BigDecimal,
  "occupancyGrowthPercentage": BigDecimal
}
```

---

## Features

### ✅ Revenue Management

1. **Total Revenue Tracking**
   - Room revenue from bookings
   - Service revenue from guest expenses
   - Breakdown by booking channel
   - Breakdown by room type

2. **Payment Status Monitoring**
   - Paid vs unpaid amounts
   - Payment status tracking
   - Outstanding balance alerts

3. **Key Performance Indicators (KPIs)**
   - Average Daily Rate (ADR)
   - Revenue Per Available Room (RevPAR)
   - Average booking value
   - Net revenue (after refunds)

4. **Daily Revenue Breakdown**
   - Day-by-day revenue analysis
   - Check-in/check-out tracking
   - Occupancy rate per day
   - Service revenue trends

---

### ✅ Expense Tracking

1. **Comprehensive Expense Analysis**
   - Total expenses tracking
   - Paid vs unpaid expenses
   - Reversed/refunded expenses
   - Expense by category breakdown

2. **Transaction Analytics**
   - Transaction count tracking
   - Average expense amount
   - Daily expense trends
   - Category-wise distribution

3. **Expense Categories**
   - Room service orders
   - Minibar charges
   - Laundry services
   - Spa treatments
   - Restaurant bills
   - Other miscellaneous charges

---

### ✅ Occupancy Analytics

1. **Occupancy Rate Monitoring**
   - Real-time occupancy percentage
   - Historical occupancy trends
   - Daily occupancy breakdown
   - Room availability tracking

2. **Room Night Analysis**
   - Total room nights
   - Occupied room nights
   - Available room nights
   - Room utilization efficiency

3. **Check-In/Check-Out Tracking**
   - Daily check-ins count
   - Daily check-outs count
   - Occupancy flow visualization

---

### ✅ Financial Dashboard

1. **Real-Time Metrics**
   - Today's performance snapshot
   - Month-to-date summary
   - Year-to-date summary

2. **Growth Analysis**
   - Revenue growth vs previous month
   - Occupancy growth vs previous month
   - Trend identification

3. **Financial Health Indicators**
   - Outstanding payments
   - Unpaid bookings count
   - Cash flow monitoring

---

## Usage Examples

### Example 1: Get Financial Dashboard

```bash
curl -X GET http://localhost:8080/api/admin/financial/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Example 2: Get This Month's Revenue Report

```bash
curl -X GET http://localhost:8080/api/admin/financial/revenue/month \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Example 3: Get Custom Date Range Revenue

```bash
curl -X GET "http://localhost:8080/api/admin/financial/revenue?startDate=2026-01-01&endDate=2026-01-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Example 4: Get Occupancy Report for Specific Month

```bash
curl -X GET http://localhost:8080/api/admin/financial/occupancy/month \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Example 5: Get Today's Expenses

```bash
curl -X GET http://localhost:8080/api/admin/financial/expenses/today \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Key Metrics

### Average Daily Rate (ADR)
```
ADR = Total Room Revenue / Number of Rooms Sold
```

Indicates the average revenue earned per occupied room.

### Revenue Per Available Room (RevPAR)
```
RevPAR = Total Room Revenue / Total Available Room Nights
```

Measures revenue generation efficiency across all rooms.

### Occupancy Rate
```
Occupancy Rate = (Occupied Rooms / Total Rooms) × 100
```

Percentage of rooms occupied during a period.

### Average Booking Value
```
Average Booking Value = Total Revenue / Number of Bookings
```

Average revenue generated per booking.

---

## Features Summary

✅ **20+ Financial Endpoints**
- Revenue reports (7 endpoints)
- Expense reports (4 endpoints)
- Occupancy reports (4 endpoints)
- Dashboard & quick stats (2 endpoints)

✅ **Comprehensive Analytics**
- Daily, weekly, monthly, yearly views
- Custom date range reports
- Growth comparison analysis
- Category-wise breakdowns

✅ **Key Performance Indicators**
- ADR (Average Daily Rate)
- RevPAR (Revenue Per Available Room)
- Occupancy Rate
- Average Booking Value

✅ **Real-Time Data**
- Today's metrics
- Live dashboard updates
- Instant financial snapshots

✅ **Historical Analysis**
- Month-to-date tracking
- Year-to-date tracking
- Trend identification
- Growth percentage calculations

---

## Database Queries Implemented

### BookingRepository Enhancements
- `sumTotalPriceForPeriod` - Total booking revenue
- `countByStatusForPeriod` - Bookings by status count
- `sumPaidAmountForPeriod` - Total paid amount
- `sumUnpaidAmountForPeriod` - Total unpaid amount
- `sumByChannelForPeriod` - Revenue by channel
- `countCheckInsForDate` - Check-ins for specific date
- `countCheckOutsForDate` - Check-outs for specific date
- `countActiveBookingsForDate` - Active bookings count

### GuestExpenseRepository Enhancements
- `sumTotalForPeriod` - Total expenses
- `sumPaidForPeriod` - Paid expenses
- `sumReversedForPeriod` - Reversed expenses
- `sumByCategoryForPeriod` - Expenses by category
- `countForPeriod` - Transaction count
- `countPaidForPeriod` - Paid transaction count

---

## Future Enhancements

### Recommended Features

1. **Export Functionality**
   - PDF report generation
   - Excel export
   - CSV export for data analysis

2. **Advanced Analytics**
   - Predictive revenue forecasting
   - Seasonal trend analysis
   - Year-over-year comparisons
   - Profit margin analysis

3. **Visualization**
   - Revenue trend charts
   - Occupancy heatmaps
   - Booking source pie charts
   - Performance dashboards

4. **Budgeting & Forecasting**
   - Budget vs actual comparison
   - Revenue targets
   - Performance alerts
   - Variance analysis

5. **Tax Reporting**
   - Tax summaries by period
   - VAT/GST breakdowns
   - Tourism tax reports
   - Compliance reports

6. **Commission Tracking**
   - OTA commission calculations
   - Net revenue after commissions
   - Channel profitability analysis

7. **Custom Reports**
   - User-defined report templates
   - Scheduled report delivery
   - Email report distribution
   - Report bookmarking

---

## Conclusion

The Financial Reporting & Analytics system provides hotel administrators with powerful tools to monitor financial performance, track revenue streams, analyze expenses, and optimize occupancy rates. With real-time dashboards and comprehensive reporting capabilities, decision-makers can make informed choices to maximize profitability and operational efficiency.

---

**Last Updated:** February 17, 2026  
**Version:** 1.0.0  
**Status:** ✅ Complete & Production Ready
