import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { pdfAPI } from '../../services/api';
import { toast } from 'react-toastify';

const PDFUpload = ({ onSummaryGenerated }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [summaryOptions, setSummaryOptions] = useState({
    summaryLength: 'medium',
    summaryStyle: 'professional',
    includeKeyPoints: true,
  });

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      toast.error('File size must be less than 10MB');
      return;
    }

    await uploadAndSummarize(file);
  }, [summaryOptions]);

  const uploadAndSummarize = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('summaryLength', summaryOptions.summaryLength);
      formData.append('summaryStyle', summaryOptions.summaryStyle);
      formData.append('includeKeyPoints', summaryOptions.includeKeyPoints);

      const response = await pdfAPI.summarize(formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      if (response.data.success) {
        toast.success('PDF summarized successfully!');
        onSummaryGenerated(response.data.data);
      }
    } catch (error) {
      console.error('Upload error:', error);
      const message = error.response?.data?.message || 'Failed to process PDF';
      toast.error(message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleOptionsChange = (option, value) => {
    setSummaryOptions(prev => ({
      ...prev,
      [option]: value,
    }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Summary Options */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Summary Options</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Summary Length
            </label>
            <select
              value={summaryOptions.summaryLength}
              onChange={(e) => handleOptionsChange('summaryLength', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isUploading}
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Summary Style
            </label>
            <select
              value={summaryOptions.summaryStyle}
              onChange={(e) => handleOptionsChange('summaryStyle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isUploading}
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="academic">Academic</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={summaryOptions.includeKeyPoints}
                onChange={(e) => handleOptionsChange('includeKeyPoints', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded"
                disabled={isUploading}
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Include key points</span>
            </label>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${isUploading ? 'cursor-not-allowed opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">Processing PDF...</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">This may take a few moments</p>
              {uploadProgress > 0 && (
                <div className="mt-2">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{uploadProgress}% uploaded</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500">
              <span className="text-4xl">📄</span>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {isDragActive ? 'Drop your PDF here' : 'Upload a PDF to summarize'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Drag and drop a PDF file here, or click to select
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Maximum file size: 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p className="font-medium mb-2">Supported features:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>PDF files up to 10MB</li>
          <li>Text-based PDFs (images in PDFs are not processed)</li>
          <li>Multiple summary lengths and styles</li>
          <li>Automatic key point extraction</li>
        </ul>
      </div>
    </div>
  );
};

export default PDFUpload;
