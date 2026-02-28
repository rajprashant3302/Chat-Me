import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'
import uploadFile from '../helpers/uploadFile'
import axios from 'axios'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: ""
  });

  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
  const navigate=useNavigate()


  // upload photo section
  const handleProfilePicChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Show instant preview
      const localPreviewUrl = URL.createObjectURL(file);
      setData({ ...data, profile_pic: localPreviewUrl });

      try {
        // Upload to Cloudinary
        const uploadPhoto = await uploadFile(file);

        setStatusMessage({ text: "Profile Pic Uploaded SuccessFully !", type: "success" });

        if (uploadPhoto.secure_url) {
          // Replace local preview with actual Cloudinary URL
          setData(prev => ({ ...prev, profile_pic: uploadPhoto.secure_url }));
          URL.revokeObjectURL(localPreviewUrl);
        } else {
          console.error("Upload failed: No secure_url returned");
          setStatusMessage({ text: "Error: No secure URL returned from Cloudinary", type: "error" });
        }
      } catch (error) {
        setStatusMessage({ text: "Error uploading profile picture", type: "error" });

      }
    }
  };


  const handlesubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/register`

    try {
      const response = await axios.post(url, data);
      toast.success(response.data.message);
      if (response.data.success) {
        setStatusMessage({ text: "Registered Successfully !", type: "success" });
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: ""
      })
      navigate('/email')
    }
    } catch (error) {
    toast.error(error?.response?.data?.message);
    setStatusMessage({ text: "Server not responding !", type: "error" });
  }
}

return (
  <div className="mt-6 flex justify-center  ">
    <div className="bg-white w-full max-w-sm mx-2 rounded-md overflow-hidden p-6">
      <h1 className="text-center font-semibold text-2xl mb-4">Welcome to ChatMe!</h1>

      <form className="flex flex-col items-center max-w-sm" onSubmit={handlesubmit}>

        {/* Profile Picture Circular Input */}
        <div className="relative my-4">
          <img
            src={
              data.profile_pic ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name || "User")}&backgroundColor=#00acb4`
            }
            alt="profile_pic"

            className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 hover:border-[#00acb4]"
          />
          <label
            htmlFor="profile_pic"
            className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow cursor-pointer hover:bg-gray-100 transition"
          >
            <Camera className="w-4 h-4 text-gray-600" />
          </label>
          <input
            type="file"
            id="profile_pic"
            accept="image/*"
            onChange={handleProfilePicChange}
            className="hidden"
          />
        </div>

        {/* message */}
        {statusMessage.text && (
          <div
            className={`text-center text-sm font-medium mt-2 ${statusMessage.type === "error" ? "text-red-600" : "text-green-600"
              }`}
          >
            {statusMessage.text}
          </div>
        )}


        {/* Name Field */}
        <div className="relative my-2 w-full">
          <input
            type="text"
            name="name"
            id="name"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            placeholder=" "
            className="
                peer w-full border-b-2 border-gray-300 bg-transparent px-3 pt-2 pb-2
                focus:border-primary focus:outline-[#00acb4] focus:border-none
              "
            required
          />
          <label
            htmlFor="name"
            className={`
                absolute left-2 px-1 bg-white transition-all duration-200 pointer-events-none
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                peer-focus:top-[-0.7rem] peer-focus:text-sm peer-focus:text-primary
                ${data.name ? "top-[-0.7rem] text-sm text-primary" : "top-4 text-base text-gray-500"}
              `}
          >
            Name
          </label>
        </div>

        {/* Email Field */}
        <div className="relative my-2  w-full">
          <input
            type="email"
            name="email"
            id="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
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
                ${data.email ? "top-[-0.7rem] text-sm text-primary" : "top-4 text-base text-gray-500"}
              `}
          >
            Email
          </label>
        </div>

        {/* Password Field */}
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
            Password
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 w-full bg-primary text-white py-2 rounded-md hover:bg-[#009ca4] transition"
        >
          Register
        </button>

      </form>
      <p className='text-center mt-4 text-sm'>Already have an account ? <Link to={"/email"} className="hover:text-primary hover:underline">Login</Link></p>
    </div>
  </div>
);
};

export default RegisterPage;
