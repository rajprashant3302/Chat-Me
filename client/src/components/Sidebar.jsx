import React, { useEffect, useState } from 'react'
import { IoChatbubbleEllipses } from 'react-icons/io5'
import { FaUserPlus } from 'react-icons/fa'
import { BiLogOut } from 'react-icons/bi'
import { Link, NavLink } from 'react-router-dom'
import Avatar from './Avatar'
import { useSelector } from 'react-redux'
import { GoHomeFill } from "react-icons/go";
import { FaPlusCircle } from "react-icons/fa";
import { FiArrowUpLeft } from "react-icons/fi";
import EditUserDetails from './EditUserDetails'
import Divider from './Divider'
import SearchUser from './SearchUser'
import { FaRegImage } from "react-icons/fa6";
import { IoVideocam } from "react-icons/io5";
import { FaBug } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';
import toast from 'react-hot-toast';


const Sidebar = () => {
    const user = useSelector(state => state?.user)
    const [editUserOpen, setEditUserOpen] = useState(false)
    const [allUser, setAllUser] = useState([])
    const [openSearchUser, setOpensearchUser] = useState(false)
    const socketConnection = useSelector(state => state?.user?.socketConnection);


const navigate = useNavigate();
const dispatch = useDispatch();
const handleLogout = async () => {
    try {
        // Call backend logout route to clear cookie
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/logout`, {
            withCredentials: true,
        });

        // Remove token from localStorage
        localStorage.removeItem('token');

        // Dispatch Redux logout
        dispatch(logout());

        // Optional toast
        toast.success('Logged out successfully');

        // Redirect to login
        navigate('/email');
    } catch (error) {
        console.error(error);
        toast.error('Logout failed');
    }
};





    useEffect(() => {
        if (socketConnection) {
            socketConnection.emit('sidebar', user._id)

            socketConnection.on('conversation', (data) => {


                const conversationUserData = data.map((conversationUser, index) => {
                    if (conversationUser?.sender?._id === conversationUser?.receiver?._id) {
                        return {
                            ...conversationUser,
                            userDetails: conversationUser?.sender
                        }
                    }
                    else if (conversationUser?.receiver?._id !== user?._id) {
                        return {
                            ...conversationUser,
                            userDetails: conversationUser.receiver
                        }
                    } else {
                        return {
                            ...conversationUser,
                            userDetails: conversationUser.sender
                        }
                    }
                })

                setAllUser(conversationUserData)
            })
        }
    }, [socketConnection, user])


    return (
        <div className='h-full w-full grid grid-cols-[48px_1fr] bg-white max-w-full'>

            <div className='w-12 h-full bg-slate-100 rounded-tr-lg rounded-br-lg py-5 text-slate-600  flex flex-col justify-between'>
                <div>
                    <NavLink className={() => `w-12 h-12 flex justify-center items-center cursor-pointer   hover:bg-slate-200 rounded $
{isActive &&  'bg-slate-200 '}`} title="Home" >
                        <GoHomeFill size={27} />
                    </NavLink>

                    <NavLink className={(isActive) => `w-12 h-12 flex justify-center items-center cursor-pointer   hover:bg-slate-200 rounded $
${isActive && 'bg-slate-200 '}`} title="chat" >
                        <IoChatbubbleEllipses size={25} />
                    </NavLink>

                    <NavLink className={() => `w-12 h-12 flex justify-center items-center cursor-pointer   hover:bg-slate-200 rounded `} title="Discover">
                        <FaPlusCircle size={25} />
                    </NavLink>


                    <NavLink onClick={() => setOpensearchUser(true)} className={() => `w-12 h-12 flex justify-center items-center cursor-pointer   hover:bg-slate-200 rounded `} title="addFriend">
                        <FaUserPlus size={25} />
                    </NavLink>
                </div>
                <div >
                    <NavLink to="https://forms.gle/a8RSLBz6iLbeQ9xL8" className={() => `w-12 h-12 flex justify-center items-center cursor-pointer   hover:bg-slate-200 rounded`} title="Feedback">
                        <FaBug size={25} />
                    </NavLink>

                    <div title={user.name} className="w-12 h-12 flex justify-center items-center cursor-pointer   hover:bg-slate-200 rounded " onClick={() => setEditUserOpen(true)} >
                        <Avatar
                            width={30}
                            height={30}
                            name={user.name}
                            imageUrl={user.profile_pic}
                            userId={user._id} />
                    </div>
                    <button
                        title="logout"
                        onClick={handleLogout}
                        className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
                    >
                        <span className='-ml-2'>
                            <BiLogOut size={25} />
                        </span>
                    </button>

                </div>
            </div>
            <div className=''>
                <div className='h-14 flex items-center'>
                    <h2 className='font-2xl font-semibold px-3 text-slate-800 '>Messages</h2>
                </div>
                <Divider />
                <div className=' h-[calc(100vh-122px)] overflow-x-hidden overflow-y-auto scrollbar'>
                    {
                        allUser.length === 0 && (
                            <div className='p-2 flex flex-col justify-center items-center w-full h-full'>
                                <div className='text-slate-500 flex justify-center items-center'>
                                    <FiArrowUpLeft size={50} />
                                </div>
                                <p className='text-center text-slate-400 text-lg'>Explore users to start a conversation </p>
                            </div>
                        )
                    }
                    {

                        allUser.map((msg, idx) => {
                            return (
                                <NavLink to={"/" + msg?.userDetails?._id} key={msg?._id} >
                                    <div className="flex items-center w-full max-w-full px-2 py-2 hover:bg-slate-50 transition-all rounded cursor-pointer">

                                        <div className="mr-3">
                                            <Avatar
                                                userId={msg?.userDetails._id}
                                                imageUrl={msg?.userDetails?.profile_pic}
                                                name={msg?.userDetails?.name}
                                                width={40}
                                                height={40}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center w-full overflow-hidden">
                                                <h3 className="font-semibold text-slate-800 truncate">{msg?.userDetails?.name}</h3>
                                                {msg?.unseenMsg > 0 && (
                                                    <div className="flex-shrink-0 ml-2">
                                                        <span className="bg-green-500 text-white text-xs px-1.5 py-1 rounded-full">
                                                            {msg?.unseenMsg}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-slate-500 text-xs truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-full flex items-center gap-1">
                                                {msg?.lastMsg?.text
                                                    ? msg.lastMsg.text
                                                    : msg?.lastMsg?.image?.imageUrl
                                                        ? (<><FaRegImage size={14} /> Image</>)
                                                        : (<><IoVideocam size={14} /> Video</>)
                                                }
                                            </p>

                                        </div>
                                    </div>
                                    <Divider />

                                </NavLink>
                            )
                        })
                    }


                </div>

            </div>
            {/* edit user details */}
            {
                editUserOpen && <EditUserDetails onClose={() => setEditUserOpen(false)} data={user} />
            }

            {/* search user */}
            {
                openSearchUser && (
                    <SearchUser onClose={() => setOpensearchUser(false)} />
                )
            }
        </div >
    )
}

export default Sidebar
