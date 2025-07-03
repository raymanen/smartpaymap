import { memo } from 'react';
import { Box, Typography, Container, Grid, useTheme } from '@mui/material';
import {
  Speed as SpeedIcon,
  Insights as InsightsIcon,
  Shield as ShieldIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { benefitsSectionStyles } from '../../styles/components/BenefitsSection.styles';
// No specific props needed for this component

const BenefitsSection = memo(() => {
  const title = "Why Choose SmartPayMap?";
  const subtitle = "Built by developers, for modern payroll operations";
  const [ref, isVisible] = useScrollAnimation(0.3);
  const theme = useTheme();
  const styles = benefitsSectionStyles(theme);
  
  const benefits = [
    {
      icon: <SpeedIcon sx={{ fontSize: 32, color: theme.palette.info.main }} />,
      title: 'Save 90% Time',
      description: 'Automate manual mapping tasks',
    },
    {
      icon: <InsightsIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />,
      title: 'Smart Insights',
      description: 'AI-powered suggestions and warnings',
    },
    {
      icon: <ShieldIcon sx={{ fontSize: 32, color: theme.palette.error.main }} />,
      title: 'Global Compliance',
      description: 'Built-in checks for 10+ countries',
    },
    {
      icon: <AccountBalanceIcon sx={{ fontSize: 32, color: theme.palette.success.main }} />,
      title: 'Enterprise Ready',
      description: 'Scales with your organization',
    },
  ];

  return (
    <Box 
      ref={ref} 
      sx={styles.root}
    >
      <Container maxWidth="xl" sx={styles.container}>
        <Typography
          variant="h3"
          sx={styles.title(isVisible)}
        >
          {title}
        </Typography>
        
        <Typography
          variant="body1"
          sx={styles.subtitle(isVisible)}
        >
          {subtitle}
        </Typography>
        
        <Grid container spacing={4}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                sx={styles.benefitCard(isVisible, index)}
              >
                <Box sx={styles.iconContainer}>
                  {benefit.icon}
                </Box>
                
                <Typography
                  variant="h6"
                  sx={styles.benefitTitle}
                >
                  {benefit.title}
                </Typography>
                
                <Typography
                  variant="body2"
                  sx={styles.benefitDescription}
                >
                  {benefit.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
});

BenefitsSection.displayName = 'BenefitsSection';

export default BenefitsSection; 