import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Typography,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CodeIcon from '@mui/icons-material/Code';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      title: 'Smart Detection',
      description: 'AI-powered field detection automatically identifies and maps your CSV columns.',
      icon: <AutoGraphIcon sx={{ fontSize: 32, color: '#3b82f6' }} />,
    },
    {
      title: 'Validation & Feedback',
      description: 'Get instant feedback on your mappings with clear warnings and suggestions.',
      icon: <TaskAltIcon sx={{ fontSize: 32, color: '#3b82f6' }} />,
    },
    {
      title: 'Easy Integration',
      description: 'Simple API integration with your existing payroll systems and workflows.',
      icon: <IntegrationInstructionsIcon sx={{ fontSize: 32, color: '#3b82f6' }} />,
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          minHeight: { xs: 'calc(100vh - 180px)', md: 'calc(100vh - 200px)' },
          position: 'relative',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            mb: 2,
            fontSize: { xs: '2rem', sm: '2.25rem', md: '2.5rem' },
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            width: '100%',
            textAlign: 'center',
            fontWeight: 800,
          }}
        >
          SmartPayMap
        </Typography>
        <Typography
          variant="h2"
          sx={{
            mb: 3,
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
            color: '#1e293b',
            width: '100%',
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          AI-Powered Payroll Data Mapping
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            mb: 6,
            maxWidth: '800px',
            width: '100%',
            color: '#475569',
            mx: 'auto',
            textAlign: 'center',
            fontSize: { xs: '1rem', sm: '1.1rem' },
            lineHeight: 1.6,
          }}
        >
          Effortlessly map and validate your CSV fields with our advanced GPT-powered assistant.
          Save hours of manual work with intelligent field detection and automated mapping suggestions.
        </Typography>

        {/* CTA Buttons */}
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 2, sm: 3 },
            justifyContent: 'center',
            mb: { xs: 6, sm: 8 },
            flexDirection: { xs: 'column', sm: 'row' },
            width: '100%',
            maxWidth: '400px',
            mx: 'auto',
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<UploadFileIcon />}
            onClick={() => navigate('/mapping')}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: { xs: '1rem', sm: '1.1rem' },
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: '180px' },
              background: 'linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)',
              },
            }}
          >
            Start Mapping
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<CodeIcon />}
            onClick={() => navigate('/skills')}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: { xs: '1rem', sm: '1.1rem' },
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: '180px' },
              borderColor: '#3b82f6',
              color: '#3b82f6',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                borderColor: '#1e40af',
                color: '#1e40af',
                background: 'rgba(59, 130, 246, 0.04)',
              },
            }}
          >
            View Skills
          </Button>
        </Box>

        {/* Feature Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: { xs: 2, sm: 2.5 },
            width: '100%',
            maxWidth: '1200px',
            mx: 'auto',
            px: { xs: 2, sm: 3 },
          }}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              sx={{
                p: 2.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.35)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.03)',
                transition: 'all 0.2s ease-out',
                position: 'relative',
                overflow: 'hidden',
                maxWidth: '360px',
                mx: 'auto',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.06)',
                  background: 'rgba(255, 255, 255, 0.4)',
                },
              }}
            >
              <Box
                sx={{
                  mb: 1.5,
                  p: 1,
                  borderRadius: '10px',
                  background: 'rgba(59, 130, 246, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {feature.icon}
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 1,
                  color: '#1e40af',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                }}
              >
                {feature.title}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{
                  color: '#475569',
                  lineHeight: 1.5,
                  fontSize: '0.925rem',
                }}
              >
                {feature.description}
              </Typography>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}; 