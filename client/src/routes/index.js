import { createBrowserRouter } from 'react-router-dom'
import App from "../App"
import RegisterPage from "../pages/RegisterPage"
import CheckEmailPage from '../pages/CheckEmailPage'
import CheckPassword from '../pages/CheckPassword'
import Home from '../pages/Home'
import MessagePage from '../components/MessagePage'
import AuthLayouts from '../layout'
import ForgotPassword from '../pages/ForgotPassword'
import AudioCall from '../pages/AudioCall'
import VideoCall from '../pages/VideoCall'


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "register",
                element: <AuthLayouts><RegisterPage /></AuthLayouts>

            },
            {
                path: "email",
                element: <AuthLayouts><CheckEmailPage /></AuthLayouts>
            },
            {
                path: "password",
                element: <AuthLayouts><CheckPassword /></AuthLayouts>
            },
            {
                path: "forgot-password",
                element: <AuthLayouts><ForgotPassword /></AuthLayouts>
            },
            {
                path: "audiocall",
                element: <AuthLayouts><AudioCall /></AuthLayouts>
            },
            {
                path: "videocall",
                element: <AuthLayouts><VideoCall /></AuthLayouts>
            },
            {
                path: "",
                element: <Home />,
                children: [
                    {
                        path: ':userId',
                        element: <MessagePage />
                    }
                ]
            }
        ]
    }
])

export default router