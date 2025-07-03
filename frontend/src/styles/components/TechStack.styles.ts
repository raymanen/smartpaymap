import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

// Tech Stack Section Container
export const TechStackSection = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(8),
  background: 'var(--bg-secondary)',
  overflow: 'hidden',
  
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(10),
  },
}));

// Section Title
export const TechStackTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  color: 'var(--text-primary)',
  fontWeight: 700,
  marginBottom: theme.spacing(6),
  fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
}));

// Scrolling Container
export const ScrollingContainer = styled(Box)<{ isPaused: boolean }>(
  ({ theme, isPaused }) => ({
    display: 'flex',
    gap: theme.spacing(4),
    width: 'fit-content',
    animation: 'scrollHorizontal 20s linear infinite',
    animationPlayState: isPaused ? 'paused' : 'running',
    
    '@keyframes scrollHorizontal': {
      '0%': { transform: 'translateX(0)' },
      '100%': { transform: 'translateX(-50%)' },
    },
  })
);

// Technology Card
export const TechCard = styled(Box)<{ isVisible: boolean; index: number; techColor: string }>(
  ({ theme, isVisible, index, techColor }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
    minWidth: '120px',
    padding: theme.spacing(3),
    background: 'var(--bg-primary)',
    borderRadius: '16px',
    border: '1px solid var(--border-primary)',
    boxShadow: 'var(--shadow-md)',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: isVisible ? 1 : 0,
    transform: isVisible 
      ? 'translateY(0) scale(1)' 
      : 'translateY(20px) scale(0.9)',
    transitionDelay: `${index * 100}ms`,
    
    '&:hover': {
      transform: 'translateY(-8px) scale(1.05)',
      boxShadow: `0 15px 35px -5px ${techColor}40, 0 10px 25px -3px rgba(0, 0, 0, 0.1)`,
      border: `2px solid ${techColor}`,
      zIndex: 10,
    },
  })
);

// Technology Logo
export const TechLogo = styled('img')(() => ({
  width: 40,
  height: 40,
  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
  transition: 'all 0.3s ease',
}));

// Technology Name
export const TechName = styled(Typography)<{ techColor: string }>(
  ({ techColor }) => ({
    fontWeight: 600,
    color: techColor,
    textAlign: 'center',
    fontSize: '0.875rem',
  })
);

// Animation wrapper for the entire section
export const TechStackWrapper = styled(Box)<{ isVisible: boolean }>(
  ({ isVisible }) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  })
); 