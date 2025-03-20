import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">You're not allowed to view this page.</p>
        <Link
          to="/"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
        >
          Log In Again
        </Link>
      </div>
    </div>
  );
}

export default Unauthorized