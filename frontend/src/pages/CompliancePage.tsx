import React from 'react';
import ComplianceHeatmap from '../components/ComplianceHeatmap';

const CompliancePage: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(90deg, #3b82f6 0%, #1e40af 100%)',
      position: 'relative',
      width: '100vw',
      margin: 0,
      padding: 0
    }}>
      {/* Simplified background elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      {/* Hero Section */}
      <div style={{
        position: 'relative',
        padding: '40px 0 20px 0',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '100%',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          {/* Main heading */}
          <div style={{
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <span style={{ fontSize: '20px' }}>⚖️</span>
              <span style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '12px',
                fontWeight: '500',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                Global Compliance Intelligence
              </span>
            </div>
            
            <h1 style={{
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: '700',
              color: '#ffffff',
              lineHeight: '1.2',
              margin: '0 0 12px 0'
            }}>
              Compliance Risk
              <br />
              <span style={{
                color: '#fbbf24'
              }}>
                Heatmap
              </span>
            </h1>
            
            <p style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '500px',
              margin: '0 auto',
              lineHeight: '1.5'
            }}>
              Real-time compliance risk assessment across global jurisdictions with AI-powered insights
            </p>
          </div>

          {/* Stats Cards - Simplified */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            maxWidth: '800px',
            margin: '0 auto',
            flexWrap: 'wrap'
          }}>
            {[
              { number: '10+', label: 'Countries Monitored' },
              { number: '24/7', label: 'Real-time Updates' },
              { number: '99%', label: 'Accuracy Rate' },
              { number: 'AI', label: 'Powered Analysis' }
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  textAlign: 'center',
                  flex: '1',
                  minWidth: '140px',
                  maxWidth: '180px',
                  transition: 'all 0.3s ease',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <div style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#ffffff',
                  marginBottom: '2px'
                }}>
                  {stat.number}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: '500'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Reduced margins */}
      <div style={{
        position: 'relative',
        background: 'rgba(248, 250, 252, 0.95)',
        borderRadius: '24px 24px 0 0',
        marginTop: '20px',
        padding: '32px 0'
      }}>
        <ComplianceHeatmap />
      </div>

      {/* Feature Section - Simplified */}
      <div style={{
        background: '#ffffff',
        padding: '32px 0',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '100%',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          {/* Section Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '8px'
            }}>
              Why Choose Our Compliance Intelligence?
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              Advanced AI-powered risk assessment with real-time regulatory monitoring
            </p>
          </div>

          {/* Features Grid - Side by Side */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            {[
              {
                title: 'AI-Powered Analysis',
                description: 'Advanced machine learning algorithms analyze regulatory complexity across jurisdictions'
              },
              {
                title: 'Real-Time Updates',
                description: 'Continuous monitoring of regulatory changes and compliance requirements'
              },
              {
                title: 'Risk Scoring',
                description: 'Comprehensive risk assessment based on multiple compliance factors'
              },
              {
                title: 'Global Coverage',
                description: 'Extensive coverage of major international business jurisdictions'
              }
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center',
                  flex: '1',
                  minWidth: '200px',
                  maxWidth: '250px',
                  transition: 'all 0.3s ease',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#64748b',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer - Simplified */}
      <div style={{
        background: '#1e293b',
        padding: '20px 0',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '100%',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <p style={{
            color: '#94a3b8',
            fontSize: '12px',
            margin: 0
          }}>
            © 2025 SmartPayMap. Advanced compliance intelligence for global payroll operations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompliancePage; 