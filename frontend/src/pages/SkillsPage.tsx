import React from 'react';
import {
  Box,
  Card,
  Typography,
  useTheme,
} from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';
import ApiIcon from '@mui/icons-material/Api';
import CloudIcon from '@mui/icons-material/Cloud';
import CodeIcon from '@mui/icons-material/Code';

const skills = [
  {
    title: 'Data Visualization',
    description: 'Interactive charts and graphs for data analysis',
    icon: <AutoGraphIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Authentication',
    description: 'Secure user authentication and authorization',
    icon: <SecurityIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Database Design',
    description: 'Efficient schema design and optimization',
    icon: <StorageIcon fontSize="large" color="primary" />,
  },
  {
    title: 'API Development',
    description: 'RESTful and GraphQL API implementation',
    icon: <ApiIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Cloud Services',
    description: 'AWS and Azure cloud infrastructure',
    icon: <CloudIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Full Stack',
    description: 'End-to-end web application development',
    icon: <CodeIcon fontSize="large" color="primary" />,
  },
];

export const SkillsPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header Section */}
      <Box sx={{ width: '100%', mb: { xs: 4, sm: 6 } }}>
        <Typography
          variant="h2"
          sx={{
            mb: 2,
            fontSize: { xs: '1.75rem', md: '2rem' },
            fontWeight: 600,
            color: 'text.primary',
            textAlign: 'center',
          }}
        >
          Engineering Skills
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            color: 'text.secondary',
            maxWidth: '800px',
            width: '100%',
            mx: 'auto',
            textAlign: 'center',
          }}
        >
          Explore our range of engineering capabilities through interactive demos and examples.
          Each project showcases different aspects of modern web development.
        </Typography>
      </Box>

      {/* Skills Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: { xs: 2, sm: 3 },
          width: '100%',
        }}
      >
        {skills.map((skill, index) => (
          <Card
            key={index}
            sx={{
              height: '100%',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[4],
              },
            }}
          >
            <Box sx={{ mb: 2 }}>{skill.icon}</Box>
            <Typography
              variant="h6"
              sx={{
                mb: 1,
                color: 'primary.main',
                fontWeight: 600,
              }}
            >
              {skill.title}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
            >
              {skill.description}
            </Typography>
          </Card>
        ))}
      </Box>
    </Box>
  );
}; 