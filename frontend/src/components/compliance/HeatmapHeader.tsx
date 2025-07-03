import React, { memo } from 'react';
import { Box, Typography, Chip, useTheme } from '@mui/material';

interface HeatmapHeaderProps {
  stats: {
    total: number;
    high: number;
    medium: number;
    low: number;
  };
  onFilterChange: (filter: string) => void;
  selectedFilter: string;
}

const HeatmapHeader = memo(({ stats, onFilterChange, selectedFilter }: HeatmapHeaderProps) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Global Compliance Heatmap
      </Typography>
      
      <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
        Real-time compliance risk assessment across {stats.total} countries and regions
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
        <Chip 
          label={`All (${stats.total})`}
          onClick={() => onFilterChange('all')}
          sx={{
            fontWeight: 600,
            backgroundColor: selectedFilter === 'all' ? theme.palette.primary.main : theme.palette.grey[100],
            color: selectedFilter === 'all' ? theme.palette.primary.contrastText : theme.palette.text.primary,
            '&:hover': {
              backgroundColor: selectedFilter === 'all' ? theme.palette.primary.dark : theme.palette.grey[200],
            }
          }}
        />
        
        <Chip 
          label={`High Risk (${stats.high})`}
          onClick={() => onFilterChange('High Risk')}
          sx={{
            fontWeight: 600,
            backgroundColor: selectedFilter === 'High Risk' ? theme.palette.error.main : theme.palette.grey[100],
            color: selectedFilter === 'High Risk' ? theme.palette.error.contrastText : theme.palette.text.primary,
            '&:hover': {
              backgroundColor: selectedFilter === 'High Risk' ? theme.palette.error.dark : theme.palette.grey[200],
            }
          }}
        />
        
        <Chip 
          label={`Medium Risk (${stats.medium})`}
          onClick={() => onFilterChange('Medium Risk')}
          sx={{
            fontWeight: 600,
            backgroundColor: selectedFilter === 'Medium Risk' ? theme.palette.warning.main : theme.palette.grey[100],
            color: selectedFilter === 'Medium Risk' ? theme.palette.warning.contrastText : theme.palette.text.primary,
            '&:hover': {
              backgroundColor: selectedFilter === 'Medium Risk' ? theme.palette.warning.dark : theme.palette.grey[200],
            }
          }}
        />
        
        <Chip 
          label={`Low Risk (${stats.low})`}
          onClick={() => onFilterChange('Low Risk')}
          sx={{
            fontWeight: 600,
            backgroundColor: selectedFilter === 'Low Risk' ? theme.palette.success.main : theme.palette.grey[100],
            color: selectedFilter === 'Low Risk' ? theme.palette.success.contrastText : theme.palette.text.primary,
            '&:hover': {
              backgroundColor: selectedFilter === 'Low Risk' ? theme.palette.success.dark : theme.palette.grey[200],
            }
          }}
        />
      </Box>
    </Box>
  );
});

HeatmapHeader.displayName = 'HeatmapHeader';

export default HeatmapHeader; 