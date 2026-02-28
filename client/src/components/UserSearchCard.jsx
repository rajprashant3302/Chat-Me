
import Avatar from './Avatar'
import { Link } from 'react-router-dom'

const UserSearchCard = ({user,onClose}) => {
  console.log("user",user)
  return (
    <Link to={"/"+user?._id}  onClick={onClose} className='flex gap-4 md:gap-7 p-2 items-center mt-2 border-2 border-transparent border-b-slate-200 hover:border-2 hover:border-primary rounded hover:cursor-pointer'>
      <div>
        <Avatar
          width={45}
          height={45}
          name={user?.name}
          imageUrl={user?.profile_pic}
          userId={user?._id}
        />
      </div>
      <div className='flex flex-col justify-center items-center'>
        <div className='font-semibold text-ellipsis line-clamp-1  '>
            {user?.name}
        </div>
        <p className='text-sm text-slate-400 text-ellipsis line-clamp-1'>{user?.email}</p>
      </div>
    </Link>
  )
}

export default UserSearchCard
