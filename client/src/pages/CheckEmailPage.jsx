import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import {PiUserCircle} from 'react-icons/pi'

const CheckEmailPage = () => {
  const [data, setData] = useState({
   email: "",
  });

  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
  const navigate=useNavigate()




  const handlesubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/email`

    try {
      const response = await axios.post(url, data);
     
      toast.success(response.data.message);
      if (response.data.success) {
        setStatusMessage({ text: "Email Verified !", type: "success" });
        setData({
          email: ""
      })
      navigate('/password' , {state:response?.data.data})
      

    }
    } catch (error) {
    toast.error(error?.response?.data?.message);
    setStatusMessage({ text: "Server not responding !", type: "error" });
  }
}

return (
  <div className="mt-6 flex justify-center  ">
    <div className="bg-white w-full max-w-sm mx-2 rounded-md overflow-hidden p-6">
      <h1 className="text-center font-semibold text-2xl mb-4">Welcome Back to ChatMe!</h1>

      <form className="flex flex-col items-center max-w-sm" onSubmit={handlesubmit}>

        {/* Profile Picture Circular Input */}
        <div className="w-fit mx-auto rounded-full object-cover  ">
          <PiUserCircle
          size={90}/>
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

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 w-full bg-primary text-white py-2 rounded-md hover:bg-[#009ca4] transition"
        >
          Validate Email
        </button>

      </form>
      <p className='text-center mt-4 text-sm'>New User ? <Link to={"/register"} className="hover:text-primary hover:underline">Create Account</Link></p>
    </div>
  </div>
);
};

export default CheckEmailPage;
