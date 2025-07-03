import {
  UploadFile,
  SmartToy,
  Policy,
  Security,
  FileDownload,
  Speed,
  Insights,
  AutoAwesome,
  TrendingUp,
  Shield,
  AccountBalance,
} from '@mui/icons-material';

// ========== APP CONFIGURATION ==========

export const APP_CONFIG = {
  name: 'SmartPayMap',
  tagline: 'AI-Powered Payroll Data Mapping',
  description: 'Streamline your payroll operations with automated mapping, compliance checking, and data transformation.',
  contactEmail: 'info@smartpaymap.com',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  supportedFileTypes: ['.csv', '.xlsx', '.xls'],
  apiBaseUrl: '/api',
  version: '1.0.0',
  author: 'SmartPayMap Team',
  url: 'https://smartpaymap.com',
} as const;

// ========== API CONFIGURATION ==========

export const API_CONFIG = {
  baseUrl: import.meta.env.PROD 
    ? 'https://api.smartpaymap.com' 
    : 'http://localhost:8000',
  timeout: 10000,
  retryAttempts: 3,
} as const;

// ========== ROUTES ==========

export const ROUTES = {
  HOME: '/',
  MAPPING: '/mapping',
  COMPLIANCE: '/compliance',
  SKILLS: '/skills',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
} as const;

// ========== NAVIGATION ITEMS ==========

export const NAVIGATION_ITEMS = [
  { label: 'Home', path: ROUTES.HOME },
  { label: 'Mapping', path: ROUTES.MAPPING },
  { label: 'Compliance', path: ROUTES.COMPLIANCE },
  { label: 'Skills', path: ROUTES.SKILLS },
] as const;

// ========== TECHNOLOGY STACK ==========

export const TECHNOLOGIES = [
  { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', color: '#61dafb' },
  { name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', color: '#3178c6' },
  { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', color: '#3776ab' },
  { name: 'FastAPI', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg', color: '#009688' },
  { name: 'Material-UI', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg', color: '#0081cb' },
  { name: 'OpenAI', logo: 'https://static.vecteezy.com/system/resources/previews/022/227/364/non_2x/openai-chatgpt-logo-icon-free-png.png', color: '#412991' },
  { name: 'Pandas', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg', color: '#150458' },
  { name: 'Uvicorn', logo: 'https://www.uvicorn.org/uvicorn.png', color: '#ff6b6b' },
  { name: 'Vite', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg', color: '#646cff' },
  { name: 'Node.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', color: '#339933' },
  { name: 'Git', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', color: '#f05032' },
  { name: 'Docker', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', color: '#2496ed' },
] as const;

// ========== FEATURES ==========

export const FEATURES = [
  {
    title: 'Data Transformation',
    description: 'Transform payroll data between formats with our intelligent conversion engine that preserves data integrity and relationships.',
    icon: "AutoAwesome",
    gradient: '#ec4899, #831843',
  },
  {
    title: 'Policy Simulation',
    description: 'Test different payroll policies and see their effects before implementation, making strategic decisions with confidence.',
    icon: "Policy",
    gradient: '#14b8a6, #134e4a',
  },
  {
    title: 'Compliance Monitoring',
    description: 'Real-time monitoring of compliance status across regions with visual dashboards highlighting potential issues.',
    icon: "Security",
    gradient: '#f59e0b, #92400e',
  },
  {
    title: 'Export Flexibility',
    description: 'Export mapped data in multiple formats compatible with popular payroll systems and accounting software.',
    icon: "FileDownload",
    gradient: '#10b981, #065f46',
  },
] as const;

// ========== SHOWCASE ITEMS ==========

export const SHOWCASE_ITEMS = [
  {
    title: 'AI-Powered Mapping',
    description: 'Transform complex payroll data into standardized formats using advanced machine learning.',
    features: ['95% accuracy rate', 'Real-time processing', 'Multi-format support'],
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    title: 'Real-time Analytics',
    description: 'Get instant insights with interactive dashboards and live data visualization.',
    features: ['Live dashboards', 'Custom reports', 'Data export'],
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    title: 'Global Compliance',
    description: 'Ensure regulatory compliance across 50+ countries with automated checks.',
    features: ['50+ countries', 'Automated compliance', 'Risk assessment'],
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    title: 'Modern UI/UX',
    description: 'Beautiful, intuitive interface designed for maximum productivity and ease of use.',
    features: ['Responsive design', 'Dark/light themes', 'Accessibility'],
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  {
    title: 'Scalable Architecture',
    description: 'Cloud-native infrastructure that scales automatically with your data needs.',
    features: ['Auto-scaling', 'High availability', 'Load balancing'],
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  {
    title: 'Data Security',
    description: 'Enterprise-grade security with encryption and compliance certifications.',
    features: ['End-to-end encryption', 'SOC 2 compliant', 'Zero-trust security'],
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  },
] as const;

// ========== THEME CONSTANTS ==========

export const THEME_CONSTANTS = {
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4',
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  shadows: {
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
} as const;

// ========== ANIMATION CONSTANTS ==========

export const ANIMATIONS = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 800,
  },
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// ========== BREAKPOINTS ==========

export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;

// ========== FORM VALIDATION ==========

export const VALIDATION_PATTERNS = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  phone: /^\+?[\d\s\-\(\)]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  url: /^https?:\/\/.+\..+/,
} as const;

// ========== FILE UPLOAD ==========

export const FILE_UPLOAD = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  allowedExtensions: ['.csv', '.xls', '.xlsx'],
} as const;

// ========== LOCAL STORAGE KEYS ==========

export const STORAGE_KEYS = {
  theme: 'smartpaymap_theme',
  user: 'smartpaymap_user',
  preferences: 'smartpaymap_preferences',
  recentFiles: 'smartpaymap_recent_files',
} as const;

// ========== ERROR MESSAGES ==========

export const ERROR_MESSAGES = {
  general: 'An unexpected error occurred. Please try again.',
  network: 'Network error. Please check your connection.',
  validation: 'Please check your input and try again.',
  unauthorized: 'You are not authorized to perform this action.',
  notFound: 'The requested resource was not found.',
  serverError: 'Server error. Please try again later.',
  fileUpload: 'File upload failed. Please try again.',
  fileTooLarge: 'File size exceeds the maximum limit.',
  invalidFileType: 'Invalid file type. Please upload a CSV or Excel file.',
} as const;

// ========== SUCCESS MESSAGES ==========

export const SUCCESS_MESSAGES = {
  fileSaved: 'File saved successfully!',
  dataProcessed: 'Data processed successfully!',
  mappingCompleted: 'Mapping completed successfully!',
  complianceChecked: 'Compliance check completed!',
  settingsUpdated: 'Settings updated successfully!',
} as const;

// ========== NAVIGATION LINKS ==========

export const NAV_LINKS = [
  { title: 'Home', path: ROUTES.HOME },
  { title: 'Mapping', path: ROUTES.MAPPING },
  { title: 'Compliance', path: ROUTES.COMPLIANCE },
  { title: 'Skills', path: ROUTES.SKILLS },
] as const;

// ========== ICON MAP ==========

export const ICON_MAP = {
  SmartToy,
  Shield,
  AutoAwesome,
  Policy,
  Security,
  FileDownload,
  Speed,
  Insights,
  TrendingUp,
  AccountBalance,
  UploadFile
}; 