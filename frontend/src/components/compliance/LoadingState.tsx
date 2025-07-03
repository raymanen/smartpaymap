import React, { memo } from 'react';
import { Box, Typography, CircularProgress, useTheme } from '@mui/material';

interface LoadingStateProps {
  message?: string;
}

const LoadingState = memo(({ message = 'Loading compliance intelligence...' }: LoadingStateProps) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        minHeight: '300px'
      }}
    >
      <CircularProgress 
        size={40}
        thickness={4}
        sx={{ 
          color: theme.palette.primary.main,
          mb: 2
        }}
      />
      
      <Typography
        variant="body1"
        sx={{
          color: theme.palette.text.secondary,
          fontWeight: 500
        }}
      >
        {message}
      </Typography>
    </Box>
  );
});

LoadingState.displayName = 'LoadingState';

export default LoadingState; 