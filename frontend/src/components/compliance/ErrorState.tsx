import React, { memo } from 'react';
import { Box, Typography, Button, Alert, useTheme } from '@mui/material';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState = memo(({ error, onRetry }: ErrorStateProps) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto'
      }}
    >
      <Alert
        severity="error"
        icon={<ErrorIcon />}
        sx={{
          borderRadius: 2,
          mb: 2,
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          Error Loading Data
        </Typography>
        
        <Typography variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          onClick={onRetry}
          size="small"
          sx={{
            fontWeight: 600,
            textTransform: 'none'
          }}
        >
          Try Again
        </Button>
      </Alert>
    </Box>
  );
});

ErrorState.displayName = 'ErrorState';

export default ErrorState; 