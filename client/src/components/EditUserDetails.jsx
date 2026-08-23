import  { useState } from 'react';
import { Camera, X } from 'lucide-react';
import { MdEdit } from "react-icons/md";
import uploadFile from '../helpers/uploadFile';
import InteractiveCropper from '../components/InteractiveCropper';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { updateUser } from '../redux/userSlice';
import Avatar from './Avatar';

const EditUserDetails = ({ onClose, data }) => {
    const dispatch = useDispatch();
    const [editData, setEditData] = useState({
        _id: data?._id,
        name: data?.name || "",
        email: data?.email || "",
        profile_pic: data?.profile_pic || "",
    });
    const [isEditingName, setIsEditingName] = useState(false);
    const [previewPic, setPreviewPic] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [rawFile, setRawFile] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    const handleProfilePicChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setRawFile(e.target.files[0]);
            setShowCropper(true);
        }
    };

    const handleCropped = async (croppedFile) => {
        setShowCropper(false);
        setUploadLoading(true);
        toast.loading("Uploading profile photo...", { id: "profile-upload" });

        let localPreviewUrl = null;
        try {
            localPreviewUrl = URL.createObjectURL(croppedFile);
            setPreviewPic(localPreviewUrl);

            // Upload cropped file to Cloudinary
            const uploadPhoto = await uploadFile(croppedFile);

            if (uploadPhoto.secure_url) {
                setEditData(prev => ({ ...prev, profile_pic: uploadPhoto.secure_url }));
                setPreviewPic(uploadPhoto.secure_url);
                URL.revokeObjectURL(localPreviewUrl);
                toast.success("Profile pic updated successfully!", { id: "profile-upload" });

                // Automatically save to database immediately so changes persist on modal close
                const updateUrl = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`;
                const response = await axios.post(updateUrl, {
                    _id: editData._id,
                    name: editData.name,
                    profile_pic: uploadPhoto.secure_url
                });
                if (response.data.success) {
                    dispatch(updateUser(response.data.data));
                }
            } else {
                toast.error("Profile pic upload failed. Please try again.", { id: "profile-upload" });
                setPreviewPic(null);
                URL.revokeObjectURL(localPreviewUrl);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload image.", { id: "profile-upload" });
            setPreviewPic(null);
            if (localPreviewUrl) {
                URL.revokeObjectURL(localPreviewUrl);
            }
        } finally {
            setUploadLoading(false);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editData.profile_pic && editData.profile_pic.startsWith('blob:')) {
            toast.error("Profile picture upload is still in progress or failed.");
            return;
        }
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`;

        try {
            const response = await axios.post(url, editData);
            toast.success(response.data.message);
            if (response.data.success) {
                dispatch(updateUser(response.data.data));
                onClose(); // Close modal on successful update
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error updating profile");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded p-4 m-1 w-full max-w-sm relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black transition"
                >
                    <X size={20} />
                </button>

                <h2 className="text-lg font-semibold text-center mb-2">Profile Details</h2>
                <form className="flex flex-col items-center" onSubmit={handleSubmit}>

                    {/* Profile Picture */}
                    <div className="relative my-4">
                        <Avatar
                            name={editData?.name}
                            imageUrl={ previewPic || editData?.profile_pic}
                            width={90}
                            height={90}

                        />
                        <label
                            htmlFor="profile_pic"
                            className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow cursor-pointer hover:bg-gray-100 transition"
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
                    <div>
                        {
                            editData.profile_pic && (
                            <button type="button" className='text-sm text-red-600 hover:underline' onClick={(e) => setEditData({ ...editData, profile_pic: "" })}>Remove profile pic</button>
                            )
                        }                    
                        </div>

                    {/* Email (non-editable) */}
                    <div className="relative my-2 w-full">
                        <input
                            type="text"
                            value={editData.email}
                            disabled
                            className="w-full border-b-2 border-gray-300 bg-gray-100 px-3 py-2 text-gray-600 cursor-not-allowed"
                        />
                        <label
                            className="absolute left-3 -top-2 text-xs bg-white px-1 text-gray-500"
                        >
                            Email
                        </label>
                    </div>

                    {/* Name */}
                    <div className="relative my-2 w-full">
                        <input
                            type="text"
                            name="name"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            disabled={!isEditingName}
                            placeholder=" "
                            className={`peer w-full border-b-2 px-3 pt-2 pb-1 bg-transparent
                            ${isEditingName ? 'border-[#00acb4]' : 'border-gray-300 text-gray-700'}
                            focus:outline-none`}
                            required
                        />
                        <label
                            htmlFor="name"
                            className={`
                                absolute left-3 bg-white px-1 text-gray-500 transition-all
                                ${editData.name ? '-top-2 text-xs' : 'top-3 text-sm'}
                            `}
                        >
                            Name
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsEditingName(!isEditingName)}
                            className="absolute right-3 top-2 text-gray-500 hover:text-[#00acb4] transition"
                        >
                            <MdEdit size={18} />
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={uploadLoading}
                        className={`mt-4 w-full bg-[#00acb4] text-white py-2 rounded-md hover:bg-[#009ca4] transition ${uploadLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {uploadLoading ? "Uploading Photo..." : "Submit Details"}
                    </button>
                </form>
                {showCropper && (
                    <InteractiveCropper
                        file={rawFile}
                        onCrop={handleCropped}
                        onCancel={() => setShowCropper(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default EditUserDetails;
