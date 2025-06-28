import React, { useState } from 'react';
import { UploadButton } from '../components/UploadButton';
import { MappingTable } from '../components/MappingTable';

export const Home: React.FC = () => {
  const [sourceFields, setSourceFields] = useState<string[]>([]);
  const [targetFields, setTargetFields] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});

  const handleFileUpload = async (file: File) => {
    // TODO: Implement file processing logic
    console.log('File uploaded:', file.name);
  };

  const handleMappingChange = (source: string, target: string) => {
    setMappings((prev) => ({
      ...prev,
      [source]: target,
    }));
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

        {sourceFields.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Map Your Fields
            </h2>
            <MappingTable
              sourceFields={sourceFields}
              targetFields={targetFields}
              mappings={mappings}
              onMappingChange={handleMappingChange}
            />
          </section>
        )}
      </div>
    </div>
  );
}; 