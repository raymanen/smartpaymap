import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
} from '@mui/material';
import {
  LinkedIn,
  Twitter,
  GitHub,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';
import logo from '../assets/logo.svg';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1e293b',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <img src={logo} alt="Logo" style={{ height: 32, width: 32, marginRight: 12 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                SmartPayMap
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3, lineHeight: 1.6 }}>
              Intelligent payroll mapping and compliance solutions powered by AI. 
              Streamline your global payroll operations with confidence.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                sx={{ 
                  color: '#94a3b8', 
                  '&:hover': { color: '#3b82f6' },
                  transition: 'color 0.2s ease'
                }}
              >
                <LinkedIn />
              </IconButton>
              <IconButton
                sx={{ 
                  color: '#94a3b8', 
                  '&:hover': { color: '#3b82f6' },
                  transition: 'color 0.2s ease'
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                sx={{ 
                  color: '#94a3b8', 
                  '&:hover': { color: '#3b82f6' },
                  transition: 'color 0.2s ease'
                }}
              >
                <GitHub />
              </IconButton>
            </Box>
          </Grid>

          {/* Product Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
              Product
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link
                component={RouterLink}
                to="/mapping"
                sx={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#3b82f6' },
                  transition: 'color 0.2s ease',
                }}
              >
                Payroll Mapping
              </Link>
              <Link
                component={RouterLink}
                to="/skills"
                sx={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#3b82f6' },
                  transition: 'color 0.2s ease',
                }}
              >
                Skills Analysis
              </Link>
              <Link
                component={RouterLink}
                to="/compliance"
                sx={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#3b82f6' },
                  transition: 'color 0.2s ease',
                }}
              >
                Compliance Heatmap
              </Link>
            </Box>
          </Grid>

          {/* Company Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link
                href="#"
                sx={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#3b82f6' },
                  transition: 'color 0.2s ease',
                }}
              >
                About Us
              </Link>
              <Link
                href="#"
                sx={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#3b82f6' },
                  transition: 'color 0.2s ease',
                }}
              >
                Careers
              </Link>
              <Link
                href="#"
                sx={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#3b82f6' },
                  transition: 'color 0.2s ease',
                }}
              >
                Blog
              </Link>
              <Link
                href="#"
                sx={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#3b82f6' },
                  transition: 'color 0.2s ease',
                }}
              >
                Press
              </Link>
            </Box>
          </Grid>

          {/* Support & Legal */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link
                href="#"
                sx={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#3b82f6' },
                  transition: 'color 0.2s ease',
                }}
              >
                Help Center
              </Link>
              <Link
                href="#"
                sx={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#3b82f6' },
                  transition: 'color 0.2s ease',
                }}
              >
                Documentation
              </Link>
              <Link
                href="#"
                sx={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#3b82f6' },
                  transition: 'color 0.2s ease',
                }}
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                sx={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#3b82f6' },
                  transition: 'color 0.2s ease',
                }}
              >
                Terms of Service
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
              Contact
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: 16, color: '#94a3b8' }} />
                <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  hello@smartpaymap.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 16, color: '#94a3b8' }} />
                <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  +44 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOn sx={{ fontSize: 16, color: '#94a3b8', mt: 0.2 }} />
                <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.4 }}>
                  London<br />
                  United Kingdom
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: '#334155' }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            © {currentYear} SmartPayMap. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              href="#"
              sx={{
                color: '#94a3b8',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': { color: '#3b82f6' },
                transition: 'color 0.2s ease',
              }}
            >
              Cookie Settings
            </Link>
            <Link
              href="#"
              sx={{
                color: '#94a3b8',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': { color: '#3b82f6' },
                transition: 'color 0.2s ease',
              }}
            >
              Sitemap
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 