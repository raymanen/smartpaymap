import { Theme } from '@mui/material/styles';

export const ctaSectionStyles = (theme: Theme) => ({
  root: {
    background: theme.palette.background.paper,
    py: { xs: 8, md: 12 },
    textAlign: 'center',
    position: 'relative',
  },
  container: {
    position: 'relative',
    zIndex: 1,
  },
  title: (isVisible: boolean) => ({
    color: theme.palette.text.primary,
    fontWeight: 800,
    mb: 3,
    fontSize: { xs: '2.5rem', md: '3rem' },
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.9)',
    transition: `all 0.8s ${theme.transitions.easing.easeInOut}`,
  }),
  subtitle: (isVisible: boolean) => ({
    color: theme.palette.text.secondary,
    mb: 6,
    fontSize: '1.125rem',
    maxWidth: '500px',
    mx: 'auto',
    lineHeight: 1.6,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    transition: `all 0.8s ${theme.transitions.easing.easeInOut} 0.2s`,
  }),
  button: (isVisible: boolean) => ({
    px: 8,
    py: 2,
    fontSize: '1.125rem',
    fontWeight: 600,
    borderRadius: '16px',
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    textTransform: 'none',
    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.9)',
    transition: `all 0.8s ${theme.transitions.easing.easeInOut} 0.4s`,
    '&:hover': {
      background: theme.palette.primary.dark,
      transform: 'translateY(-4px) scale(1.05)',
      boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)',
    },
  }),
}); 