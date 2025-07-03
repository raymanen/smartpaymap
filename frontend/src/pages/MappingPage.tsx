import React, { useState } from 'react';
import {
  Step,
  StepLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';
import { UploadButton } from '../components/UploadButton';
import { UploadPreview } from '../components/UploadPreview';
import { MappingTable } from '../components/MappingTable';
import PolicySimulationPanel from '../components/PolicySimulationPanel';
import {
  MappingContainer,
  MappingTitle,
  MappingSubtitle,
  MappingStepper,
  StepCard,
  SuccessContainer,
  SuccessIcon,
  SuccessTitle,
  SuccessDescription,
  ButtonContainer,
  PrimaryButton,
  SecondaryButton,
  LoadingContainer
} from '../styles/components/MappingPage.styles';


const steps = ['Upload CSV', 'Preview Data', 'Map Fields', 'Policy Simulation'];

export const MappingPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<{ headers: string[]; rows: string[][] } | null>(null);
  const [savedMappings, setSavedMappings] = useState<Record<string, string> | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const navigate = useNavigate();

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
    <SuccessContainer>
      <SuccessIcon>
        <CheckCircleOutlineIcon sx={{ fontSize: 'inherit' }} />
      </SuccessIcon>
      <SuccessTitle variant="h4">
        Mappings Saved Successfully!
      </SuccessTitle>
      <SuccessDescription variant="body1">
        Your CSV field mappings have been saved and are ready to use. You can now proceed with your data processing.
      </SuccessDescription>
      <Alert severity="success" sx={{ mb: 4, width: '100%', maxWidth: 600 }}>
        All fields have been mapped and validated successfully.
      </Alert>
      <ButtonContainer>
        <PrimaryButton
          variant="contained"
          onClick={() => setActiveStep(4)}
        >
          Policy Simulation
        </PrimaryButton>
        <PrimaryButton
          variant="contained"
          color="success"
          onClick={handleExport}
          disabled={exportLoading || !savedMappings}
        >
          {exportLoading ? (
            <LoadingContainer>
              <CircularProgress size={16} />
              Exporting...
            </LoadingContainer>
          ) : (
            'Export CSV'
          )}
        </PrimaryButton>
        <SecondaryButton
          variant="outlined"
          onClick={() => setActiveStep(0)}
        >
          Map Another File
        </SecondaryButton>
        <SecondaryButton
          variant="outlined"
          onClick={() => navigate('/')}
        >
          Go to Home
        </SecondaryButton>
      </ButtonContainer>
    </SuccessContainer>
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
        return (
          <MappingTable 
            headers={headers}
            onSubmit={handleMappingSubmit}
          />
        );
      case 3:
        return renderSuccessMessage();
      case 4:
        return previewData ? (
          <PolicySimulationPanel 
            headers={previewData.headers}
            rows={previewData.rows}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <MappingContainer>
      <MappingTitle variant="h2">
        Payroll Data Mapping
        </MappingTitle>
        <MappingSubtitle variant="subtitle1">
          Map your CSV fields to standardized payroll data fields using our AI-powered system
        </MappingSubtitle>
        
        <MappingStepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </MappingStepper>
        
        <StepCard>
          {renderStepContent()}
        </StepCard>
      </MappingContainer>
  );
}; 