import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { 
  ApiResponse, 
  RequestConfig,
  UploadResponse,
  MappingResult,
  MappingRequest,
  ComplianceReport,
  ComplianceRequest,
  PolicySimulation,
  PolicyRequest,
  ExportResponse,
  ExportRequest
} from '../types/api';
import { logger } from '../utils/logger';

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public field?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        logger.debug('API Request', {
          method: config.method?.toUpperCase(),
          url: config.url,
          headers: config.headers,
        });
        return config;
      },
      (error) => {
        logger.error('API Request Error', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        logger.debug('API Response', {
          status: response.status,
          url: response.config.url,
          data: response.data,
        });
        return response;
      },
      (error) => {
        const apiError = this.handleError(error);
        logger.error('API Response Error', {
          status: error.response?.status,
          url: error.config?.url,
          message: apiError.message,
        });
        return Promise.reject(apiError);
      }
    );
  }

  private handleError(error: any): ApiError {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      const message = data?.message || data?.error || 'An error occurred';
      return new ApiError(message, status, data?.code, data?.field);
    } else if (error.request) {
      // Network error
      return new ApiError('Network error - please check your connection', 0);
    } else {
      // Other error
      return new ApiError(error.message || 'Unknown error occurred');
    }
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    const axiosConfig: AxiosRequestConfig = {
      method,
      url,
      timeout: config?.timeout,
      headers: config?.headers,
    };

    if (data) {
      axiosConfig.data = data;
    }

    const response = await this.client.request<ApiResponse<T>>(axiosConfig);
    return response.data.data;
  }

  // File Upload Methods
  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post<ApiResponse<UploadResponse>>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data.data;
  }

  // Mapping Methods
  async generateMappings(request: MappingRequest): Promise<MappingResult> {
    return this.request<MappingResult>('POST', '/mappings/generate', request);
  }

  async saveMappings(fileId: string, mappings: any[]): Promise<void> {
    return this.request<void>('POST', `/mappings/${fileId}/save`, { mappings });
  }

  async getMappings(fileId: string): Promise<MappingResult> {
    return this.request<MappingResult>('GET', `/mappings/${fileId}`);
  }

  // Compliance Methods
  async checkCompliance(request: ComplianceRequest): Promise<ComplianceReport> {
    return this.request<ComplianceReport>('POST', '/compliance/check', request);
  }

  async getComplianceReport(fileId: string): Promise<ComplianceReport> {
    return this.request<ComplianceReport>('GET', `/compliance/report/${fileId}`);
  }

  // Policy Methods
  async simulatePolicies(request: PolicyRequest): Promise<PolicySimulation> {
    return this.request<PolicySimulation>('POST', '/policies/simulate', request);
  }

  // Export Methods
  async exportData(request: ExportRequest): Promise<ExportResponse> {
    return this.request<ExportResponse>('POST', '/export', request);
  }

  async downloadFile(downloadUrl: string): Promise<Blob> {
    const response = await this.client.get(downloadUrl, {
      responseType: 'blob',
    });
    return response.data;
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('GET', '/health');
  }

  // File Management
  async deleteFile(fileId: string): Promise<void> {
    return this.request<void>('DELETE', `/files/${fileId}`);
  }

  async getFileInfo(fileId: string): Promise<UploadResponse> {
    return this.request<UploadResponse>('GET', `/files/${fileId}`);
  }

  // Utility Methods
  getBaseURL(): string {
    return this.baseURL;
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      logger.warn('API connection test failed', error);
      return false;
    }
  }
}

// Create and export singleton instance
export const apiService = new ApiService();
export default apiService;

// Export error class for custom error handling
export { ApiError }; 