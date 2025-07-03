import { styled } from '@mui/material/styles';
import { Box, Typography, Card, Button, Stepper } from '@mui/material';

// Main container for the mapping page
export const MappingContainer = styled(Box)(({ theme }) => ({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: theme.spacing(4, 2),
  
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(6, 4),
  },
}));

// Page title styling
export const MappingTitle = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: theme.spacing(1),
  textAlign: 'center',
}));

// Page subtitle styling
export const MappingSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(1rem, 2vw, 1.125rem)',
  color: 'var(--text-secondary)',
  textAlign: 'center',
  maxWidth: '700px',
  margin: '0 auto',
  marginBottom: theme.spacing(6),
}));

// Custom styled stepper
export const MappingStepper = styled(Stepper)(({ theme }) => ({
  marginBottom: theme.spacing(6),
  
  '& .MuiStepLabel-label': {
    fontSize: '0.875rem',
    
    '&.Mui-active': {
      color: 'var(--primary-500)',
      fontWeight: 600,
    },
    
    '&.Mui-completed': {
      color: 'var(--success-500)',
      fontWeight: 600,
    },
  },
  
  [theme.breakpoints.down('sm')]: {
    '& .MuiStepLabel-labelContainer': {
      display: 'none',
    },
  },
}));

// Card container for each step
export const StepCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: 'var(--shadow-md)',
  background: 'var(--bg-primary)',
  border: '1px solid var(--border-primary)',
  marginBottom: theme.spacing(4),
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  },
}));

// Success message container
export const SuccessContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(4),
}));

// Success icon styling
export const SuccessIcon = styled(Box)(({ theme }) => ({
  fontSize: 64,
  color: 'var(--success-500)',
  marginBottom: theme.spacing(2),
}));

// Success message title
export const SuccessTitle = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
  fontWeight: 700,
  color: 'var(--success-500)',
  marginBottom: theme.spacing(2),
}));

// Success message description
export const SuccessDescription = styled(Typography)(({ theme }) => ({
  color: 'var(--text-secondary)',
  marginBottom: theme.spacing(4),
  maxWidth: '600px',
}));

// Button container for action buttons
export const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

// Primary action button
export const PrimaryButton = styled(Button)(({ theme }) => ({
  minWidth: '120px',
  fontWeight: 600,
  borderRadius: '8px',
  padding: theme.spacing(1, 3),
  boxShadow: 'var(--shadow-sm)',
  textTransform: 'none',
  
  '&:hover': {
    boxShadow: 'var(--shadow-md)',
  },
}));

// Secondary action button
export const SecondaryButton = styled(Button)(({ theme }) => ({
  minWidth: '120px',
  fontWeight: 600,
  borderRadius: '8px',
  padding: theme.spacing(1, 3),
  textTransform: 'none',
}));

// Loading indicator container
export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
})); 