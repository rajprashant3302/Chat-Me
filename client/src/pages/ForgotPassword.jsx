import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PiKeyLight } from 'react-icons/pi';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    if (!email) {
      toast.error("Email is required");
      return;
    }

    setLoading(true);
    setStatusMessage({ text: "", type: "" });

    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/forgot-password`;
      const response = await axios.post(url, { email });

      toast.success(response.data.message);
      setStatusMessage({ text: response.data.message, type: "success" });
      setEmail("");
    } catch (error) {
      const errMsg = error?.response?.data?.message || "Failed to send reset link. Please try again.";
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
          <PiKeyLight size={60} className="text-primary" />
        </div>
        <h1 className="text-center font-semibold text-2xl mb-2">Forgot Password?</h1>
        <p className="text-center text-sm text-slate-500 mb-4">
          Enter your email address and we'll send you a link to reset your password.
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

          {/* Email Field */}
          <div className="relative my-2 w-full">
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              className="
                peer w-full border-b-2 border-gray-300 bg-transparent px-3 pt-2 pb-2
                focus:border-primary focus:outline-[#00acb4] focus:border-none
              "
              required
            />
            <label
              htmlFor="email"
              className={`
                absolute left-2 px-1 bg-white transition-all duration-200 pointer-events-none
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                peer-focus:top-[-0.7rem] peer-focus:text-sm peer-focus:text-primary
                ${email ? "top-[-0.7rem] text-sm text-primary" : "top-4 text-base text-gray-500"}
              `}
            >
              Email
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
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Remembered password? <Link to="/email" className="hover:text-primary hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
