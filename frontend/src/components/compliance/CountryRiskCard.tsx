import React, { memo } from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';

// Risk level configuration
const RISK_LEVELS = {
  'Low Risk': {
    color: '#059669',
    bgColor: '#10b981',
    borderColor: '#10b981',
    icon: '🟢',
    priority: 1
  },
  'Medium Risk': {
    color: '#d97706',
    bgColor: '#f59e0b',
    borderColor: '#f59e0b',
    icon: '🟡',
    priority: 2
  },
  'Moderate': {
    color: '#d97706',
    bgColor: '#f59e0b',
    borderColor: '#f59e0b',
    icon: '🟡',
    priority: 2
  },
  'High Risk': {
    color: '#dc2626',
    bgColor: '#ef4444',
    borderColor: '#ef4444',
    icon: '🔴',
    priority: 3
  }
};

interface CountryRisk {
  country: string;
  risk: string;
  level: string;
  config: typeof RISK_LEVELS[keyof typeof RISK_LEVELS];
}

interface CountryRiskCardProps {
  countryData: CountryRisk;
  onClick?: (country: string) => void;
}

const CountryRiskCard = memo(({ countryData, onClick }: CountryRiskCardProps) => {
  const theme = useTheme();
  const { country, risk, level, config } = countryData;
  
  const handleClick = () => {
    if (onClick) {
      onClick(country);
    }
  };
  
  return (
    <Paper
      elevation={1}
      onClick={handleClick}
      sx={{
        p: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        borderLeft: `4px solid ${config.borderColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        transition: theme.transitions.create(['transform', 'box-shadow']),
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[2],
        } : {},
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box 
          sx={{ 
            width: 32, 
            height: 32, 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mr: 2,
            fontSize: '1.25rem',
            backgroundColor: 'transparent'
          }}
        >
          {config.icon}
        </Box>
        
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {country}
          </Typography>
          
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            {risk}
          </Typography>
        </Box>
      </Box>
      
      <Box 
        sx={{ 
          px: 2, 
          py: 0.5, 
          borderRadius: 1, 
          backgroundColor: `${config.bgColor}20`, 
          color: config.color,
          fontWeight: 600,
          fontSize: '0.75rem',
        }}
      >
        {level}
      </Box>
    </Paper>
  );
});

CountryRiskCard.displayName = 'CountryRiskCard';

export default CountryRiskCard; 