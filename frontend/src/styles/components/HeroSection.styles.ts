import { styled } from '@mui/material/styles';
import { Box, Typography, Container, Chip, Button } from '@mui/material';

// Hero Container
export const HeroContainer = styled(Container)(() => ({
  position: 'relative',
  zIndex: 1,
}));

// Hero Content Box
export const HeroContent = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(6),
  textAlign: 'center',
  
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(8),
  },
}));

// Floating Main Title
export const FloatingTitle = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: theme.spacing(4),
  lineHeight: 1.2,
  letterSpacing: '-0.01em',
  position: 'relative',
  animation: 'gentleFloat 4s ease-in-out infinite',
  textShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  
  '@keyframes gentleFloat': {
    '0%, 100%': { 
      transform: 'translateY(0px)',
    },
    '50%': { 
      transform: 'translateY(-6px)',
    },
  },
}));

// Subtitle
export const HeroSubtitle = styled(Typography)(({ theme }) => ({
  maxWidth: '600px',
  margin: '0 auto',
  color: 'var(--text-primary)',
  fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
  lineHeight: 1.7,
  marginBottom: theme.spacing(8),
}));

// Powered By Chip
export const PoweredByChip = styled(Chip)(({ theme }) => ({
  background: 'rgba(59, 130, 246, 0.1)',
  backdropFilter: 'blur(10px)',
  color: 'var(--primary-500)',
  fontWeight: 600,
  marginBottom: theme.spacing(4),
  fontSize: '0.875rem',
  border: '1px solid rgba(59, 130, 246, 0.2)',
}));

// Description Text
export const HeroDescription = styled(Typography)(({ theme }) => ({
  maxWidth: '600px',
  margin: '0 auto',
  color: 'var(--text-secondary)',
  fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
  lineHeight: 1.7,
  marginBottom: theme.spacing(8),
}));

// CTA Button Container
export const CTAContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  justifyContent: 'center',
  maxWidth: '400px',
  margin: `0 auto ${theme.spacing(12)}`,
  
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

// Primary CTA Button
export const PrimaryCTAButton = styled(Button)(({ theme }) => ({
  paddingLeft: theme.spacing(6),
  paddingRight: theme.spacing(6),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  fontSize: '1rem',
  fontWeight: 600,
  borderRadius: '12px',
  background: 'var(--primary-500)',
  color: 'white',
  textTransform: 'none',
  boxShadow: 'var(--shadow-primary)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    background: 'var(--primary-600)',
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: 'var(--shadow-primary-lg)',
  },
}));

// Secondary CTA Button
export const SecondaryCTAButton = styled(Button)(({ theme }) => ({
  paddingLeft: theme.spacing(6),
  paddingRight: theme.spacing(6),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  fontSize: '1rem',
  fontWeight: 600,
  borderRadius: '12px',
  borderColor: 'var(--border-primary)',
  color: 'var(--text-secondary)',
  textTransform: 'none',
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    borderColor: 'var(--border-secondary)',
    background: 'var(--bg-secondary)',
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  },
}));

// Animation wrapper for scroll-triggered animations
export const AnimatedWrapper = styled(Box)<{ isVisible: boolean; delay?: number }>(
  ({ isVisible, delay = 0 }) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
  })
); 