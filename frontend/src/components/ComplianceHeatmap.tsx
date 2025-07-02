import React, { useState, useEffect, useMemo, memo } from 'react';

// Simplified risk level configuration for better performance
const RISK_LEVELS = {
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

interface CountryRisk {
  country: string;
  risk: string;
  level: string;
  config: typeof RISK_LEVELS[keyof typeof RISK_LEVELS];
}

const ComplianceHeatmap: React.FC = memo(() => {
  const [complianceData, setComplianceData] = useState<CountryRisk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

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
            config: (RISK_LEVELS as Record<string, any>)[level] || RISK_LEVELS['Medium Risk']
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

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        minHeight: '300px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f4f6',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '16px'
        }} />
        <p style={{
          color: '#6b7280',
          fontSize: '16px',
          fontWeight: '500'
        }}>
          Loading compliance intelligence...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <div style={{
          padding: '24px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#dc2626',
            fontSize: '16px',
            fontWeight: '600',
            margin: '0 0 8px 0'
          }}>
            Error Loading Data
          </p>
          <p style={{
            color: '#6b7280',
            fontSize: '14px',
            margin: '0 0 16px 0'
          }}>
            {error}
          </p>
          <button
            onClick={fetchComplianceData}
            style={{
              padding: '8px 16px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '0 20px',
      maxWidth: '100%',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#1e293b',
          marginBottom: '8px'
        }}>
          🗺️ Global Risk Intelligence
        </h2>
      </div>

      {/* Stats Dashboard - Simplified */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginBottom: '32px',
        flexWrap: 'wrap'
      }}>
        {[
          { label: 'High Risk', value: stats.high, color: '#ef4444' },
          { label: 'Medium Risk', value: stats.medium, color: '#f59e0b' },
          { label: 'Low Risk', value: stats.low, color: '#10b981' },
          { label: 'Total Countries', value: stats.total, color: '#6366f1' }
        ].map((stat, index) => (
          <div
            key={index}
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              flex: '1',
              minWidth: '150px',
              maxWidth: '200px',
              transition: 'all 0.3s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = stat.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: stat.color,
              marginBottom: '4px'
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#64748b',
              fontWeight: '500'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Buttons */}
      <div style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        {[
          { key: 'all', label: 'All Countries' },
          { key: 'High Risk', label: 'High Risk' },
          { key: 'Medium Risk', label: 'Medium Risk' },
          { key: 'Low Risk', label: 'Low Risk' }
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setSelectedFilter(filter.key)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              background: selectedFilter === filter.key ? '#3b82f6' : '#ffffff',
              color: selectedFilter === filter.key ? 'white' : '#64748b',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (selectedFilter !== filter.key) {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedFilter !== filter.key) {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Compliance Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {filteredData.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '40px 20px',
            color: '#6b7280',
            fontSize: '16px'
          }}>
            No countries match the selected filter
          </div>
        ) : (
          filteredData.map((item) => (
            <div
              key={item.country}
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #e2e8f0',
                position: 'relative',
                transition: 'all 0.3s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.borderColor = item.config.borderColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              {/* Risk Level Indicator */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: item.config.bgColor,
                borderRadius: '12px 12px 0 0'
              }} />

              {/* Country Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1e293b',
                    marginBottom: '4px',
                    margin: 0
                  }}>
                    {item.country}
                  </h3>
                  <div style={{
                    fontSize: '12px',
                    color: '#64748b',
                    fontWeight: '500'
                  }}>
                    Jurisdiction Assessment
                  </div>
                </div>
                
                {/* Risk Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  background: item.config.bgColor,
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: '600'
                }}>
                  {item.level}
                </div>
              </div>

              {/* Risk Details */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid #f1f5f9'
              }}>
                <div style={{
                  fontSize: '13px',
                  color: '#475569',
                  lineHeight: '1.5'
                }}>
                  {item.risk}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Refresh Button */}
      <div style={{
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <button
          onClick={fetchComplianceData}
          style={{
            padding: '12px 24px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.background = '#2563eb';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = '#3b82f6';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(59, 130, 246, 0.3)';
          }}
        >
          🔄 Refresh Intelligence
        </button>
      </div>
    </div>
  );
});

export default ComplianceHeatmap; 