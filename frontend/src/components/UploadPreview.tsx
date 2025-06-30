import React, { useState } from 'react';
import axios from 'axios';
import { 
  Alert, 
  Box, 
  CircularProgress, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography,
  useTheme,
  Divider
} from '@mui/material';
import { MappingTable } from './MappingTable';

interface CSVData {
  headers: string[];
  rows: string[][];
}

export const UploadPreview: React.FC = () => {
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset states
    setLoading(true);
    setError(null);
    setCsvData(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post<CSVData>(
        'http://localhost:8000/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setCsvData(response.data);
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : 'An error occurred while uploading the file'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMappingSubmit = async (finalMappings: Record<string, string>) => {
    try {
      // Here you would typically send the mappings to your backend
      console.log('Final mappings:', finalMappings);
      // You can add the API call to /finalize here when it's ready
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : 'An error occurred while submitting mappings'
      );
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Upload Your Payroll Data
      </Typography>

      {/* File Input */}
      <Box sx={{ mb: 3 }}>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          id="csv-upload"
        />
        <label htmlFor="csv-upload">
          <Paper
            sx={{
              p: 3,
              cursor: 'pointer',
              textAlign: 'center',
              border: '2px dashed #ccc',
              transition: 'border-color 0.2s ease-in-out',
              '&:hover': {
                border: `2px dashed ${theme.palette.primary.main}`,
              },
            }}
          >
            <Typography>
              Click to upload a CSV file or drag and drop here
            </Typography>
          </Paper>
        </label>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Data Preview */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Data Preview
        </Typography>
        <Paper 
          elevation={2}
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            overflow: 'hidden'
          }}
        >
          <TableContainer 
            sx={{
              maxHeight: 400,
              '&::-webkit-scrollbar': {
                width: '8px',
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: theme.palette.grey[100],
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.grey[400],
                borderRadius: '4px',
              },
            }}
          >
            <Table stickyHeader aria-label="csv data preview">
              <TableHead>
                <TableRow>
                  {/* Row Number Header */}
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: theme.palette.grey[100],
                      position: 'sticky',
                      left: 0,
                      zIndex: theme.zIndex.appBar + 1,
                      minWidth: '60px',
                    }}
                  >
                    #
                  </TableCell>
                  {/* Data Headers */}
                  {csvData?.headers.map((header, index) => (
                    <TableCell
                      key={index}
                      sx={{
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '200px',
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {csvData?.rows.map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    sx={{
                      '&:nth-of-type(odd)': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    {/* Row Number */}
                    <TableCell
                      sx={{
                        backgroundColor: theme.palette.grey[50],
                        position: 'sticky',
                        left: 0,
                        fontWeight: 'medium',
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {rowIndex + 1}
                    </TableCell>
                    {/* Row Data */}
                    {row.map((cell, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        sx={{
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          '&:hover': {
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                          },
                        }}
                      >
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {(!csvData?.rows || csvData.rows.length === 0) && (
                  <TableRow>
                    <TableCell 
                      colSpan={csvData?.headers.length ? csvData.headers.length + 1 : 2}
                      sx={{ 
                        textAlign: 'center',
                        py: 4,
                        color: theme.palette.text.secondary
                      }}
                    >
                      No data available. Please upload a CSV file to view the preview.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Mapping Table */}
      {csvData && csvData.headers.length > 0 && (
        <>
          <Divider sx={{ my: 4 }} />
          <MappingTable 
            headers={csvData.headers}
            onSubmit={handleMappingSubmit}
          />
        </>
      )}
    </Box>
  );
}; 