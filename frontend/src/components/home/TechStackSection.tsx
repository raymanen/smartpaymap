import { useState, memo, useRef } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { TECHNOLOGIES } from '../../constants';
import type { TechStackSectionProps } from '../../types/components';

const TechStackSection = memo(({ 
  technologies = [...TECHNOLOGIES], 
  isVisible = false 
}: TechStackSectionProps) => {
  const [ref, sectionVisible] = useScrollAnimation(0.3);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrollingPaused, setIsScrollingPaused] = useState(false);
  const visible = isVisible || sectionVisible;
  
  return (
    <Box 
      ref={ref}
      sx={{ 
        py: { xs: 6, md: 8 },
        background: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="xl">
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            color: '#1e293b',
            fontWeight: 700,
            mb: 6,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          Built with Modern Technologies
        </Typography>
        
        <Box
          ref={scrollContainerRef}
          sx={{
            display: 'flex',
            gap: 4,
            width: 'fit-content',
            animation: 'scrollContinuous 20s linear infinite',
            animationPlayState: isScrollingPaused ? 'paused' : 'running',
            '@keyframes scrollContinuous': {
              '0%': { transform: 'translateX(0)' },
              '100%': { transform: 'translateX(-50%)' },
            },
          }}
        >
          {[...technologies, ...technologies].map((tech, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                minWidth: '120px',
                p: 3,
                background: 'white',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
                transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`,
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.05)',
                  boxShadow: `0 15px 35px -5px ${tech.color}40, 0 10px 25px -3px rgba(0, 0, 0, 0.1)`,
                  border: `2px solid ${tech.color}`,
                  zIndex: 10,
                },
              }}
              onMouseEnter={() => setIsScrollingPaused(true)}
              onMouseLeave={() => setIsScrollingPaused(false)}
            >
              <Box
                component="img"
                src={tech.logo}
                alt={tech.name}
                sx={{
                  width: 40,
                  height: 40,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                  transition: 'all 0.3s ease',
                }}
                onError={(e) => {
                  // Fallback to text if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const nextElement = target.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.fontSize = '2rem';
                    nextElement.textContent = tech.name.charAt(0);
                  }
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: tech.color,
                  textAlign: 'center',
                  fontSize: '0.875rem',
                }}
              >
                {tech.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
});

TechStackSection.displayName = 'TechStackSection';

export default TechStackSection; 