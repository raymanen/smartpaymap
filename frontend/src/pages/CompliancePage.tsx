import React from 'react';
import ComplianceHeatmap from '../components/ComplianceHeatmap';
import {
  ComplianceContainer,
  BackgroundOverlay,
  HeroSection,
  ContentContainer,
  HeroBadge,
  BadgeIcon,
  BadgeText,
  HeroTitle,
  HighlightedText,
  HeroDescription,
  StatsContainer,
  StatCard,
  StatNumber,
  StatLabel,
  MainContent,
  FeatureSection,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
  FeaturesGrid,
  FeatureCard
} from '../styles/components/CompliancePage.styles';

const CompliancePage: React.FC = () => {
  const stats = [
    { number: '10+', label: 'Countries Monitored' },
    { number: '24/7', label: 'Real-time Updates' },
    { number: '99%', label: 'Accuracy Rate' },
    { number: 'AI', label: 'Powered Analysis' }
  ];

  const features = [
    {
      title: 'Real-time Monitoring',
      description: 'Stay ahead of regulatory changes with our real-time compliance monitoring system.'
    },
    {
      title: 'Risk Assessment',
      description: 'Identify and quantify compliance risks across different jurisdictions and payment types.'
    },
    {
      title: 'Automated Reporting',
      description: 'Generate comprehensive compliance reports with a single click for any region.'
    },
    {
      title: 'Regulatory Updates',
      description: 'Receive instant notifications about regulatory changes affecting your payroll operations.'
    }
  ];

  return (
    <ComplianceContainer>
      <BackgroundOverlay />
      
      {/* Hero Section */}
        <HeroSection>
          <ContentContainer>
            <HeroBadge>
              <BadgeIcon>⚖️</BadgeIcon>
              <BadgeText>Global Compliance Intelligence</BadgeText>
            </HeroBadge>
            
            <HeroTitle variant="h1">
              Compliance Risk<br />
              <HighlightedText>Heatmap</HighlightedText>
            </HeroTitle>
            
            <HeroDescription>
              Real-time compliance risk assessment across global jurisdictions with AI-powered insights
            </HeroDescription>
            
            {/* Stats Cards */}
            <StatsContainer>
              {stats.map((stat, index) => (
                <StatCard key={index}>
                  <StatNumber>{stat.number}</StatNumber>
                  <StatLabel>{stat.label}</StatLabel>
                </StatCard>
              ))}
            </StatsContainer>
          </ContentContainer>
        </HeroSection>

        {/* Main Content - Heatmap */}
        <MainContent>
          <ComplianceHeatmap />
        </MainContent>

        {/* Feature Section */}
        <FeatureSection>
          <ContentContainer>
            <SectionHeader>
              <SectionTitle variant="h2">
                Why Choose Our Compliance Intelligence?
              </SectionTitle>
              <SectionSubtitle>
                Advanced AI-powered risk assessment with real-time regulatory monitoring
              </SectionSubtitle>
            </SectionHeader>
            
            <FeaturesGrid>
              {features.map((feature, index) => (
                <FeatureCard key={index}>
                  <div style={{ fontSize: '32px', marginBottom: '16px' }}></div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{feature.title}</h3>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>{feature.description}</p>
                </FeatureCard>
              ))}
            </FeaturesGrid>
          </ContentContainer>
        </FeatureSection>
      </ComplianceContainer>
  );
};

export default CompliancePage; 