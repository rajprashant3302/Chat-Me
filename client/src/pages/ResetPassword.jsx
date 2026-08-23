import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PiLockKeyLight } from 'react-icons/pi';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    if (!data.password || !data.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (data.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    setStatusMessage({ text: "", type: "" });

    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/reset-password`;
      const response = await axios.post(url, {
        token,
        password: data.password
      });

      toast.success(response.data.message);
      setStatusMessage({ text: "Password reset successful! Redirecting to login...", type: "success" });
      
      setTimeout(() => {
        navigate('/email');
      }, 2500);

    } catch (error) {
      const errMsg = error?.response?.data?.message || "Failed to reset password. Link might be invalid or expired.";
      toast.error(errMsg);
      setStatusMessage({ text: errMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 flex justify-center">
      <div className="bg-white w-full max-w-sm mx-2 rounded-md overflow-hidden p-6 shadow-md">
        <div className="w-fit mx-auto rounded-full p-2 bg-slate-100 mb-2">
          <PiLockKeyLight size={60} className="text-primary" />
        </div>
        <h1 className="text-center font-semibold text-2xl mb-2">Reset Password</h1>
        <p className="text-center text-sm text-slate-500 mb-4">
          Please enter your new password below.
        </p>

        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          {/* Status Message */}
          {statusMessage.text && (
            <div
              className={`text-center text-sm font-medium mb-3 ${
                statusMessage.type === "error" ? "text-red-600" : "text-green-600"
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          {/* New Password Field */}
          <div className="relative my-2 w-full">
            <input
              type="password"
              name="password"
              id="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              placeholder=" "
              className="
                peer w-full border-b-2 border-gray-300 bg-transparent px-3 pt-2 pb-2
                focus:border-primary focus:outline-[#00acb4] focus:border-none
              "
              required
            />
            <label
              htmlFor="password"
              className={`
                absolute left-2 px-1 bg-white transition-all duration-200 pointer-events-none
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                peer-focus:top-[-0.7rem] peer-focus:text-sm peer-focus:text-primary
                ${data.password ? "top-[-0.7rem] text-sm text-primary" : "top-4 text-base text-gray-500"}
              `}
            >
              New Password
            </label>
          </div>

          {/* Confirm Password Field */}
          <div className="relative my-2 w-full">
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={data.confirmPassword}
              onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
              placeholder=" "
              className="
                peer w-full border-b-2 border-gray-300 bg-transparent px-3 pt-2 pb-2
                focus:border-primary focus:outline-[#00acb4] focus:border-none
              "
              required
            />
            <label
              htmlFor="confirmPassword"
              className={`
                absolute left-2 px-1 bg-white transition-all duration-200 pointer-events-none
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                peer-focus:top-[-0.7rem] peer-focus:text-sm peer-focus:text-primary
                ${data.confirmPassword ? "top-[-0.7rem] text-sm text-primary" : "top-4 text-base text-gray-500"}
              `}
            >
              Confirm Password
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-6 w-full bg-primary text-white py-2 rounded-md hover:bg-[#009ca4] transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Go back to <Link to="/email" className="hover:text-primary hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
