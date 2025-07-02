import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  useTheme,
  useMediaQuery,
  Alert,
  Button,
  CircularProgress,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';
import { UploadButton } from '../components/UploadButton';
import { UploadPreview } from '../components/UploadPreview';
import { MappingTable } from '../components/MappingTable';
import PolicySimulationPanel from '../components/PolicySimulationPanel';

const steps = ['Upload CSV', 'Preview Data', 'Map Fields', 'Policy Simulation'];

export const MappingPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<{ headers: string[]; rows: string[][] } | null>(null);
  const [savedMappings, setSavedMappings] = useState<Record<string, string> | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleUpload = (uploadedHeaders: string[], uploadedRows: string[][]) => {
    setHeaders(uploadedHeaders);
    setPreviewData({ headers: uploadedHeaders, rows: uploadedRows });
    setActiveStep(1);
  };

  const handleMappingSubmit = async (mappings: Record<string, string>) => {
    try {
      const response = await fetch('http://localhost:8000/finalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mappings }),
      });

      if (!response.ok) {
        throw new Error('Failed to save mappings');
      }

      // Save mappings for export functionality
      setSavedMappings(mappings);
      // Handle success
      setActiveStep(3);
    } catch (error) {
      console.error('Error saving mappings:', error);
      // Re-throw the error so MappingTable can handle it properly
      throw error;
    }
  };

  const handleExport = async () => {
    if (!previewData || !savedMappings) {
      console.error('Missing data for export');
      return;
    }

    try {
      setExportLoading(true);

      // Convert rows from List[List[str]] to List[Dict[str, str]]
      const rowsAsObjects = previewData.rows.map(row => {
        const rowObject: Record<string, string> = {};
        previewData.headers.forEach((header, index) => {
          rowObject[header] = row[index] || '';
        });
        return rowObject;
      });

      const response = await fetch('http://localhost:8000/export_standardized', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rows: rowsAsObjects,
          mappings: savedMappings,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      // Get the filename from the response headers
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '') 
        : 'standardized_export.csv';

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const renderSuccessMessage = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        py: 4,
      }}
    >
      <CheckCircleOutlineIcon
        sx={{
          fontSize: 64,
          color: 'success.main',
          mb: 2,
        }}
      />
      <Typography variant="h4" sx={{ mb: 2, color: 'success.main' }}>
        Mappings Saved Successfully!
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', maxWidth: 600 }}>
        Your CSV field mappings have been saved and are ready to use. You can now proceed with your data processing.
      </Typography>
      <Alert severity="success" sx={{ mb: 4, width: '100%', maxWidth: 600 }}>
        All fields have been mapped and validated successfully.
      </Alert>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={() => setActiveStep(4)}
          sx={{ minWidth: 120 }}
        >
          Policy Simulation
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleExport}
          disabled={exportLoading || !savedMappings}
          sx={{ minWidth: 120 }}
        >
          {exportLoading ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              Exporting...
            </>
          ) : (
            'Export CSV'
          )}
        </Button>
        <Button
          variant="outlined"
          onClick={() => setActiveStep(0)}
          sx={{ minWidth: 120 }}
        >
          Map Another File
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          sx={{ minWidth: 120 }}
        >
          Go to Home
        </Button>
      </Box>
    </Box>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <UploadButton onUpload={handleUpload} />;
      case 1:
        return previewData ? (
          <UploadPreview 
            headers={previewData.headers}
            rows={previewData.rows}
            onContinue={() => setActiveStep(2)}
          />
        ) : null;
      case 2:
        return <MappingTable headers={headers} onSubmit={handleMappingSubmit} />;
      case 3:
        return renderSuccessMessage();
      case 4:
        return previewData ? (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ mb: 1, color: 'primary.main' }}>
                Policy Simulation
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Analyze the impact of policy changes on your payroll data
              </Typography>
            </Box>
            <PolicySimulationPanel 
              headers={previewData.headers}
              rows={previewData.rows}
            />
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => setActiveStep(3)}
                sx={{ minWidth: 120 }}
              >
                Back to Summary
              </Button>
            </Box>
          </Box>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography
        variant="h2"
        sx={{
          mb: 2,
          fontSize: { xs: '1.75rem', md: '2rem' },
          fontWeight: 600,
          color: 'text.primary',
          textAlign: 'center',
          width: '100%',
        }}
      >
        CSV Mapping
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{
          mb: { xs: 4, sm: 6 },
          width: '100%',
          color: 'text.secondary',
          textAlign: 'center',
          maxWidth: '800px',
          mx: 'auto',
        }}
      >
        Upload your CSV file and let our AI assistant help you map the fields correctly.
        We'll guide you through the process step by step.
      </Typography>

      <Box
        sx={{
          width: '100%',
          mb: { xs: 4, sm: 6 },
        }}
      >
        <Stepper
          activeStep={activeStep}
          alternativeLabel={!isMobile}
          orientation={isMobile ? 'vertical' : 'horizontal'}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Card
        sx={{
          width: '100%',
          p: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {renderStepContent()}
      </Card>
    </Box>
  );
}; 