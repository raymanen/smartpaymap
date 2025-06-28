import React from 'react';

interface MappingTableProps {
  sourceFields: string[];
  targetFields: string[];
  mappings: Record<string, string>;
  onMappingChange: (source: string, target: string) => void;
}

export const MappingTable: React.FC<MappingTableProps> = ({
  sourceFields,
  targetFields,
  mappings,
  onMappingChange,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Source Field
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Target Field
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sourceFields.map((source) => (
            <tr key={source}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {source}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={mappings[source] || ''}
                  onChange={(e) => onMappingChange(source, e.target.value)}
                >
                  <option value="">Select target field</option>
                  {targetFields.map((target) => (
                    <option key={target} value={target}>
                      {target}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 