import { memo } from 'react';
import {
  Box,
  Card,
  Typography,
  Chip,
} from '@mui/material';
import {
  SmartToy,
  Shield,
  AutoAwesome,
  Policy,
  Security,
  FileDownload,
} from '@mui/icons-material';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import type { FeatureCardProps } from '../../types/components';

// Icon mapping
const ICON_COMPONENTS = {
  SmartToy,
  Shield,
  AutoAwesome,
  Policy,
  Security,
  FileDownload,
} as const;

const FeatureCard = memo(({ 
  feature
}: FeatureCardProps) => {
  const [ref, isInView] = useScrollAnimation(0.4);
  const IconComponent = ICON_COMPONENTS[feature.icon as keyof typeof ICON_COMPONENTS];
  
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
          {IconComponent ? <IconComponent sx={{ fontSize: 24 }} /> : <SmartToy sx={{ fontSize: 24 }} />}
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

FeatureCard.displayName = 'FeatureCard';

export default FeatureCard; 