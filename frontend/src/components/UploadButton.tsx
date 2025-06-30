import React, { useState } from 'react';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface UploadButtonProps {
  onUpload: (headers: string[], rows: string[][]) => void;
}

export const UploadButton: React.FC<UploadButtonProps> = ({ onUpload }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      
      if (!data.headers || !data.rows || !Array.isArray(data.headers) || !Array.isArray(data.rows)) {
        throw new Error('Invalid response format');
      }

      onUpload(data.headers, data.rows);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload file');
    } finally {
      setLoading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        width: '100%',
        maxWidth: '600px',
      }}
    >
      <Typography variant="h6" sx={{ textAlign: 'center' }}>
        Upload Your CSV File
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
        Select a CSV file containing your payroll data to begin the mapping process.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      )}

      <Button
        component="label"
        variant="contained"
        startIcon={loading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
        disabled={loading}
        sx={{
          px: 4,
          py: 1.5,
          minWidth: 180,
        }}
      >
        {loading ? 'Uploading...' : 'Choose File'}
        <input
          type="file"
          accept=".csv"
          hidden
          onChange={handleFileChange}
          disabled={loading}
        />
      </Button>
    </Box>
  );
}; 