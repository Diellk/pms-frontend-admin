import type {
  FinancialDashboard,
  RevenueReport,
  ExpenseReport,
  OccupancyReport,
  QuickStats,
} from "@/lib/types/financial";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const FINANCIAL_ENDPOINT = `${API_BASE_URL}/api/admin/financial`;

// Helper function to get auth token
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

// Helper function to create headers with auth
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export const financialApi = {
  // Dashboard
  async getDashboard(): Promise<FinancialDashboard> {
    const response = await fetch(`${FINANCIAL_ENDPOINT}/dashboard`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<FinancialDashboard>(response);
  },

  // Quick Stats
  async getQuickStats(): Promise<QuickStats> {
    const response = await fetch(`${FINANCIAL_ENDPOINT}/stats/quick`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<QuickStats>(response);
  },

  // Revenue Reports
  async getRevenueReport(startDate: string, endDate: string): Promise<RevenueReport> {
    const response = await fetch(
      `${FINANCIAL_ENDPOINT}/revenue?startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );
    return handleResponse<RevenueReport>(response);
  },

  async getTodayRevenue(): Promise<RevenueReport> {
    const response = await fetch(`${FINANCIAL_ENDPOINT}/revenue/today`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<RevenueReport>(response);
  },

  async getWeekRevenue(): Promise<RevenueReport> {
    const response = await fetch(`${FINANCIAL_ENDPOINT}/revenue/week`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<RevenueReport>(response);
  },

  async getMonthRevenue(): Promise<RevenueReport> {
    const response = await fetch(`${FINANCIAL_ENDPOINT}/revenue/month`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<RevenueReport>(response);
  },

  async getYearRevenue(): Promise<RevenueReport> {
    const response = await fetch(`${FINANCIAL_ENDPOINT}/revenue/year`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<RevenueReport>(response);
  },

  async getMonthRevenueByDate(year: number, month: number): Promise<RevenueReport> {
    const response = await fetch(`${FINANCIAL_ENDPOINT}/revenue/month/${year}/${month}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<RevenueReport>(response);
  },

  // Expense Reports
  async getExpenseReport(startDate: string, endDate: string): Promise<ExpenseReport> {
    const response = await fetch(
      `${FINANCIAL_ENDPOINT}/expenses?startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );
    return handleResponse<ExpenseReport>(response);
  },

  async getTodayExpenses(): Promise<ExpenseReport> {
    const response = await fetch(`${FINANCIAL_ENDPOINT}/expenses/today`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<ExpenseReport>(response);
  },

  async getMonthExpenses(): Promise<ExpenseReport> {
    const response = await fetch(`${FINANCIAL_ENDPOINT}/expenses/month`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<ExpenseReport>(response);
  },

  async getYearExpenses(): Promise<ExpenseReport> {
    const response = await fetch(`${FINANCIAL_ENDPOINT}/expenses/year`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<ExpenseReport>(response);
  },

  // Occupancy Reports
  async getOccupancyReport(startDate: string, endDate: string): Promise<OccupancyReport> {
    const response = await fetch(
      `${FINANCIAL_ENDPOINT}/occupancy?startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );
    return handleResponse<OccupancyReport>(response);
  },

  async getTodayOccupancy(): Promise<OccupancyReport> {
    const response = await fetch(`${FINANCIAL_ENDPOINT}/occupancy/today`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<OccupancyReport>(response);
  },

  async getMonthOccupancy(): Promise<OccupancyReport> {
    const response = await fetch(`${FINANCIAL_ENDPOINT}/occupancy/month`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<OccupancyReport>(response);
  },

  async getYearOccupancy(): Promise<OccupancyReport> {
    const response = await fetch(`${FINANCIAL_ENDPOINT}/occupancy/year`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<OccupancyReport>(response);
  },
};
