import React, { useState, useEffect } from 'react';
import { pdfAPI } from '../../services/api';
import { toast } from 'react-toastify';

const HistoryList = () => {
  const [summaries, setSummaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [currentPage]);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const response = await pdfAPI.getHistory(currentPage, 10);
      
      if (response.data.success) {
        setSummaries(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (summaryId) => {
    if (!window.confirm('Are you sure you want to delete this summary?')) {
      return;
    }

    try {
      setIsDeleting(summaryId);
      await pdfAPI.deleteSummary(summaryId);

      toast.success('Summary deleted successfully');

      // Always refresh the entire history to ensure accurate data
      await fetchHistory();

      // If this was the last item on the page and we're not on page 1, go to previous page
      if (summaries.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error deleting summary:', error);
      toast.error('Failed to delete summary');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleViewSummary = async (summaryId) => {
    try {
      const response = await pdfAPI.getSummary(summaryId);
      if (response.data.success) {
        setSelectedSummary(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
      toast.error('Failed to load summary details');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Summary History</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Your PDF summaries from the last 7 days
          {pagination && ` (${pagination.totalItems} total)`}
        </p>
      </div>

      {summaries.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No summaries yet</h3>
          <p className="text-gray-600 dark:text-gray-400">Upload your first PDF to get started!</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {summaries.map((summary) => (
              <div
                key={summary._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                      {summary.filename}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                      {summary.pageCount} pages
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {truncateText(summary.summary)}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span>{formatFileSize(summary.fileSize)}</span>
                    <span>{formatDate(summary.createdAt)}</span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewSummary(summary._id)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(summary._id)}
                      disabled={isDeleting === summary._id}
                      className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting === summary._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                {Math.min(currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                {pagination.totalItems} results
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="px-3 py-2 bg-blue-600 text-white rounded-md">
                  {currentPage}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Summary Modal */}
      {selectedSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedSummary.filename}
              </h3>
              <button
                onClick={() => setSelectedSummary(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{selectedSummary.pageCount}</p>
                  <p className="text-sm text-gray-600">Pages</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatFileSize(selectedSummary.fileSize)}
                  </p>
                  <p className="text-sm text-gray-600">File Size</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatDate(selectedSummary.createdAt)}
                  </p>
                  <p className="text-sm text-gray-600">Created</p>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Summary</h4>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedSummary.summary}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryList;
