import { styled } from '@mui/material/styles';
import { Box, Typography, Card } from '@mui/material';

// Main container with gradient background
export const ComplianceContainer = styled(Box)(() => ({
  minHeight: '100vh',
  background: 'linear-gradient(90deg, #3b82f6 0%, #1e40af 100%)',
  position: 'relative',
  width: '100%',
  margin: 0,
  padding: 0,
}));

// Background gradient overlay
export const BackgroundOverlay = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)',
  pointerEvents: 'none',
}));

// Hero section container
export const HeroSection = styled(Box)(() => ({
  position: 'relative',
  padding: '40px 0 20px 0',
  textAlign: 'center',
}));

// Content container with max width
export const ContentContainer = styled(Box)(() => ({
  maxWidth: '100%',
  margin: '0 auto',
  padding: '0 20px',
}));

// Badge container for the hero section
export const HeroBadge = styled(Box)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '12px',
  padding: '8px 16px',
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
}));

// Badge icon styling
export const BadgeIcon = styled(Box)(() => ({
  fontSize: '20px',
}));

// Badge text styling
export const BadgeText = styled(Typography)(() => ({
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '12px',
  fontWeight: 500,
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
}));

// Hero title styling
export const HeroTitle = styled(Typography)(() => ({
  fontSize: 'clamp(32px, 4vw, 48px)',
  fontWeight: 700,
  color: '#ffffff',
  lineHeight: 1.2,
  margin: '0 0 12px 0',
}));

// Highlighted text in hero title
export const HighlightedText = styled('span')(() => ({
  color: '#fbbf24',
}));

// Hero description styling
export const HeroDescription = styled(Typography)(() => ({
  fontSize: '16px',
  color: 'rgba(255, 255, 255, 0.8)',
  maxWidth: '500px',
  margin: '0 auto',
  lineHeight: 1.5,
}));

// Stats container
export const StatsContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  gap: '12px',
  maxWidth: '800px',
  margin: '0 auto',
  flexWrap: 'wrap',
}));

// Stat card styling
export const StatCard = styled(Box)(() => ({
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  padding: '16px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  textAlign: 'center',
  flex: '1',
  minWidth: '140px',
  maxWidth: '180px',
  transition: 'all 0.3s ease',
  cursor: 'default',
  
  '&:hover': {
    transform: 'translateY(-4px)',
    background: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
}));

// Stat number styling
export const StatNumber = styled(Typography)(() => ({
  fontSize: '20px',
  fontWeight: 600,
  color: '#ffffff',
  marginBottom: '2px',
}));

// Stat label styling
export const StatLabel = styled(Typography)(() => ({
  fontSize: '11px',
  color: 'rgba(255, 255, 255, 0.7)',
  fontWeight: 500,
}));

// Main content area with white background
export const MainContent = styled(Box)(() => ({
  position: 'relative',
  background: 'rgba(248, 250, 252, 0.95)',
  borderRadius: '24px 24px 0 0',
  marginTop: '20px',
  padding: '32px 0',
}));

// Feature section styling
export const FeatureSection = styled(Box)(() => ({
  background: '#ffffff',
  padding: '32px 0',
  position: 'relative',
}));

// Feature section header
export const SectionHeader = styled(Box)(() => ({
  textAlign: 'center',
  marginBottom: '24px',
}));

// Section title styling
export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 600,
  color: '#1e293b',
  marginBottom: theme.spacing(1),
}));

// Section subtitle styling
export const SectionSubtitle = styled(Typography)(() => ({
  fontSize: '14px',
  color: '#64748b',
  maxWidth: '500px',
  margin: '0 auto',
}));

// Features grid container
export const FeaturesGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
}));

// Feature card styling
export const FeatureCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  flex: '1 1 300px',
  maxWidth: '350px',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: 'var(--shadow-sm)',
  border: '1px solid var(--border-primary)',
  transition: 'all 0.3s ease',
  
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: 'var(--shadow-md)',
  },
})); 