import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Avatar from '../components/Avatar';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/userSlice';

const CheckPassword = () => {
  const [data, setData] = useState({
    password: "",
  });


  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {

  const userId = location?.state?._id;

  if (!userId) {
    navigate('/email');
  }

}, [location?.state?._id, navigate])



  const handlesubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/password`

    try {

      const response = await axios({
        method: 'post',
        url: url,
        data: {
          password: data.password,
          _id: location?.state._id
        },
        withCredentials: true,
      });

      toast.success(response.data.message);

      if (!response.data.success) {
        dispatch(setToken(response.data?.token))
        localStorage.setItem('token', response.data?.token)
        console.log("data", response)
        setData({
          password: ""
        })
      }
      navigate('/')
    } catch (error) {

      toast.error(error?.response?.data?.message);

    }
  }

  return (
    <div className="mt-6 flex justify-center  ">
      <div className="bg-white w-full max-w-sm mx-2 rounded-md overflow-hidden p-6">
        <h1 className="text-center font-semibold text-2xl mb-4">Welcome Back to ChatMe!</h1>

        <form className="flex flex-col items-center max-w-sm" onSubmit={handlesubmit}>

          {/* Profile Picture Circular Input */}
          <div className="relative my-4">
            <Avatar
              name={location?.state?.name}
              imageUrl={location?.state?.profile_pic}
              width={90}
              height={90}
            />
          </div>
          <div>
            <h1 className='text-center'>{location?.state?.name}</h1>
          </div>


          {/*Password  Field */}
          <div className="relative my-2  w-full">
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
            Login
          </button>

        </form>
        <p className='text-center mt-4 text-sm'>Reset your password ? <Link to={"/forgot-password"} className="hover:text-primary hover:underline">Forgot Password</Link></p>
      </div>
    </div>
  );
};

export default CheckPassword;
