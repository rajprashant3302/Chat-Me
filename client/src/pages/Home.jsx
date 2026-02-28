import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import axios from 'axios';

import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice';
import Sidebar from '../components/Sidebar';
import AuthLayouts from '../layout';
import logo from '../assets/logo.png';

const Home = () => {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const basePath = location.pathname === '/';

    // Fetch user details if token exists
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/email'); // redirect if no token
            return;
        }

        const fetchUserDetails = async () => {
            try {
                const url = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;

                const response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });

                if (response.data.logout) {
                    dispatch(logout());
                    navigate('/email');
                    return;
                }

                dispatch(setUser(response.data.data));
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    dispatch(logout());
                    navigate('/email');
                } else {
                    console.error(error);
                }
            }
        };

        fetchUserDetails();
    }, [dispatch, navigate]);

    // Setup Socket.IO connection
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return; // prevent socket connection if no token

        const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
            auth: { token },
        });

        socketConnection.on('onlineUser', (data) => {
            dispatch(setOnlineUser(data));
        });

        dispatch(setSocketConnection(socketConnection));

        return () => {
            socketConnection.disconnect();
        };
    }, [dispatch]);

    return (
        <AuthLayouts>
            <div className="grid lg:grid-cols-[470px,1fr] h-[520px] max-h-screen">
                
                {/* Sidebar */}
                <section className={`bg-white ${!basePath && "hidden"} md:block`}>
                    <Sidebar />
                </section>

                {/* Message or other pages */}
                <section className={`${basePath && "hidden"}`}>
                    <Outlet />
                </section>

                {/* Logo and prompt when no chat is open */}
                <div className={`flex-col justify-center items-center gap-2 hidden ${!basePath ? "hidden" : "lg:flex"}`}>
                    <div className="flex justify-center items-center">
                        <img src={logo} width={150} alt="logo" />
                        <h1 className="text-[#0a68a2] text-6xl font-cursive">
                            Chat<span className="text-[#2c93c2]">Me</span>
                        </h1>
                    </div>
                    <p className="text-lg text-slate-500">Select User to send message...</p>
                </div>
            </div>
        </AuthLayouts>
    );
};

export default Home;
