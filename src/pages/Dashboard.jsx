import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { pdfAPI } from '../services/api';
import PDFUpload from '../components/pdf/PDFUpload';
import SummaryDisplay from '../components/pdf/SummaryDisplay';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuth();
  const [currentSummary, setCurrentSummary] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoadingStats(true);
      const response = await pdfAPI.getStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleSummaryGenerated = (summary) => {
    setCurrentSummary(summary);
    fetchStats(); // Refresh stats after new summary
  };

  const handleNewSummary = () => {
    setCurrentSummary(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Upload a PDF to generate an AI-powered summary
          </p>
        </div>

        {/* Stats Cards */}
        {!isLoadingStats && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">📄</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Summaries</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats.totalSummaries || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 font-semibold">📊</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Pages</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats.totalPages || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">💾</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Size</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats.totalFileSizeFormatted || '0 Bytes'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 dark:text-orange-400 font-semibold">⚡</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Processing</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats.avgProcessingTimeFormatted || '0ms'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {currentSummary ? (
            <SummaryDisplay 
              summary={currentSummary} 
              onNewSummary={handleNewSummary}
            />
          ) : (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Upload Your PDF
                </h2>
                <p className="text-gray-600">
                  Get an AI-powered summary of your PDF document in seconds
                </p>
              </div>
              
              <PDFUpload onSummaryGenerated={handleSummaryGenerated} />
            </div>
          )}
        </div>

        {/* Quick Tips */}
        {!currentSummary && (
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-4">
              💡 Quick Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span>Upload PDFs up to 10MB in size</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span>Choose from different summary lengths and styles</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span>Text-based PDFs work best (images are not processed)</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span>Your summaries are automatically saved for 7 days</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
