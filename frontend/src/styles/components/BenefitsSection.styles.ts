import { Theme } from '@mui/material/styles';

export const benefitsSectionStyles = (theme: Theme) => ({
  root: {
    background: theme.palette.background.default,
    py: { xs: 8, md: 12 },
  },
  container: {
    position: 'relative',
    zIndex: 1,
  },
  title: (isVisible: boolean) => ({
    textAlign: 'center',
    color: theme.palette.text.primary,
    fontWeight: 800,
    mb: 2,
    fontSize: { xs: '2.5rem', md: '3rem' },
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
    transition: `all 0.8s ${theme.transitions.easing.easeInOut}`,
  }),
  subtitle: (isVisible: boolean) => ({
    textAlign: 'center',
    color: theme.palette.text.secondary,
    mb: 8,
    fontSize: '1.125rem',
    maxWidth: '500px',
    mx: 'auto',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    transition: `all 0.8s ${theme.transitions.easing.easeInOut} 0.2s`,
  }),
  benefitCard: (isVisible: boolean, index: number) => ({
    textAlign: 'center',
    p: 4,
    background: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '20px',
    boxShadow: theme.shadows[1],
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
    transition: `all 0.8s ${theme.transitions.easing.easeInOut} ${0.4 + index * 0.2}s`,
    '&:hover': {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: theme.shadows[8],
      border: `1px solid ${theme.palette.grey[300]}`,
    },
  }),
  iconContainer: {
    mb: 3,
    display: 'flex',
    justifyContent: 'center',
    '& svg': {
      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
    }
  },
  benefitTitle: {
    color: theme.palette.text.primary,
    fontWeight: 700,
    mb: 1,
    fontSize: '1.125rem',
  },
  benefitDescription: {
    color: theme.palette.text.secondary,
    lineHeight: 1.6,
    fontSize: '0.875rem',
  },
}); 