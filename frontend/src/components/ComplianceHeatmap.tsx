import React, { useState, useEffect, useMemo, memo } from 'react';
import { Box, Container, useTheme } from '@mui/material';
import {
  HeatmapHeader,
  HeatmapGrid,
  LoadingState,
  ErrorState,
  CountryRisk,
  RISK_LEVELS
} from './compliance';

// Simplified risk level configuration for better performance
const RISK_LEVELS_CONFIG = {
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

interface ComplianceData {
  compliance_heatmap: Record<string, string>;
}

const ComplianceHeatmap: React.FC = memo(() => {
  const [complianceData, setComplianceData] = useState<CountryRisk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const theme = useTheme();

  // Parse risk level from risk string - memoized
  const parseRiskLevel = useMemo(() => (riskText: string): string => {
    const riskLower = riskText.toLowerCase();
    if (riskLower.includes('high')) return 'High Risk';
    if (riskLower.includes('moderate') || riskLower.includes('medium')) return 'Medium Risk';
    if (riskLower.includes('low')) return 'Low Risk';
    return 'Medium Risk';
  }, []);

  // Fetch compliance data from backend
  const fetchComplianceData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/compliance_heatmap');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ComplianceData = await response.json();
      
      const transformedData: CountryRisk[] = Object.entries(data.compliance_heatmap)
        .map(([country, risk]) => {
          const level = parseRiskLevel(risk);
          return {
            country,
            risk,
            level,
            config: (RISK_LEVELS_CONFIG as Record<string, any>)[level] || RISK_LEVELS_CONFIG['Medium Risk']
          };
        })
        .sort((a, b) => {
          if (a.config.priority !== b.config.priority) {
            return b.config.priority - a.config.priority;
          }
          return a.country.localeCompare(b.country);
        });

      setComplianceData(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch compliance data');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchComplianceData();
  }, []);

  // Filter data based on selected filter - memoized
  const filteredData = useMemo(() => {
    if (selectedFilter === 'all') return complianceData;
    return complianceData.filter(item => item.level === selectedFilter);
  }, [complianceData, selectedFilter]);

  // Get summary statistics - memoized
  const stats = useMemo(() => ({
    total: complianceData.length,
    high: complianceData.filter(item => item.level === 'High Risk').length,
    medium: complianceData.filter(item => item.level === 'Medium Risk').length,
    low: complianceData.filter(item => item.level === 'Low Risk').length
  }), [complianceData]);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const handleCountryClick = (country: string) => {
    console.log(`Country clicked: ${country}`);
    // Implement country detail view if needed
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchComplianceData} />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: theme.shadows[1],
        p: { xs: 2, md: 4 }
      }}>
        <HeatmapHeader 
          stats={stats}
          selectedFilter={selectedFilter}
          onFilterChange={handleFilterChange}
        />
        
        <HeatmapGrid 
          countries={filteredData}
          onCountryClick={handleCountryClick}
        />
      </Box>
    </Container>
  );
});

ComplianceHeatmap.displayName = 'ComplianceHeatmap';

export default ComplianceHeatmap; 