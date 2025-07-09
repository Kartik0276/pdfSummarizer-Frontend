import React, { useState } from 'react';

const SummaryDisplay = ({ summary, onNewSummary }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!summary) {
    return null;
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatProcessingTime = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-green-800 dark:text-green-400">
                Summary Generated Successfully
              </h2>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                File: {summary.filename}
              </p>
            </div>
            <button
              onClick={onNewSummary}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Summarize Another PDF
            </button>
          </div>
        </div>

        {/* File Statistics */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{summary.pageCount}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pages</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatFileSize(summary.fileSize)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">File Size</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {summary.stats?.compressionRatio || 0}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Compression</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {formatProcessingTime(summary.processingTime)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Processing Time</p>
            </div>
          </div>
        </div>

        {/* Summary Content */}
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Summary</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>
                {summary.stats?.originalWordCount || 0} words → {summary.stats?.summaryWordCount || 0} words
              </span>
            </div>
          </div>

          <div className="prose max-w-none">
            <div
              className={`text-gray-700 dark:text-gray-300 leading-relaxed ${
                !isExpanded && summary.summary.length > 500 ? 'line-clamp-6' : ''
              }`}
            >
              {summary.summary.split('\n').map((paragraph, index) => {
                const trimmedParagraph = paragraph.trim();

                if (!trimmedParagraph) {
                  return <br key={index} />;
                }

                // Handle markdown-style headers
                if (trimmedParagraph.startsWith('##')) {
                  return (
                    <h3 key={index} className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                      {trimmedParagraph.replace(/^##\s*/, '')}
                    </h3>
                  );
                }

                if (trimmedParagraph.startsWith('#')) {
                  return (
                    <h2 key={index} className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-4">
                      {trimmedParagraph.replace(/^#\s*/, '')}
                    </h2>
                  );
                }

                // Handle bold text
                if (trimmedParagraph.startsWith('**') && trimmedParagraph.endsWith('**')) {
                  return (
                    <p key={index} className="font-semibold text-gray-900 dark:text-white mb-3">
                      {trimmedParagraph.replace(/^\*\*|\*\*$/g, '')}
                    </p>
                  );
                }

                // Handle numbered lists
                if (/^\d+\.\s/.test(trimmedParagraph)) {
                  return (
                    <div key={index} className="mb-2 pl-4">
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {trimmedParagraph.match(/^\d+\./)[0]}
                      </span>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        {trimmedParagraph.replace(/^\d+\.\s*/, '')}
                      </span>
                    </div>
                  );
                }

                // Handle bullet points
                if (trimmedParagraph.startsWith('•') || trimmedParagraph.startsWith('-')) {
                  return (
                    <div key={index} className="mb-2 pl-4 flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 mr-2 mt-1">•</span>
                      <span className="text-gray-700 dark:text-gray-300">{trimmedParagraph.replace(/^[•-]\s*/, '')}</span>
                    </div>
                  );
                }

                // Regular paragraphs
                return (
                  <p key={index} className="mb-4 last:mb-0 text-gray-700 dark:text-gray-300">
                    {trimmedParagraph}
                  </p>
                );
              })}
            </div>

            {summary.summary.length > 500 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
              >
                {isExpanded ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(summary.summary);
                // You could add a toast notification here
              }}
              className="px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Copy Summary
            </button>
            
            <button
              onClick={() => {
                const element = document.createElement('a');
                const file = new Blob([summary.summary], { type: 'text/plain' });
                element.href = URL.createObjectURL(file);
                element.download = `${summary.filename.replace('.pdf', '')}_summary.txt`;
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
              className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Download Summary
            </button>

            <button
              onClick={() => {
                const printWindow = window.open('', '_blank');
                printWindow.document.write(`
                  <html>
                    <head>
                      <title>Summary - ${summary.filename}</title>
                      <style>
                        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                        h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
                        .meta { color: #666; margin-bottom: 20px; }
                        .summary { margin-top: 20px; }
                      </style>
                    </head>
                    <body>
                      <h1>PDF Summary</h1>
                      <div class="meta">
                        <p><strong>File:</strong> ${summary.filename}</p>
                        <p><strong>Generated:</strong> ${new Date(summary.createdAt).toLocaleString()}</p>
                        <p><strong>Pages:</strong> ${summary.pageCount}</p>
                      </div>
                      <div class="summary">
                        ${summary.summary.split('\n').map(p => `<p>${p}</p>`).join('')}
                      </div>
                    </body>
                  </html>
                `);
                printWindow.document.close();
                printWindow.print();
              }}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Print Summary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryDisplay;
