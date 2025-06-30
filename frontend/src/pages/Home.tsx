import React, { useState } from 'react';
import { UploadButton } from '../components/UploadButton';
import { MappingTable } from '../components/MappingTable';
import { Alert, Snackbar } from '@mui/material';
import axios from 'axios';

interface UploadResponse {
  headers: string[];
  rows: string[][];
}

export const Home: React.FC = () => {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post<UploadResponse>(
        'http://localhost:8000/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setHeaders(response.data.headers);
      setRows(response.data.rows);
    } catch (error) {
      console.error('Error uploading file:', error);
      setNotification({
        open: true,
        message: 'Failed to upload file. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleSubmitMappings = async (finalMappings: Record<string, string>) => {
    try {
      const response = await axios.post('http://localhost:8000/finalize', {
        mappings: finalMappings
      });

      if (response.data.mapping_saved) {
        setNotification({
          open: true,
          message: 'Mappings saved successfully!',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error saving mappings:', error);
      setNotification({
        open: true,
        message: 'Failed to save mappings. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        SmartPayMap
      </h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Upload Your Payroll Data
          </h2>
          <UploadButton onUpload={handleFileUpload} />
        </section>

        {headers.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Map Your Fields
            </h2>
            <MappingTable
              headers={headers}
              rows={rows}
              onSubmit={handleSubmitMappings}
            />
          </section>
        )}
      </div>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
}; 