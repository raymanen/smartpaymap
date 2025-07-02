import React, { memo, useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Typography,
  Grid,
  Container,
  Chip,
} from '@mui/material';
import {
  UploadFile as UploadFileIcon,
  SmartToy as SmartToyIcon,
  Assessment as AssessmentIcon,
  Policy as PolicyIcon,
  Security as SecurityIcon,
  FileDownload as FileDownloadIcon,
  Speed as SpeedIcon,
  Insights as InsightsIcon,
  AutoAwesome as AutoAwesomeIcon,
  TrendingUp as TrendingUpIcon,
  Shield as ShieldIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  badge?: string;
}

// Custom hook for scroll-based animations
const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return [ref, isVisible] as const;
};

const TechStackSection = memo(() => {
  const [ref, isVisible] = useScrollAnimation(0.3);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrollingPaused, setIsScrollingPaused] = useState(false);
  
  const technologies = [
    { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', color: '#61dafb' },
    { name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', color: '#3178c6' },
    { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', color: '#3776ab' },
    { name: 'FastAPI', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg', color: '#009688' },
    { name: 'Material-UI', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg', color: '#0081cb' },
    { name: 'OpenAI', logo: 'https://static.vecteezy.com/system/resources/previews/022/227/364/non_2x/openai-chatgpt-logo-icon-free-png.png', color: '#412991' },
    { name: 'Pandas', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg', color: '#150458' },
    { name: 'Uvicorn', logo: 'https://www.uvicorn.org/uvicorn.png', color: '#ff6b6b' },
    { name: 'Vite', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg', color: '#646cff' },
    { name: 'Node.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', color: '#339933' },
    { name: 'Git', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', color: '#f05032' },
    { name: 'Docker', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', color: '#2496ed' },
  ];

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
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
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
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
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

const HeroSection = memo(({ navigate, isVisible }: { navigate: any, isVisible: boolean }) => {
  return (
    <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
      <Box
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
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
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
          SmartPayMap
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
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.8s',
          }}
        >
          AI-Powered Payroll Data Mapping & Compliance
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
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
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
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
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
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 1s',
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<UploadFileIcon />}
            onClick={() => navigate('/mapping')}
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
            Explore Features
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<AssessmentIcon />}
            onClick={() => navigate('/compliance')}
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
            View Demo
          </Button>
        </Box>
      </Box>
    </Container>
  );
});

const FeatureCard = memo(({ feature, index }: { feature: Feature; index: number }) => {
  const [ref, isInView] = useScrollAnimation(0.4);

  return (
    <Box ref={ref}>
      <Card
        sx={{
          p: 4,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '20px',
          position: 'relative',
          overflow: 'hidden',
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.9)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(90deg, ${feature.gradient})`,
            opacity: 0.8,
          },
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            border: '1px solid #cbd5e1',
          },
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '16px',
            background: `linear-gradient(135deg, ${feature.gradient})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            color: 'white',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          {feature.icon}
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700, 
            color: '#1e293b',
            mb: 2,
            fontSize: '1.125rem',
          }}
        >
          {feature.title}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{
            color: '#64748b',
            lineHeight: 1.6,
            flexGrow: 1,
            fontSize: '0.875rem',
          }}
        >
          {feature.description}
        </Typography>
        {feature.badge && (
          <Chip
            label={feature.badge}
            size="small"
            sx={{
              mt: 3,
              background: '#f1f5f9',
              color: '#3b82f6',
              fontWeight: 600,
              alignSelf: 'flex-start',
              fontSize: '0.75rem',
            }}
          />
        )}
      </Card>
    </Box>
  );
});

const FeaturesSection = memo(({ mainFeatures }: { mainFeatures: Feature[] }) => {
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
          Powerful Features
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
          Everything you need to streamline your payroll operations
        </Typography>
        
        <Grid container spacing={4}>
          {mainFeatures.map((feature, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <FeatureCard feature={feature} index={index} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
});

const BenefitsSection = memo(({ benefits, isVisible }: { benefits: any[], isVisible: boolean }) => {
  const [ref, isBenefitsVisible] = useScrollAnimation(0.3);

  return (
    <Box ref={ref} sx={{ background: '#f8fafc', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            color: '#1e293b',
            fontWeight: 800,
            mb: 2,
            fontSize: { xs: '2.5rem', md: '3rem' },
            opacity: isBenefitsVisible ? 1 : 0,
            transform: isBenefitsVisible ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          Why Choose SmartPayMap?
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
            opacity: isBenefitsVisible ? 1 : 0,
            transform: isBenefitsVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
          }}
        >
          Built by developers, for modern payroll operations
        </Typography>
        
        <Grid container spacing={4}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 4,
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  opacity: isBenefitsVisible ? 1 : 0,
                  transform: isBenefitsVisible ? 'translateY(0)' : 'translateY(40px)',
                  transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${0.4 + index * 0.2}s`,
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    border: '1px solid #cbd5e1',
                  },
                }}
              >
                <Box 
                  sx={{ 
                    mb: 3,
                    display: 'flex',
                    justifyContent: 'center',
                    '& svg': {
                      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
                    }
                  }}
                >
                  {benefit.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#1e293b',
                    fontWeight: 700,
                    mb: 1,
                    fontSize: '1.125rem',
                  }}
                >
                  {benefit.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#64748b',
                    lineHeight: 1.6,
                    fontSize: '0.875rem',
                  }}
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

const ShowcaseSection = memo(() => {
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
          Project Highlights
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
          Scroll horizontally to explore our technical achievements
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

const CTASection = memo(({ navigate }: { navigate: any }) => {
  const [ref, isVisible] = useScrollAnimation(0.4);

  return (
    <Box
      ref={ref}
      sx={{
        background: 'white',
        py: { xs: 8, md: 12 },
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h3"
          sx={{
            color: '#1e293b',
            fontWeight: 800,
            mb: 3,
            fontSize: { xs: '2.5rem', md: '3rem' },
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.9)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          Ready to Impress?
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#64748b',
            mb: 6,
            fontSize: '1.125rem',
            maxWidth: '500px',
            mx: 'auto',
            lineHeight: 1.6,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
          }}
        >
          This project showcases modern React, TypeScript, Python & AI integration.
          Experience cutting-edge web development in action.
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<UploadFileIcon />}
          onClick={() => navigate('/mapping')}
          sx={{
            px: 8,
            py: 2,
            fontSize: '1.125rem',
            fontWeight: 600,
            borderRadius: '16px',
            background: '#3b82f6',
            color: 'white',
            textTransform: 'none',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.9)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s',
            '&:hover': {
              background: '#2563eb',
              transform: 'translateY(-4px) scale(1.05)',
              boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)',
            },
          }}
        >
          Explore the Demo
        </Button>
      </Container>
    </Box>
  );
});

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animations
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const mainFeatures = [
    {
      title: 'AI-Powered Mapping',
      description: 'Advanced AI automatically identifies and maps your CSV columns with 95% accuracy.',
      icon: <SmartToyIcon sx={{ fontSize: 24 }} />,
      gradient: '#3b82f6, #1e40af',
      badge: 'GPT-4',
    },
    {
      title: 'Policy Simulation',
      description: 'Simulate policy changes across countries with real-time cost analysis.',
      icon: <PolicyIcon sx={{ fontSize: 24 }} />,
      gradient: '#8b5cf6, #7c3aed',
      badge: 'Live',
    },
    {
      title: 'Compliance Heatmap',
      description: 'Global risk assessment across 10+ countries with regulatory insights.',
      icon: <SecurityIcon sx={{ fontSize: 24 }} />,
      gradient: '#ef4444, #dc2626',
      badge: 'Global',
    },
    {
      title: 'Smart Export',
      description: 'Export standardized CSV files with unified field mapping for easy integration.',
      icon: <FileDownloadIcon sx={{ fontSize: 24 }} />,
      gradient: '#10b981, #059669',
      badge: 'CSV',
    },
  ];

  const benefits = [
    {
      icon: <SpeedIcon sx={{ fontSize: 32, color: '#3b82f6' }} />,
      title: 'Save 90% Time',
      description: 'Automate manual mapping tasks',
    },
    {
      icon: <InsightsIcon sx={{ fontSize: 32, color: '#8b5cf6' }} />,
      title: 'Smart Insights',
      description: 'AI-powered suggestions and warnings',
    },
    {
      icon: <ShieldIcon sx={{ fontSize: 32, color: '#ef4444' }} />,
      title: 'Global Compliance',
      description: 'Built-in checks for 10+ countries',
    },
    {
      icon: <AccountBalanceIcon sx={{ fontSize: 32, color: '#10b981' }} />,
      title: 'Enterprise Ready',
      description: 'Scales with your organization',
    },
  ];

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
      <HeroSection navigate={navigate} isVisible={isVisible} />

      {/* Technology Stack Section */}
      <TechStackSection />

      {/* Features Section */}
      <FeaturesSection 
        mainFeatures={mainFeatures}
      />

      {/* Showcase Section */}
      <ShowcaseSection />

      {/* Benefits Section */}
      <BenefitsSection 
        benefits={benefits} 
        isVisible={isVisible}
      />

      {/* CTA Section */}
      <CTASection navigate={navigate} />
    </Box>
  );
}; 