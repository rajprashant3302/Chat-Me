import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Avatar from './Avatar';
import { MdCall } from "react-icons/md";
import { IoIosVideocam } from "react-icons/io";
import { HiDotsVertical } from "react-icons/hi";
import { FaArrowLeftLong, FaPlus } from "react-icons/fa6";
import { FaRegImage } from "react-icons/fa6";
import uploadFile from '../helpers/uploadFile';
import chatBg from '../assets/chat-bg.png';
import { IoSend, IoClose } from "react-icons/io5";
import Loading from '../components/Loading'
import moment from 'moment'
import { RiCheckFill } from "react-icons/ri";
import { RiCheckDoubleLine } from "react-icons/ri";
import toast from 'react-hot-toast'


const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector(state => state?.user?.socketConnection);
  const user = useSelector(state => state.user);

  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const currentMessage = useRef(null)

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behaviour: "smooth ", block: 'end' })
    }
  })
  const [datauser, setDataUser] = useState({
    name: "",
    _id: "",
    email: "",
    profile_pic: "",
    online: false
  });
  const [message, setMessage] = useState({
    text: "",
    image: {
      imageUrl: "",
      caption: ""

    },
    video: {
      videoUrl: "",
      caption: ""
    },
  });

  const [loading, setLoading] = useState(false)
  const [allMessage, setAllMessage] = useState([])

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload(!openImageVideoUpload);
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true)
    const uploadPhoto = await uploadFile(file);
    setOpenImageVideoUpload(false)
    setMessage(prev => ({
      ...prev,
      image: { ...prev.image, imageUrl: uploadPhoto.url }
    }));
    setLoading(false)
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true)
    const uploadVideo = await uploadFile(file);

    setOpenImageVideoUpload(false)
    setMessage(prev => ({
      ...prev,
      video: { ...prev.video, videoUrl: uploadVideo.url }
    }));
    setLoading(false)
  };

  const handleClosePreview = () => {
    setMessage(prev => ({
      ...prev,
      image: { ...prev.image, imageUrl: "", caption: "" },
      video: { ...prev.video, videoUrl: "", caption: "" }
    }));
  };
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.text || message.image.imageUrl || message.video.videoUrl) {
      if (socketConnection) {
        
        socketConnection.emit('new-message', {
          sender: user?._id,
          receiver: params.userId,
          text: message?.text,
          image: message?.image,
          video: message?.video,
          msgByUserId: user?._id
        })

        setMessage({
          text: "",
          image: {
            imageUrl: "",
            caption: ""
          },
          video: {
            videoUrl: "",
            caption: ""
          }
        })

      }
    }
  }


  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', params.userId);
      socketConnection.emit('seen', params.userId)
      socketConnection.on('message-user', (data) => {
        setDataUser(data);
      });

      socketConnection.on('message', (data) => {

        setAllMessage(data);

      })
    }
  }, [socketConnection, params.userId, user]);

  return (
    <div className="relative h-[calc(100vh-56px)] flex flex-col">
      {/* Header */}
      <header className='flex justify-between items-center h-14 bg-white px-2 sticky top-0 z-20 shadow'>
        <div className='flex gap-3 items-center'>
          <Link to="/" className='md:hidden text-slate-600 hover:text-primary'>
            <FaArrowLeftLong size={24} />
          </Link>
          <Avatar
            userId={datauser._id}
            name={datauser.name}
            imageUrl={datauser.profile_pic}
            email={datauser.email}
            width={45}
            height={45}
          />
          <div className='flex flex-col'>
            <h3 className='font-semibold text-lg  text-ellipsis line-clamp-1'>{datauser.name || "Loading..."}</h3>
            <p className='text-slate-600 text-sm'>
              {datauser.online ? <span className='text-primary'>Online</span> : "Offline"}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-3 text-slate-600'>
          <Link to="/audiocall" ><MdCall size={24} className='hover:text-primary' /></Link>
          <Link to="/videocall" ><IoIosVideocam size={24} className='hover:text-primary' /></Link>
          <HiDotsVertical size={24} className='hover:text-primary' />
        </div>
      </header>

      {/* Messages Section */}
      <section
        className="h-[calc(100vh-128px)] flex-1 overflow-y-auto scrollbar bg-fit bg-center relative "
        style={{ backgroundImage: `url(${chatBg})` }}
      >

        <div className=" flex flex-col " ref={currentMessage}>

          {/* Messages will be mapped here later */}

          {
            allMessage.map((msg, idx) => {
              return (
                <div
                  key={idx}
                  className={`rounded w-fit max-w-[280px] md:max-w-[350px] p-1 py-1 my-1 mx-2 ${user._id === msg.msgByUserId ? "ml-auto bg-teal-200" : "bg-white"
                    }`}
                >
                  {/* Image block */}
                  {msg?.image?.imageUrl && (
                    <div className="bg-white rounded">
                      <img
                        src={msg?.image?.imageUrl}
                        className="w-full h-full object-scale-down rounded-xl"
                        alt="uploaded"
                      />
                      {msg?.image?.caption && (
                        <p
                          className={`px-2 ${user._id === msg.msgByUserId ? "bg-teal-200" : "bg-white"
                            }`}
                        >
                          {msg?.image?.caption}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Video block */}
                  {msg?.video?.videoUrl && (
                    <div className="bg-white rounded">
                      <video
                        src={msg?.video?.videoUrl}
                        className="w-full h-full object-scale-down rounded"
                        controls
                      />
                      {msg?.video?.caption && (
                        <p
                          className={`px-2 ${user._id === msg.msgByUserId ? "bg-teal-200" : "bg-white"
                            }`}
                        >
                          {msg?.video?.caption}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Text block */}
                  {msg.text && (
                    <p className="px-2 break-words  leading-none">{msg.text}</p>
                  )}

                  {/* Time + Tick below message */}
                  <p className="text-xs ml-auto w-fit flex items-center gap-1 text-black">
                    {moment(msg.createdAt).format("hh:mm")}
                    {user._id === msg.msgByUserId && (
                      <>
                        {msg.seen ? (
                          <RiCheckDoubleLine size={12} className="text-green-950" />
                        ) : datauser.online ? (
                          <RiCheckDoubleLine size={12} className="text-slate-500" />
                        ) : (
                          <RiCheckFill size={12} className="text-slate-500" />
                        )}
                      </>
                    )}
                  </p>
                </div>
              );
            })
          }




        </div>


        {/* Image Preview Overlay */}
        {message.image.imageUrl && (
          <div className=" sticky bottom-0 h-full inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center z-30">
            <button onClick={handleClosePreview} className="text-white absolute top-4 right-4">
              <IoClose size={32} />
            </button>
            <div className='  bg-white p-4 rounded shadow flex flex-col items-center'>
              <img src={message.image.imageUrl} alt="Preview" className='w-60 h-60 overflow-hidden object-cover object-center rounded' />
              <form className='flex gap-1' onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Add a caption..."
                  className="border rounded p-2  mt-2"
                  onChange={(e) => setMessage(prev => ({
                    ...prev,
                    image: { ...prev.image, caption: e.target.value }
                  }))}
                  value={message.image.caption}

                />
                <button className="mt-2 bg-primary text-white  px-4 py-2 rounded-full flex items-center gap-2">
                  <IoSend />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* video overlay */}
        {message.video.videoUrl && (
          <div className=" sticky bottom-0 inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center z-30">
            <button onClick={handleClosePreview} className="text-white absolute top-4 right-4">
              <IoClose size={32} />
            </button>
            <div className="bg-white p-4 rounded shadow flex flex-col items-center">
              <video
                src={message.video.videoUrl}
                controls
                className="w-60 h-60 overflow-hidden object-cover object-center rounded"
              />
              <form className="flex gap-1 w-full justify-center" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Add a caption..."
                  className="border rounded p-2 mt-2 w-full"
                  onChange={(e) =>
                    setMessage((prev) => ({
                      ...prev,
                      video: { ...prev.video, caption: e.target.value }
                    }))
                  }
                  value={message.video.caption}
                />
                <button className="mt-2 bg-primary text-white px-4 py-2 rounded-full flex items-center gap-2">
                  <IoSend />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* loading component  */}
        {
          loading && (
            <div className='sticky bottom-0 w-full h-full flex justify-center items-center'>
              <Loading />
            </div>
          )
        }



      </section>

      {/* Message Input Section */}
      <section className='h-14 bg-white flex items-center px-2 sticky bottom-0 z-20'>
        <div className='relative'>
          <button
            onClick={handleUploadImageVideoOpen}
            className='flex justify-center items-center text-slate-800 w-10 h-10 hover:bg-primary hover:text-white rounded-full'
          >
            <FaPlus size={20} />
          </button>
          {openImageVideoUpload && (
            <div className='absolute bottom-12 left-0 bg-white shadow rounded w-28 z-10'>
              <form>
                <label htmlFor='uploadImage' className='flex items-center gap-2 p-2 hover:bg-slate-100 cursor-pointer'>
                  <FaRegImage size={20} />
                  <span>Image</span>
                </label>
                <label htmlFor='uploadVideo' className='flex items-center gap-2 p-2 hover:bg-slate-100 cursor-pointer'>
                  <IoIosVideocam size={20} />
                  <span>Video</span>
                </label>
                <input type="file" id="uploadImage" onChange={handleUploadPhoto} className='hidden' />
                <input type="file" id="uploadVideo" onChange={handleUploadVideo} className='hidden' />
              </form>
            </div>
          )}
        </div>
        <form className=' flex gap-2 items-center w-full h-full p-2' onSubmit={handleSendMessage}>
          <input
            type="text"
            className=" border py-1 px-4 w-full h-full rounded-full outline-none"
            placeholder="Type your message..."
            value={message.text}
            onChange={(e) => setMessage(prev => ({ ...prev, text: e.target.value }))}
          />
          <button className="text-slate-700 hover:text-primary">
            <IoSend size={24} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;
