
const API_BASE_URL = 'https://pharmamind-api-713737165318.us-central1.run.app';

export interface DashboardMetrics {
  title: string;
  value: string;
  unit: string;
  change: string;
  trend: 'up' | 'down';
  color: string;
}

export interface ProductionChartData {
  time: string;
  production: number;
  quality: number;
  target: number;
}

export interface BatchData {
  id: string;
  product: string;
  status: string;
  progress: number;
  startTime: string;
  estimatedEnd: string;
  quality: number | null;
  production: number | null;
  drug_release: number;
  compression_force: number;
  api_content: number;
}

export interface QualityMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Existing API functions
export const pharmaApi = {
  // Dashboard metrics
  getDashboardMetrics: async () => {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/metrics`);
    if (!response.ok) throw new Error('Failed to fetch dashboard metrics');
    return response.json();
  },

  // Production chart data
  getProductionChart: async () => {
    const response = await fetch(`${API_BASE_URL}/api/production/chart`);
    if (!response.ok) throw new Error('Failed to fetch production chart data');
    return response.json();
  },

  // Quality metrics
  getQualityMetrics: async () => {
    const response = await fetch(`${API_BASE_URL}/api/quality/metrics`);
    if (!response.ok) throw new Error('Failed to fetch quality metrics');
    return response.json();
  },

  // Batches
  getBatches: async (limit: number = 10) => {
    const response = await fetch(`${API_BASE_URL}/api/batches?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch batches');
    return response.json();
  },

  // NEW: Production Line Management
  // Get all production lines
  getProductionLines: async () => {
    const response = await fetch(`${API_BASE_URL}/api/production-lines`);
    if (!response.ok) throw new Error('Failed to fetch production lines');
    return response.json();
  },

  // Get metrics for a specific production line (real-time)
  getProductionLineMetrics: async (lineId: number) => {
    const response = await fetch(`${API_BASE_URL}/api/realtime/production-line/${lineId}/metrics`);
    if (!response.ok) throw new Error(`Failed to fetch metrics for production line ${lineId}`);
    return response.json();
  },

  // Get real-time metrics for a specific production line (alias for compatibility)
  getRealtimeProductionLineMetrics: async (lineId: number) => {
    const response = await fetch(`${API_BASE_URL}/api/realtime/production-line/${lineId}/metrics`);
    if (!response.ok) throw new Error(`Failed to fetch metrics for production line ${lineId}`);
    return response.json();
  },

  // Get batches for a specific production line
  getProductionLineBatches: async (lineId: number, limit: number = 10) => {
    const response = await fetch(`${API_BASE_URL}/api/production-lines/${lineId}/batches?limit=${limit}`);
    if (!response.ok) throw new Error(`Failed to fetch batches for production line ${lineId}`);
    return response.json();
  },

  // Get chart data for a specific production line
  getProductionLineChart: async (lineId: number) => {
    const response = await fetch(`${API_BASE_URL}/api/production-lines/${lineId}/chart`);
    if (!response.ok) throw new Error(`Failed to fetch chart data for production line ${lineId}`);
    return response.json();
  },

  // NEW: Real-time Time-Series API Functions
  // Get real-time simulation status
  getRealtimeStatus: async () => {
    const response = await fetch(`${API_BASE_URL}/api/realtime/status`);
    if (!response.ok) throw new Error('Failed to fetch real-time status');
    return response.json();
  },

  // Get real-time data for a specific file
  getRealtimeData: async (fileNumber: number) => {
    const response = await fetch(`${API_BASE_URL}/api/realtime/data/${fileNumber}`);
    if (!response.ok) throw new Error(`Failed to fetch real-time data for file ${fileNumber}`);
    return response.json();
  }
};
