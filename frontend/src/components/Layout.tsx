import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Link,
  Toolbar,
  Typography,
  useMediaQuery,
  Button,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import logo from '../assets/logo.svg';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile: boolean = useMediaQuery('(max-width:600px)');
  const location = useLocation();
  const isCompliancePage = location.pathname === '/compliance';
  const isHomePage = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
        maxWidth: '100vw',
      }}
    >
      <AppBar 
        position="fixed"
        elevation={0}
        sx={{ 
          background: scrolled 
            ? 'rgba(59, 130, 246, 0.8)' 
            : 'rgba(59, 130, 246, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled 
            ? '1px solid rgba(255, 255, 255, 0.2)' 
            : '1px solid rgba(255, 255, 255, 0.1)',
          width: '100%',
          boxShadow: scrolled 
            ? '0 8px 32px rgba(59, 130, 246, 0.2)' 
            : '0 4px 20px rgba(59, 130, 246, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, rgba(30, 64, 175, 0.1) 100%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '1440px',
            margin: '0 auto',
            px: { xs: 2, sm: 3 },
          }}
        >
          <Toolbar 
            sx={{ 
              justifyContent: 'space-between',
              minHeight: { xs: '64px', sm: '72px' },
              width: '100%',
              px: 0,
            }}
          >
            <Link
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <img src={logo} alt="Logo" style={{ height: 32, width: 32 }} />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 700,
                  fontSize: isMobile ? '1.25rem' : '1.5rem',
                  color: 'white',
                }}
              >
                SmartPayMap
              </Typography>
            </Link>
            
            <Box 
              sx={{ 
                display: 'flex', 
                gap: { xs: 3, sm: 4 },
                alignItems: 'center',
              }}
            >
              <Link
                component={RouterLink}
                to="/mapping"
                sx={{
                  textDecoration: 'none',
                  color: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': { color: 'white' },
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  fontWeight: 500,
                  transition: 'color 0.2s ease',
                }}
              >
                Mapping
              </Link>
              <Link
                component={RouterLink}
                to="/skills"
                sx={{
                  textDecoration: 'none',
                  color: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': { color: 'white' },
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  fontWeight: 500,
                  transition: 'color 0.2s ease',
                }}
              >
                Skills
              </Link>
              <Link
                component={RouterLink}
                to="/compliance"
                sx={{
                  textDecoration: 'none',
                  color: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': { color: 'white' },
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  fontWeight: 500,
                  transition: 'color 0.2s ease',
                }}
              >
                Compliance
              </Link>
              <Button
                component={RouterLink}
                to="/mapping"
                variant="outlined"
                startIcon={<UploadFileIcon />}
                sx={{
                  ml: 2,
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 3,
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(4px)',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderColor: 'white',
                    transform: 'translateY(-1px)',
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: 20,
                  },
                }}
              >
                Upload CSV
              </Button>
            </Box>
          </Toolbar>
        </Box>
      </AppBar>

      {/* Toolbar placeholder to prevent content from hiding under AppBar */}
      <Toolbar sx={{ minHeight: { xs: '64px', sm: '72px' } }} />

      {/* Main content wrapper with conditional full-width support */}
      <Box
        component="main"
        sx={(isCompliancePage || isHomePage) ? {
          width: '100%',
          margin: 0,
          padding: 0,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        } : {
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          px: { xs: 2, sm: 3 },
          py: { xs: 3, sm: 4, md: 5 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}; 