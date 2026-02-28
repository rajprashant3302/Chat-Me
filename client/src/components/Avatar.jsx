
import {PiUserCircle} from 'react-icons/pi'
import { useSelector } from 'react-redux'


const Avatar = ({ userId, name, imageUrl , width ,height }) => {

    const onlineUser =useSelector(state=>state?.user?.onlineUser)
    const isOnline=onlineUser.includes(userId)
    
    return (
        
        
        <div className='text-slate-800  rounded-full relative '>
            {
                imageUrl ? (
                <img
                    src = { imageUrl }
                    width = {width}
                    height = { height}
                    alt = { name }
                    className='overflow-hidden object-scale-down rounded-full border-2 border-[#00acb4]'
                />
                 ) :(
            name ? (
                <img 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || "User")}&backgroundColor=#00acb4`}
                alt="profile_pic"
                style={{width : width+"px", height : height+"px" }}
                className=" rounded-full object-cover border-2 border-gray-300 hover:border-[#00acb4]"
                />
            ):(
            <div className="w-50 h-50 rounded-full  mx-auto p-2 " >
                <PiUserCircle
                    size={width } />
            </div>
            )
            )
        }
        {
            isOnline && (
                <div className='bg-green-600 p-1 absolute bottom-1 right-[2.5px] z-999 rounded-full'></div>
            )
        }
        
        </div>
    )
}

export default Avatar
