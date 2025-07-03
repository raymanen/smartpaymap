// Base API Response Structure
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: 'success' | 'error';
  timestamp?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Upload Types
export interface UploadResponse {
  fileId: string;
  filename: string;
  size: number;
  type: string;
  uploadedAt: string;
  previewData?: {
    headers: string[];
    rows: Record<string, any>[];
    totalRows: number;
  };
}

// Mapping Types
export interface FieldMapping {
  sourceField: string;
  targetField: string;
  transformation?: string;
  confidence: number;
  required: boolean;
}

export interface MappingResult {
  mappings: FieldMapping[];
  unmappedFields: string[];
  confidence: number;
  suggestions: FieldMapping[];
}

export interface MappingRequest {
  fileId: string;
  targetSchema: string;
  customMappings?: Partial<FieldMapping>[];
}

// Compliance Types
export interface ComplianceCheck {
  ruleId: string;
  ruleName: string;
  status: 'passed' | 'failed' | 'warning';
  message: string;
  field?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestion?: string;
}

export interface ComplianceReport {
  fileId: string;
  jurisdiction: string;
  overallStatus: 'compliant' | 'non-compliant' | 'warnings';
  score: number;
  checks: ComplianceCheck[];
  generatedAt: string;
}

export interface ComplianceRequest {
  fileId: string;
  jurisdiction: string;
  mappings: FieldMapping[];
}

// Policy Types
export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  type: 'validation' | 'transformation' | 'calculation';
  expression: string;
  enabled: boolean;
  priority: number;
}

export interface PolicySimulation {
  rules: PolicyRule[];
  results: {
    ruleId: string;
    affected: number;
    changes: Array<{
      field: string;
      oldValue: any;
      newValue: any;
      rowIndex: number;
    }>;
  }[];
}

export interface PolicyRequest {
  fileId: string;
  rules: PolicyRule[];
  mappings: FieldMapping[];
}

// Export Types
export interface ExportRequest {
  fileId: string;
  format: 'csv' | 'xlsx' | 'json' | 'xml';
  mappings: FieldMapping[];
  transformations?: string[];
  filename?: string;
}

export interface ExportResponse {
  downloadUrl: string;
  filename: string;
  size: number;
  expiresAt: string;
}

// Analytics Types
export interface AnalyticsData {
  totalFiles: number;
  totalMappings: number;
  averageAccuracy: number;
  mostUsedTransformations: Array<{
    name: string;
    count: number;
  }>;
  complianceByJurisdiction: Array<{
    jurisdiction: string;
    passRate: number;
  }>;
}

// User/Session Types (if authentication is added later)
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'viewer';
  preferences: {
    defaultJurisdiction?: string;
    theme?: 'light' | 'dark';
    notifications?: boolean;
  };
}

export interface Session {
  token: string;
  user: User;
  expiresAt: string;
}

// WebSocket Types (for real-time updates)
export interface WebSocketMessage<T = any> {
  type: string;
  data: T;
  timestamp: string;
  id?: string;
}

export interface ProcessingUpdate {
  fileId: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  stage: string;
  message?: string;
}

// HTTP Client Types
export interface RequestConfig {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

export interface HttpClient {
  get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>;
  put<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>;
  delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  upload<T>(url: string, file: File, config?: RequestConfig): Promise<ApiResponse<T>>;
} 