'use client';

import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  email: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

interface AzureStatus {
  azureUrl: string;
  fileExists: boolean;
  fileProperties: any;
  allFilesInBizPulse: string[];
  localFilePath: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [azureStatus, setAzureStatus] = useState<AzureStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseURL = process.env.NEXT_PUBLIC_API_URL || `http://localhost:${process.env.NEXT_PUBLIC_API_PORT || 5000}/api/v1`;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersRes, azureRes] = await Promise.all([
        fetch(`${baseURL}/users`),
        fetch(`${baseURL}/users/azure-status`)
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.data.users);
      }

      if (azureRes.ok) {
        const azureData = await azureRes.json();
        setAzureStatus(azureData.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadToAzure = async () => {
    try {
      const response = await fetch(`${baseURL}/users/upload-to-azure`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const result = await response.json();
        alert('Upload successful!');
        fetchData(); // Refresh data
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      alert('Upload error: ' + error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Azure Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Azure Status</h2>
            {azureStatus && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Azure URL:</strong></p>
                    <a href={azureStatus.azureUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {azureStatus.azureUrl}
                    </a>
                  </div>
                  <div>
                    <p><strong>File Exists:</strong> {azureStatus.fileExists ? '✅ Yes' : '❌ No'}</p>
                    <p><strong>Local Path:</strong> {azureStatus.localFilePath}</p>
                  </div>
                </div>
                
                {azureStatus.fileProperties && (
                  <div className="mt-4">
                    <p><strong>File Properties:</strong></p>
                    <pre className="bg-white p-2 rounded text-sm overflow-x-auto">
                      {JSON.stringify(azureStatus.fileProperties, null, 2)}
                    </pre>
                  </div>
                )}

                <div className="mt-4">
                  <p><strong>Files in Biz-Pulse folder:</strong></p>
                  <ul className="list-disc list-inside">
                    {azureStatus.allFilesInBizPulse.map((file, index) => (
                      <li key={index} className="text-sm">{file}</li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={uploadToAzure}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Upload to Azure
                </button>
              </div>
            )}
          </div>

          {/* Users List */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Registered Users ({users.length})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left border-b">ID</th>
                    <th className="px-4 py-2 text-left border-b">Email</th>
                    <th className="px-4 py-2 text-left border-b">Roles</th>
                    <th className="px-4 py-2 text-left border-b">Created</th>
                    <th className="px-4 py-2 text-left border-b">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b text-sm font-mono">{user.id.substring(0, 8)}...</td>
                      <td className="px-4 py-2 border-b">{user.email}</td>
                      <td className="px-4 py-2 border-b">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {user.roles.join(', ')}
                        </span>
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {new Date(user.updatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
