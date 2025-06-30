import React from 'react';
import { 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography,
  useTheme,
  Button
} from '@mui/material';

interface UploadPreviewProps {
  headers: string[];
  rows: string[][];
  onContinue: () => void;
}

export const UploadPreview: React.FC<UploadPreviewProps> = ({ headers, rows, onContinue }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Typography variant="h6" sx={{ textAlign: 'center' }}>
        Preview Your Data
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
        Review your uploaded data before proceeding with the mapping process.
      </Typography>

      {/* Data Preview */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Data Preview
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={onContinue}
          >
            Continue to Mapping
          </Button>
        </Box>
        
        <TableContainer 
          component={Paper}
          sx={{ 
            maxHeight: 400,
            width: '100%',
            mb: 3,
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell 
                    key={index}
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: theme.palette.background.paper,
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}; 