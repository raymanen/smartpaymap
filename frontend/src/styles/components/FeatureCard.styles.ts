import { styled } from '@mui/material/styles';
import { Box, Card, Typography } from '@mui/material';

// Feature Card Container
export const FeatureCardContainer = styled(Card)<{ isVisible: boolean; gradient: string }>(
  ({ theme, isVisible, gradient }) => ({
    padding: theme.spacing(4),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-primary)',
    borderRadius: '20px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: 'var(--shadow-md)',
    opacity: isVisible ? 1 : 0,
    transform: isVisible 
      ? 'translateY(0) scale(1)' 
      : 'translateY(60px) scale(0.9)',
    
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '2px',
      background: `linear-gradient(90deg, ${gradient})`,
      opacity: 0.8,
    },
    
    '&:hover': {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: 'var(--shadow-xl)',
      border: '1px solid var(--border-secondary)',
    },
  })
);

// Feature Icon Container
export const FeatureIconContainer = styled(Box)<{ gradient: string }>(
  ({ theme, gradient }) => ({
    width: 56,
    height: 56,
    borderRadius: '16px',
    background: `linear-gradient(135deg, ${gradient})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
    color: 'white',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  })
);

// Feature Title
export const FeatureTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: theme.spacing(2),
  fontSize: '1.125rem',
}));

// Feature Description
export const FeatureDescription = styled(Typography)(() => ({
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
  fontSize: '0.875rem',
  flex: 1,
}));

// Feature Badge (if present)
export const FeatureBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  background: 'var(--primary-500)',
  color: 'white',
  padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
  borderRadius: '8px',
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));

// Features Grid Container
export const FeaturesGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: theme.spacing(4),
  marginTop: theme.spacing(8),
  
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(3),
  },
}));

// Features Section Container
export const FeaturesSection = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  background: 'var(--bg-primary)',
  
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(12),
  },
}));

// Features Section Title
export const FeaturesSectionTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  color: 'var(--text-primary)',
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  fontSize: 'clamp(1.875rem, 5vw, 2.5rem)',
}));

// Features Section Subtitle
export const FeaturesSectionSubtitle = styled(Typography)(() => ({
  textAlign: 'center',
  color: 'var(--text-secondary)',
  maxWidth: '600px',
  margin: '0 auto',
  fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
  lineHeight: 1.6,
})); 