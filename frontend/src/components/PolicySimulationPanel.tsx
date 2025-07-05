import React, { useState } from 'react';
import { API_CONFIG } from '../constants';

// Country data with default currencies
const COUNTRIES = [
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'UK', name: 'United Kingdom', currency: 'GBP' },
  { code: 'DE', name: 'Germany', currency: 'EUR' },
  { code: 'FR', name: 'France', currency: 'EUR' },
  { code: 'JP', name: 'Japan', currency: 'JPY' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
  { code: 'AU', name: 'Australia', currency: 'AUD' },
  { code: 'SG', name: 'Singapore', currency: 'SGD' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR' },
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'SGD', 'CHF', 'SEK', 'NOK'];

interface PolicyChange {
  target_country: string;
  new_currency: string;
  adjusted_salary?: number;
  notes: string;
}

interface SimulationRequest {
  headers: string[];
  rows: string[][];
  policy_change: PolicyChange;
}

interface SimulationResponse {
  impact_summary: string;
  cost_analysis: {
    estimated_change: string;
    currency_impact: string;
    tax_implications: string;
  };
  compliance_notes: string[];
  recommendations: string[];
}

interface PolicySimulationPanelProps {
  headers: string[];
  rows: string[][];
}

const PolicySimulationPanel: React.FC<PolicySimulationPanelProps> = ({ headers, rows }) => {
  // Form state
  const [targetCountry, setTargetCountry] = useState<string>('');
  const [newCurrency, setNewCurrency] = useState<string>('');
  const [adjustedSalary, setAdjustedSalary] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResponse | null>(null);
  const [error, setError] = useState<string>('');

  // Handle country selection and auto-set default currency
  const handleCountryChange = (countryCode: string) => {
    setTargetCountry(countryCode);
    const selectedCountry = COUNTRIES.find(c => c.code === countryCode);
    if (selectedCountry && !newCurrency) {
      setNewCurrency(selectedCountry.currency);
    }
  };

  // Handle form submission
  const handleSimulate = async () => {
    if (!targetCountry) {
      setError('Please select a target country');
      return;
    }

    setIsLoading(true);
    setError('');
    setSimulationResult(null);

    const payload: SimulationRequest = {
      headers,
      rows,
      policy_change: {
        target_country: targetCountry,
        new_currency: newCurrency,
        adjusted_salary: adjustedSalary ? parseFloat(adjustedSalary) : undefined,
        notes: notes.trim()
      }
    };

    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/simulate_policy_impact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: SimulationResponse = await response.json();
      setSimulationResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to simulate policy impact');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setTargetCountry('');
    setNewCurrency('');
    setAdjustedSalary('');
    setNotes('');
    setSimulationResult(null);
    setError('');
  };

  const selectedCountryName = COUNTRIES.find(c => c.code === targetCountry)?.name;

  return (
    <div style={{ 
      padding: '24px', 
      border: '1px solid #e5e7eb', 
      borderRadius: '8px', 
      backgroundColor: '#f9fafb',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h2 style={{ 
        fontSize: '24px', 
        fontWeight: 'bold', 
        marginBottom: '16px',
        color: '#1f2937'
      }}>
        Policy Simulation
      </h2>
      
      <p style={{ 
        color: '#6b7280', 
        marginBottom: '24px',
        fontSize: '14px'
      }}>
        Simulate the impact of policy changes on your payroll data with AI-powered analysis.
      </p>

      {/* Form */}
      <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
        {/* Target Country */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            marginBottom: '4px',
            color: '#374151'
          }}>
            Target Country *
          </label>
          <select
            value={targetCountry}
            onChange={(e) => handleCountryChange(e.target.value)}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: isLoading ? '#f3f4f6' : 'white'
            }}
          >
            <option value="">Select a country...</option>
            {COUNTRIES.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* New Currency */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            marginBottom: '4px',
            color: '#374151'
          }}>
            New Currency {targetCountry && `(default: ${COUNTRIES.find(c => c.code === targetCountry)?.currency})`}
          </label>
          <select
            value={newCurrency}
            onChange={(e) => setNewCurrency(e.target.value)}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: isLoading ? '#f3f4f6' : 'white'
            }}
          >
            <option value="">Use country default</option>
            {CURRENCIES.map(currency => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        {/* Adjusted Salary */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            marginBottom: '4px',
            color: '#374151'
          }}>
            Adjusted Salary (optional)
          </label>
          <input
            type="number"
            value={adjustedSalary}
            onChange={(e) => setAdjustedSalary(e.target.value)}
            disabled={isLoading}
            placeholder="Enter new salary amount..."
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: isLoading ? '#f3f4f6' : 'white'
            }}
          />
        </div>

        {/* Notes/Assumptions */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            marginBottom: '4px',
            color: '#374151'
          }}>
            Assumptions / Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isLoading}
            placeholder="Add any assumptions or specific requirements for the simulation..."
            rows={3}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: isLoading ? '#f3f4f6' : 'white',
              resize: 'vertical'
            }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={handleSimulate}
          disabled={isLoading || !targetCountry}
          style={{
            padding: '10px 20px',
            backgroundColor: isLoading || !targetCountry ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: isLoading || !targetCountry ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {isLoading && (
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid #ffffff40',
              borderTop: '2px solid #ffffff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          )}
          {isLoading ? 'Simulating...' : 'Simulate Impact'}
        </button>

        <button
          onClick={handleReset}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: 'white',
            color: '#6b7280',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          Reset
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          marginBottom: '24px'
        }}>
          <p style={{ color: '#dc2626', fontSize: '14px', margin: 0 }}>
            ❌ {error}
          </p>
        </div>
      )}

      {/* Results Display */}
      {simulationResult && (
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '16px',
            color: '#1f2937'
          }}>
            📊 Policy Impact Analysis {selectedCountryName && `- ${selectedCountryName}`}
          </h3>

          {/* Impact Summary */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '500', 
              marginBottom: '8px',
              color: '#374151'
            }}>
              Impact Summary
            </h4>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '14px', 
              lineHeight: '1.5',
              backgroundColor: '#f9fafb',
              padding: '12px',
              borderRadius: '6px',
              margin: 0
            }}>
              {simulationResult.impact_summary}
            </p>
          </div>

          {/* Cost Analysis */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '500', 
              marginBottom: '12px',
              color: '#374151'
            }}>
              💰 Cost Analysis
            </h4>
            <div style={{ display: 'grid', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: '#6b7280' }}>Estimated Change:</span>
                <span style={{ fontWeight: '500', color: '#1f2937' }}>
                  {simulationResult.cost_analysis.estimated_change}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: '#6b7280' }}>Currency Impact:</span>
                <span style={{ fontWeight: '500', color: '#1f2937' }}>
                  {simulationResult.cost_analysis.currency_impact}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: '#6b7280' }}>Tax Implications:</span>
                <span style={{ fontWeight: '500', color: '#1f2937' }}>
                  {simulationResult.cost_analysis.tax_implications}
                </span>
              </div>
            </div>
          </div>

          {/* Compliance Notes */}
          {simulationResult.compliance_notes.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '500', 
                marginBottom: '8px',
                color: '#374151'
              }}>
                ⚖️ Compliance Notes
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {simulationResult.compliance_notes.map((note, index) => (
                  <li key={index} style={{ 
                    color: '#6b7280', 
                    fontSize: '14px', 
                    marginBottom: '4px',
                    lineHeight: '1.4'
                  }}>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {simulationResult.recommendations.length > 0 && (
            <div>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '500', 
                marginBottom: '8px',
                color: '#374151'
              }}>
                💡 Recommendations
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {simulationResult.recommendations.map((rec, index) => (
                  <li key={index} style={{ 
                    color: '#059669', 
                    fontSize: '14px', 
                    marginBottom: '4px',
                    lineHeight: '1.4'
                  }}>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Add CSS animation for spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PolicySimulationPanel; 