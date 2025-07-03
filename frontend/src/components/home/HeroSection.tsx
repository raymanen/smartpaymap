import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Container,
  Chip,
} from '@mui/material';
import {
  UploadFile as UploadFileIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import type { HeroSectionProps } from '../../types/components';

const HeroSection = memo(({ 
  title = "SmartPayMap",
  subtitle = "AI-Powered Payroll Data Mapping & Compliance",
  ctaText = "Explore Features",
  ctaAction,
  secondaryCtaText = "View Demo",
  secondaryCtaAction,
  isVisible: propIsVisible,
}: HeroSectionProps) => {
  const [ref, isVisible] = useScrollAnimation(0.2);
  const navigate = useNavigate();
  
  const visible = propIsVisible !== undefined ? propIsVisible : isVisible;
  
  const handlePrimaryClick = () => {
    if (ctaAction) {
      ctaAction();
    } else {
      navigate('/mapping');
    }
  };
  
  const handleSecondaryClick = () => {
    if (secondaryCtaAction) {
      secondaryCtaAction();
    } else {
      navigate('/compliance');
    }
  };
  
  return (
    <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
      <Box
        ref={ref}
        sx={{
          pt: { xs: 8, md: 12 },
          pb: { xs: 6, md: 8 },
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
            fontWeight: 700,
            color: '#1a1a1a',
            mb: 4,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.4s',
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
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            maxWidth: '600px',
            mx: 'auto',
            color: '#1a1a1a',
            fontSize: { xs: '1rem', sm: '1.125rem' },
            lineHeight: 1.7,
            mb: 8,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.8s',
          }}
        >
          {subtitle}
        </Typography> 

        <Chip
          label="✨ Powered by DeepSeek & GPT-4"
          sx={{
            background: 'rgba(59, 130, 246, 0.1)',
            backdropFilter: 'blur(10px)',
            color: '#3b82f6',
            fontWeight: 600,
            mb: 4,
            fontSize: '0.875rem',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
          }}
        />

        <Typography
          variant="body1"
          sx={{
            maxWidth: '600px',
            mx: 'auto',
            color: '#64748b',
            fontSize: { xs: '1rem', sm: '1.125rem' },
            lineHeight: 1.7,
            mb: 8,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.8s',
          }}
        >
          Transform your payroll operations with intelligent field mapping, policy simulation, 
          and global compliance analysis. Built with modern React & Python stack.
        </Typography>

        {/* CTA Buttons */}
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            justifyContent: 'center',
            mb: 12,
            flexDirection: { xs: 'column', sm: 'row' },
            maxWidth: '400px',
            mx: 'auto',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 1s',
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<UploadFileIcon />}
            onClick={handlePrimaryClick}
            sx={{
              px: 6,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '12px',
              background: '#3b82f6',
              color: 'white',
              textTransform: 'none',
              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
              '&:hover': {
                background: '#2563eb',
                transform: 'translateY(-2px) scale(1.02)',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {ctaText}
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<AssessmentIcon />}
            onClick={handleSecondaryClick}
            sx={{
              px: 6,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '12px',
              borderColor: '#e2e8f0',
              color: '#475569',
              textTransform: 'none',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                borderColor: '#cbd5e1',
                background: '#f8fafc',
                transform: 'translateY(-2px) scale(1.02)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {secondaryCtaText}
          </Button>
        </Box>
      </Box>
    </Container>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection; 