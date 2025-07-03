import React, { memo, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import HeroSection from '../components/home/HeroSection';
import TechStackSection from '../components/home/TechStackSection';
import FeaturesSection from '../components/home/FeaturesSection';
import BenefitsSection from '../components/home/BenefitsSection';
import ShowcaseSection from '../components/home/ShowcaseSection';
import CTASection from '../components/home/CTASection';

export const Home: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animations
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(168, 85, 247, 0.02) 0%, transparent 50%)
          `,
          animation: 'float 20s ease-in-out infinite',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              rgba(59, 130, 246, 0.02) 1px,
              transparent 2px,
              transparent 60px
            ),
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              rgba(59, 130, 246, 0.02) 1px,
              transparent 2px,
              transparent 60px
            )
          `,
          animation: 'grid-move 30s linear infinite',
          pointerEvents: 'none',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-10px) scale(1.02)' },
        },
        '@keyframes grid-move': {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(60px, 60px)' },
        },
      }}
    >
      {/* Hero Section */}
      <HeroSection isVisible={isVisible} />

      {/* Technology Stack Section */}
      <TechStackSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Showcase Section */}
      <ShowcaseSection />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* CTA Section */}
      <CTASection />
    </Box>
  );
}; 

export default memo(Home); 