import { memo } from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { FEATURES } from '../../constants';
import type { FeaturesSectionProps } from '../../types/components';
import FeatureCard from './FeatureCard';

const FeaturesSection = memo(({ 
  features = [...FEATURES],
  title = "Powerful Features",
  subtitle = "Everything you need to streamline your payroll operations"
}: FeaturesSectionProps) => {
  const [ref, isVisible] = useScrollAnimation(0.3);

  return (
    <Box 
      ref={ref}
      sx={{ 
        background: 'white',
        py: { xs: 8, md: 12 },
        position: 'relative',
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            color: '#1e293b',
            fontWeight: 800,
            mb: 2,
            fontSize: { xs: '2.5rem', md: '3rem' },
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: '#64748b',
            mb: 8,
            fontSize: '1.125rem',
            maxWidth: '500px',
            mx: 'auto',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
          }}
        >
          {subtitle}
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <FeatureCard feature={feature} index={index} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
});

FeaturesSection.displayName = 'FeaturesSection';

export default FeaturesSection; 