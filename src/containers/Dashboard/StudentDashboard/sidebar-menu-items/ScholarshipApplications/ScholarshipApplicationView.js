import React from 'react';
import { Box, Button, Typography, Chip } from '@mui/material';
import logoNav from '../../../../Home/images/logonav.png'; // Updated import path for logo

const ScholarshipApplicationView = ({ application, onWithdraw }) => {
  if (!application) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-4">
        <img src={logoNav} alt="IPEPS Logo" className="w-24 h-24 loading-logo" />
        <Typography variant="body1" className="text-gray-600 dark:text-gray-400">
          Select an application to view details
        </Typography>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl h-[calc(100vh-280px)] overflow-hidden w-full flex flex-col">
      {/* Header Section */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={application.companyImage || "http://bij.ly/4ib59B1"}
                alt={application.scholarship_title}
                className="w-full h-full object-contain p-2"
              />
            </div>
            <div>
              <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">
                {application.scholarship_title}
              </Typography>
              <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                {application.company_name}
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 overflow-y-auto h-[calc(100%-180px)]">
        {/* Application Status */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            application.status === 'approved'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : application.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            Status: {application.status}
          </span>
        </div>

        {/* Application Details */}
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <Typography variant="h6" className="font-semibold mb-3 text-gray-900 dark:text-white">
              Application Details
            </Typography>
            <div className="space-y-3">
              <div>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                  Application ID
                </Typography>
                <Typography variant="body1" className="text-gray-900 dark:text-white">
                  {application.application_id}
                </Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                  Applied on
                </Typography>
                <Typography variant="body1" className="text-gray-900 dark:text-white">
                  {formatDate(application.applied_at)}
                </Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                  Last Updated
                </Typography>
                <Typography variant="body1" className="text-gray-900 dark:text-white">
                  {formatDate(application.updated_at)}
                </Typography>
              </div>
            </div>
          </div>

          {/* Scholarship Description */}
          <div>
            <Typography variant="h6" className="font-semibold mb-3 text-gray-900 dark:text-white">
              Scholarship Description
            </Typography>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
              {application.scholarship_description}
            </Typography>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      {application.status === 'pending' && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <Button
            variant="contained"
            fullWidth
            onClick={() => onWithdraw(application.scholarship_posting_id)}
            className="h-12 rounded-xl font-semibold bg-red-600 hover:bg-red-700"
          >
            Withdraw Application
          </Button>
          <Typography variant="caption" className="block text-center mt-2 text-gray-600 dark:text-gray-400">
            You can withdraw your application while it's pending
          </Typography>
        </div>
      )}
    </div>
  );
};

export default ScholarshipApplicationView;