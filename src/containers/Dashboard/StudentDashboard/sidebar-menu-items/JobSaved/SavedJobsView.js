import React from "react";

const SavedJobsView = ({
  job = {},
  isApplied = false,
  canWithdraw = false,
  applicationTime = null,
  onApply = () => {},
  onWithdraw = () => {},
}) => {
  // Format salary with commas for better readability
  const formatSalary = (value) => value?.toLocaleString() || "N/A";

  // Calculate remaining time for withdrawal
  const getTimeRemaining = () => {
    if (!applicationTime) return null;
    const timeLeft = applicationTime + 24 * 60 * 60 * 1000 - Date.now();
    if (timeLeft <= 0) return null;

    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m remaining to withdraw`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden max-w-2xl mx-auto">
      {/* Company Image */}
      <div className="h-64 bg-gray-100 dark:bg-gray-700 flex justify-center items-center">
        <img
          src={job.companyImage || "/placeholder.png"}
          alt={`Logo of ${job.company || "Company"}`}
          className="w-full h-full object-contain p-4"
        />
      </div>

      <div className="p-6">
        {/* Job Title and Company */}
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
          {job.job_title || "Job Title"}
        </h2>
        <h3 className="text-xl text-blue-600 dark:text-blue-400 mb-3">
          {job.company || "Company Name"}
        </h3>

        {/* Job Details */}
        <div className="space-y-2 text-gray-700 dark:text-gray-300 mb-6">
          <p>
            📍 {job.city_municipality || "City"}, {job.country || "Country"}
          </p>
          <p>💼 {job.job_type || "Job Type"}</p>
          <p>👥 Vacancies: {job.no_of_vacancies || 0}</p>
          <p>
            💰 ${formatSalary(job.estimated_salary_from)} - $
            {formatSalary(job.estimated_salary_to)}
          </p>
          <p>
            🎓 {job.certificate_received || "N/A"} from{" "}
            {job.training_institution || "N/A"}
          </p>
          <p>🛠️ Skills: {job.other_skills || "None"}</p>
        </div>

        {/* Apply/Withdraw Button */}
        <div className="mb-6">
          <button
            onClick={isApplied && canWithdraw ? onWithdraw : onApply}
            className={`w-full py-2 rounded-md font-semibold text-white transition ${
              isApplied
                ? canWithdraw
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isApplied
              ? canWithdraw
                ? "Withdraw Application"
                : "Already Applied"
              : "Apply"}
          </button>
          {/* Remaining Time */}
          {isApplied && canWithdraw && (
            <p className="text-sm text-red-500 text-center mt-2">
              {getTimeRemaining()}
            </p>
          )}
        </div>

        {/* Divider */}
        <hr className="border-gray-300 dark:border-gray-600 mb-6" />

        {/* Work Description */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Work Description
          </h4>
          <p className="text-gray-700 dark:text-gray-300">
            {job.job_description || "No description available"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SavedJobsView;
