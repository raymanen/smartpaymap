import { memo } from 'react';
import { Box, Typography, Container, Chip } from '@mui/material';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
// Using existing ShowcaseSectionProps from types

const ShowcaseSection = memo(() => {
  const title = "Project Highlights";
  const subtitle = "Scroll horizontally to explore our technical achievements";
  const [ref, isVisible] = useScrollAnimation(0.4);
  
  const showcaseItems = [
    {
      title: 'AI-Powered Mapping',
      description: 'Intelligent field recognition using DeepSeek & GPT-4',
      tags: ['AI', 'Machine Learning', 'DeepSeek'],
    },
    {
      title: 'Real-time Analytics',
      description: 'Dynamic compliance risk assessment',
      tags: ['Analytics', 'Real-time', 'Data Viz'],
    },
    {
      title: 'Global Compliance',
      description: '10+ countries supported with live updates',
      tags: ['Global', 'Compliance', 'Multi-region'],
    },
    {
      title: 'Modern UI/UX',
      description: 'Clean, intuitive interface with smooth animations',
      tags: ['React', 'Material-UI', 'TypeScript'],
    },
    {
      title: 'Scalable Architecture',
      description: 'FastAPI backend with optimized performance',
      tags: ['FastAPI', 'Python', 'Performance'],
    },
    {
      title: 'Data Security',
      description: 'Enterprise-grade security and privacy',
      tags: ['Security', 'Privacy', 'Enterprise'],
    },
  ];

  return (
    <Box 
      ref={ref}
      sx={{ 
        py: { xs: 8, md: 12 },
        background: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="xl">
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
        
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            pb: 2,
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE and Edge
            '&::-webkit-scrollbar': {
              display: 'none', // Chrome, Safari, Opera
            },
          }}
        >
          {showcaseItems.map((item, index) => (
            <Box
              key={index}
              sx={{
                minWidth: '320px',
                p: 4,
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
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#1e293b',
                  mb: 2,
                  textAlign: 'center',
                  fontSize: '1.25rem',
                }}
              >
                {item.title}
              </Typography>
              
              <Typography
                variant="body2"
                sx={{
                  color: '#64748b',
                  lineHeight: 1.6,
                  mb: 3,
                  textAlign: 'center',
                }}
              >
                {item.description}
              </Typography>
              
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  justifyContent: 'center',
                }}
              >
                {item.tags.map((tag, tagIndex) => (
                  <Chip
                    key={tagIndex}
                    label={tag}
                    size="small"
                    sx={{
                      background: '#f1f5f9',
                      color: '#3b82f6',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                    }}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
});

ShowcaseSection.displayName = 'ShowcaseSection';

export default ShowcaseSection; 