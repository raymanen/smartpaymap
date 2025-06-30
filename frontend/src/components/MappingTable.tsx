import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Autocomplete,
  TextField,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import AutorenewIcon from '@mui/icons-material/Autorenew';

interface MappingTableProps {
  headers: string[];
  rows?: string[][];
  onSubmit: (mappings: Record<string, string>) => void;
}

// Backend response type
interface AnalyzeResponse {
  mappings: Record<string, string>;
  notes: string[];
}

// State for each field mapping
interface FieldMapping {
  currentValue: string;
  originalSuggestion: string;
  isOverridden: boolean;
}

// Available standard fields for mapping
const standardFields = [
  "full_name",
  "first_name",
  "last_name", 
  "currency",
  "currency_code",
  "basic_salary",
  "salary",
  "bonus",
  "tax_rate",
  "country_code",
  "city",
  "location",
  "employee_id",
  "hire_date",
  "total_salary",
  "other"
];

export const MappingTable: React.FC<MappingTableProps> = ({ headers, rows = [], onSubmit }) => {
  // State management
  const [mappings, setMappings] = useState<Record<string, FieldMapping>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiNotes, setAiNotes] = useState<string[]>([]);

  // Fetch AI suggestions when component mounts
  useEffect(() => {
    fetchMappingSuggestions();
  }, [headers]);

  // Fetch mapping suggestions from backend
  const fetchMappingSuggestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          headers,
          rows: rows.slice(0, 5) // Send first 5 rows as sample data
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get mapping suggestions');
      }

      const data: AnalyzeResponse = await response.json();
      
      // Initialize mappings state with AI suggestions
      const initialMappings: Record<string, FieldMapping> = {};
      headers.forEach(header => {
        const suggestion = data.mappings[header] || '';
        initialMappings[header] = {
          currentValue: suggestion,
          originalSuggestion: suggestion,
          isOverridden: false
        };
      });

      setMappings(initialMappings);
      setAiNotes(data.notes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze headers');
    } finally {
      setLoading(false);
    }
  };

  // Handle field mapping changes
  const handleMappingChange = (header: string, newValue: string | null) => {
    setMappings(prev => ({
      ...prev,
      [header]: {
        ...prev[header],
        currentValue: newValue || '',
        isOverridden: (newValue || '') !== prev[header].originalSuggestion
      }
    }));
  };

  // Reset a field to AI suggestion
  const handleResetField = (header: string) => {
    setMappings(prev => ({
      ...prev,
      [header]: {
        ...prev[header],
        currentValue: prev[header].originalSuggestion,
        isOverridden: false
      }
    }));
  };

  // Get status for a field mapping
  const getFieldStatus = (mapping: FieldMapping) => {
    if (!mapping.currentValue) {
      return {
        icon: <ErrorIcon color="error" />,
        text: 'Failed to map',
        color: 'error.main'
      };
    }
    if (mapping.currentValue === mapping.originalSuggestion && mapping.originalSuggestion) {
      return {
        icon: <CheckCircleIcon color="success" />,
        text: 'AI Suggested',
        color: 'success.main'
      };
    }
    return {
      icon: <WarningIcon color="warning" />,
      text: 'Modified',
      color: 'warning.main'
    };
  };

  // Check if all fields are mapped
  const areAllFieldsMapped = () => {
    return headers.every(header => mappings[header]?.currentValue);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!areAllFieldsMapped()) {
      setError('Please map all fields before submitting');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Convert mappings to the format expected by parent
      const finalMappings: Record<string, string> = {};
      Object.entries(mappings).forEach(([header, mapping]) => {
        finalMappings[header] = mapping.currentValue;
      });

      await onSubmit(finalMappings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save mappings');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6" sx={{ textAlign: 'center' }}>
        Map Your Fields
      </Typography>

      {error && (
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>CSV Header</TableCell>
              <TableCell>Map To</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {headers.map((header) => {
              const mapping = mappings[header];
              const status = mapping ? getFieldStatus(mapping) : { icon: <ErrorIcon color="error" />, text: 'Not initialized', color: 'error.main' };

              return (
                <TableRow key={header}>
                  <TableCell>{header}</TableCell>
                  <TableCell>
                    <Autocomplete
                      value={mapping?.currentValue || null}
                      onChange={(_, newValue) => handleMappingChange(header, newValue)}
                      options={standardFields}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          error={!mapping?.currentValue}
                          placeholder={mapping?.originalSuggestion || 'Select field...'}
                          helperText={mapping?.originalSuggestion ? `AI suggests: ${mapping.originalSuggestion}` : ''}
                        />
                      )}
                      disabled={submitting}
                      renderOption={(props, option) => (
                        <li {...props}>
                          {option === mapping?.originalSuggestion ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                              <span>{option.replace(/_/g, ' ')}</span>
                              <Chip 
                                size="small" 
                                label="AI Suggested" 
                                color="success" 
                                sx={{ ml: 'auto' }}
                              />
                            </Box>
                          ) : (
                            option.replace(/_/g, ' ')
                          )}
                        </li>
                      )}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      {status.icon}
                      <Typography variant="body2" sx={{ color: status.color }}>
                        {status.text}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {mapping?.isOverridden && mapping.originalSuggestion && (
                      <Button
                        startIcon={<AutorenewIcon />}
                        size="small"
                        onClick={() => handleResetField(header)}
                        title="Reset to AI suggestion"
                      >
                        Reset
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {aiNotes.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            AI Suggestions
          </Typography>
          <List dense>
            {aiNotes.map((note, index) => (
              <ListItem key={index}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <InfoIcon color="info" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={note} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting || !areAllFieldsMapped()}
          sx={{ minWidth: 200 }}
        >
          {submitting ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Saving...
            </>
          ) : (
            'Save Mappings'
          )}
        </Button>
      </Box>
    </Box>
  );
}; 