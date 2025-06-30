import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  SelectChangeEvent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import RefreshIcon from '@mui/icons-material/Refresh';

// Standard fields that can be mapped to
const STANDARD_FIELDS = [
  "full_name",      // For employee name fields
  "currency",       // For currency codes/types
  "base_salary",    // For base salary amount
  "bonus",          // For bonus amounts
  "total_salary",   // For combined salary calculations
  "tax_rate",       // For tax percentage/rate
  "location",       // For location/city names
  "employee_id",    // For employee identifiers
  "hire_date",      // For employment/hire dates
  "other"          // For fields that don't match standard categories
] as const;

// Helper function to format field names for display
const formatFieldName = (field: string): string => {
  return field
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

type StandardField = typeof STANDARD_FIELDS[number];

interface MappingTableProps {
  headers: string[];
  rows?: string[][];  // Optional sample data
  onSubmit: (finalMappings: Record<string, string>) => void;
}

interface Mapping {
  suggestedField: StandardField | '';
  isOverridden: boolean;
  originalSuggestion: StandardField | '';
}

interface AnalyzeResponse {
  mappings: Record<string, string>;
  notes: string[];
}

interface LoadingState {
  analyzing: boolean;
  submitting: boolean;
}

interface ErrorState {
  analyze: string | null;
  submit: string | null;
}

interface SubmitState {
  isSubmitted: boolean;
  showSuccess: boolean;
}

export const MappingTable: React.FC<MappingTableProps> = ({ headers, rows = [], onSubmit }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Enhanced state management
  const [mappings, setMappings] = useState<Record<string, Mapping>>({});
  const [loadingState, setLoadingState] = useState<LoadingState>({
    analyzing: true,
    submitting: false
  });
  const [errorState, setErrorState] = useState<ErrorState>({
    analyze: null,
    submit: null
  });
  const [submitState, setSubmitState] = useState<SubmitState>({
    isSubmitted: false,
    showSuccess: false
  });
  const [aiNotes, setAiNotes] = useState<string[]>([]);

  // Derived states for UI control
  const isAnalyzing = loadingState.analyzing;
  const isSubmitting = loadingState.submitting;
  const hasAnalyzeError = Boolean(errorState.analyze);
  const hasSubmitError = Boolean(errorState.submit);
  const allFieldsMapped = Object.values(mappings).every(m => m.suggestedField !== '');
  const canSubmit = allFieldsMapped && !isSubmitting && !hasAnalyzeError && !submitState.isSubmitted;

  // Reset function with enhanced state management
  const handleReset = () => {
    setSubmitState({
      isSubmitted: false,
      showSuccess: false
    });
    setErrorState({
      analyze: null,
      submit: null
    });
    
    // Reset mappings to original AI suggestions
    const resetMappings: Record<string, Mapping> = {};
    Object.entries(mappings).forEach(([header, mapping]) => {
      resetMappings[header] = {
        ...mapping,
        suggestedField: mapping.originalSuggestion,
        isOverridden: false
      };
    });
    setMappings(resetMappings);
  };

  // Fetch AI suggestions with enhanced error handling
  useEffect(() => {
    const fetchMappingSuggestions = async () => {
      try {
        setLoadingState(prev => ({ ...prev, analyzing: true }));
        setErrorState(prev => ({ ...prev, analyze: null }));

        const response = await axios.post<AnalyzeResponse>('http://localhost:8000/analyze', {
          headers,
          rows
        });

        // Transform API response into our mapping format
        const initialMappings: Record<string, Mapping> = {};
        headers.forEach(header => {
          const suggestion = response.data.mappings[header] || '';
          initialMappings[header] = {
            suggestedField: suggestion as StandardField,
            isOverridden: false,
            originalSuggestion: suggestion as StandardField
          };
        });

        setMappings(initialMappings);
        setAiNotes(response.data.notes);
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : '⚠ Failed to load mapping suggestions';
        setErrorState(prev => ({ ...prev, analyze: errorMessage }));
      } finally {
        setLoadingState(prev => ({ ...prev, analyzing: false }));
      }
    };

    if (headers.length > 0) {
      fetchMappingSuggestions();
    }
  }, [headers]);

  // Handle mapping changes with accessibility
  const handleMappingChange = (header: string, newValue: string) => {
    setMappings(prev => ({
      ...prev,
      [header]: {
        ...prev[header],
        suggestedField: newValue as StandardField,
        isOverridden: newValue !== prev[header].originalSuggestion
      }
    }));
  };

  // Get status icon based on mapping state
  const getStatusIcon = (mapping: Mapping) => {
    if (!mapping.suggestedField) {
      return <ErrorIcon color="error" titleAccess="Unmapped field" />;
    }
    if (mapping.isOverridden) {
      return <WarningIcon color="warning" titleAccess="Manually overridden" />;
    }
    return <CheckCircleIcon color="success" titleAccess="Accepted AI suggestion" />;
  };

  // Get icon for AI note based on content
  const getNoteIcon = (note: string) => {
    const lowerNote = note.toLowerCase();
    if (lowerNote.includes('missing')) {
      return <ErrorIcon color="error" />;
    }
    if (lowerNote.includes('merge') || lowerNote.includes('warning')) {
      return <WarningIcon color="warning" />;
    }
    return <InfoIcon color="info" />;
  };

  // Enhanced submit handler with loading states
  const handleSubmit = async () => {
    try {
      setLoadingState(prev => ({ ...prev, submitting: true }));
      setErrorState(prev => ({ ...prev, submit: null }));

      const finalMappings: Record<string, string> = {};
      Object.entries(mappings).forEach(([header, mapping]) => {
        if (mapping.suggestedField) {
          finalMappings[header] = mapping.suggestedField;
        }
      });

      await onSubmit(finalMappings);

      setSubmitState({
        isSubmitted: true,
        showSuccess: true
      });

      // Auto-hide success message
      setTimeout(() => {
        setSubmitState(prev => ({
          ...prev,
          showSuccess: false
        }));
      }, 5000);

    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : '❌ Failed to submit mappings';
      setErrorState(prev => ({ ...prev, submit: errorMessage }));
    } finally {
      setLoadingState(prev => ({ ...prev, submitting: false }));
    }
  };

  // Loading state UI
  if (isAnalyzing) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: 200,
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography color="text.secondary">
          Loading suggestions...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Field Mapping Suggestions
      </Typography>

      {/* Error Alerts */}
      {errorState.analyze && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          role="alert"
        >
          {errorState.analyze}
        </Alert>
      )}

      {errorState.submit && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          role="alert"
        >
          {errorState.submit}
        </Alert>
      )}

      {submitState.showSuccess && (
        <Alert 
          severity="success" 
          sx={{ mb: 2 }}
          role="alert"
        >
          ✅ Mappings saved successfully!
        </Alert>
      )}

      {/* Mapping Table */}
      <Paper 
        elevation={2} 
        sx={{ 
          mb: 3,
          overflow: 'hidden' // Ensures clean mobile scrolling
        }}
      >
        <TableContainer 
          sx={{ 
            maxHeight: 400,
            width: '100%',
            overflowX: isMobile ? 'auto' : 'hidden'
          }}
        >
          <Table 
            stickyHeader 
            aria-label="field mapping table"
          >
            <TableHead>
              <TableRow>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    backgroundColor: 'background.paper',
                    minWidth: isMobile ? 150 : 'auto'
                  }}
                >
                  CSV Header
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    backgroundColor: 'background.paper',
                    minWidth: isMobile ? 200 : 'auto'
                  }}
                >
                  Standard Field
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    backgroundColor: 'background.paper',
                    width: 100,
                    minWidth: isMobile ? 100 : 'auto'
                  }}
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {headers.map(header => (
                <TableRow key={header}>
                  <TableCell>{header}</TableCell>
                  <TableCell>
                    <FormControl 
                      fullWidth 
                      size="small"
                      error={!mappings[header]?.suggestedField}
                    >
                      <Select
                        value={mappings[header]?.suggestedField || ''}
                        onChange={(e: SelectChangeEvent) => 
                          handleMappingChange(header, e.target.value)
                        }
                        disabled={submitState.isSubmitted}
                        renderValue={(value) => formatFieldName(value as string)}
                        aria-label={`Map ${header} to standard field`}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {STANDARD_FIELDS.map(field => (
                          <MenuItem 
                            key={field} 
                            value={field}
                            aria-label={formatFieldName(field)}
                          >
                            {formatFieldName(field)}
                            {field === 'other' && ' (Unmapped Field)'}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    {mappings[header] && getStatusIcon(mappings[header])}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <LoadingButton
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!canSubmit}
          loading={isSubmitting}
          loadingPosition="start"
          startIcon={submitState.isSubmitted ? <CheckCircleIcon /> : undefined}
        >
          {isSubmitting ? 'Submitting mappings...' : 
           submitState.isSubmitted ? '✅ Submitted!' : 
           'Submit Mappings'}
        </LoadingButton>

        {submitState.isSubmitted && (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={handleReset}
            aria-label="Reset mappings and try again"
          >
            Try Again
          </Button>
        )}
      </Box>

      {/* AI Notes Section */}
      {aiNotes.length > 0 && (
        <Box 
          sx={{ mt: 3, mb: 3 }}
          role="complementary"
          aria-label="AI suggestions and notes"
        >
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Notes from AI
          </Typography>
          <Paper elevation={1} sx={{ p: 2, backgroundColor: 'background.paper' }}>
            <List dense>
              {aiNotes.map((note, index) => (
                <ListItem 
                  key={index}
                  role="listitem"
                  aria-label={`AI Note ${index + 1}`}
                >
                  <ListItemIcon>
                    {getNoteIcon(note)}
                  </ListItemIcon>
                  <ListItemText primary={note} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      )}
    </Box>
  );
}; 