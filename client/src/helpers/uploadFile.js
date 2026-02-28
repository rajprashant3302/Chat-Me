const uploadFile = async (file) => {
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  
  

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset); // correct key

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData
    });

    const responseData = await response.json();
    

    if (!response.ok) {
      throw new Error(`Upload failed: ${responseData.error?.message || response.statusText}`);
    }

    return responseData; // contains secure_url
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

export default uploadFile;
