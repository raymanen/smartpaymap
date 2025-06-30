import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
          background: 'linear-gradient(90deg, #3b82f6 0%, #1e40af 100%)',
          borderBottom: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          width: '100%',
          boxShadow: '0 4px 6px -1px rgba(30, 64, 175, 0.1), 0 2px 4px -1px rgba(30, 64, 175, 0.06)',
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

      {/* Main content wrapper */}
      <Box
        component="main"
        sx={{
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