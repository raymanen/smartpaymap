import { styled } from '@mui/material/styles';
import { Container, Typography, Box } from '@mui/material';

export const ShowcaseContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(12),
  background: '#f8fafc',
  overflow: 'hidden',
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(12),
  },
}));

export const ShowcaseTitle = styled(Typography)<{ isVisible: boolean }>(({ isVisible }) => ({
  textAlign: 'center',
  color: '#1e293b',
  fontWeight: 800,
  marginBottom: '16px',
  fontSize: '2.5rem',
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
  transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  '@media (min-width: 768px)': {
    fontSize: '3rem',
  },
}));

export const ShowcaseSubtitle = styled(Typography)<{ isVisible: boolean }>(({ isVisible }) => ({
  textAlign: 'center',
  color: '#64748b',
  marginBottom: '64px',
  fontSize: '1.125rem',
  maxWidth: '500px',
  margin: '0 auto 64px auto',
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
  transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
}));

export const ShowcaseScrollContainer = styled(Box)(() => ({
  display: 'flex',
  gap: '32px',
  paddingBottom: '16px',
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  scrollbarWidth: 'none', // Firefox
  msOverflowStyle: 'none', // IE and Edge
  '&::-webkit-scrollbar': {
    display: 'none', // Chrome, Safari, Opera
  },
}));

export const ShowcaseCard = styled(Box)<{ isVisible: boolean; index: number }>(({ isVisible, index }) => ({
  minWidth: '320px',
  padding: '32px',
  background: 'white',
  borderRadius: '20px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? 'translateX(0)' : 'translateX(100px)',
  transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.2}s`,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    border: '1px solid #cbd5e1',
  },
}));

export const ShowcaseCardTitle = styled(Typography)(() => ({
  fontWeight: 700,
  color: '#1e293b',
  marginBottom: '16px',
  textAlign: 'center',
  fontSize: '1.25rem',
}));

export const ShowcaseCardDescription = styled(Typography)(() => ({
  color: '#64748b',
  lineHeight: 1.6,
  marginBottom: '24px',
  textAlign: 'center',
}));

export const ShowcaseTagsContainer = styled(Box)(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  justifyContent: 'center',
})); 