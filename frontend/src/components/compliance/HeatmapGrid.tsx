import React, { memo } from 'react';
import { Box, Grid, useTheme } from '@mui/material';
import CountryRiskCard from './CountryRiskCard';

interface CountryRisk {
  country: string;
  risk: string;
  level: string;
  config: any;
}

interface HeatmapGridProps {
  countries: CountryRisk[];
  onCountryClick?: (country: string) => void;
}

const HeatmapGrid = memo(({ countries, onCountryClick }: HeatmapGridProps) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {countries.map((country) => (
          <Grid item xs={12} sm={6} md={4} key={country.country}>
            <CountryRiskCard 
              countryData={country}
              onClick={onCountryClick}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});

HeatmapGrid.displayName = 'HeatmapGrid';

export default HeatmapGrid; 