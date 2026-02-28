import React from 'react';
import { useNavigate } from 'react-router-dom';

const AudioCall = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full  flex justify-center items-center ">
      <div className="px-6 py-8 w-80 mt-28 bg-white border border-slate-300 rounded-2xl shadow-lg text-center">
        <h1 className="text-2xl font-semibold text-slate-800 mb-3">Video Call</h1>
        <p className="text-slate-600 mb-4">
          This feature will be available soon for premium users.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition"
        >
          Back to Your Page
        </button>
      </div>
    </div>
  );
};

export default AudioCall;
