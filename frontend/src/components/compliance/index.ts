export { default as HeatmapHeader } from './HeatmapHeader';
export { default as CountryRiskCard } from './CountryRiskCard';
export { default as HeatmapGrid } from './HeatmapGrid';
export { default as LoadingState } from './LoadingState';
export { default as ErrorState } from './ErrorState';

// Types
export interface CountryRisk {
  country: string;
  risk: string;
  level: string;
  config: any;
}

export const RISK_LEVELS = {
  'Low Risk': {
    color: '#059669',
    bgColor: '#10b981',
    borderColor: '#10b981',
    icon: '🟢',
    priority: 1
  },
  'Medium Risk': {
    color: '#d97706',
    bgColor: '#f59e0b',
    borderColor: '#f59e0b',
    icon: '🟡',
    priority: 2
  },
  'Moderate': {
    color: '#d97706',
    bgColor: '#f59e0b',
    borderColor: '#f59e0b',
    icon: '🟡',
    priority: 2
  },
  'High Risk': {
    color: '#dc2626',
    bgColor: '#ef4444',
    borderColor: '#ef4444',
    icon: '🔴',
    priority: 3
  }
}; 