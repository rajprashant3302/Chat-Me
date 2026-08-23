const cropToSquare = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const size = Math.min(img.width, img.height);
                canvas.width = 400; // Optimal size for avatar
                canvas.height = 400;
                const ctx = canvas.getContext('2d');
                
                // Center-crop calculations
                const sx = (img.width - size) / 2;
                const sy = (img.height - size) / 2;
                
                ctx.drawImage(img, sx, sy, size, size, 0, 0, 400, 400);
                
                canvas.toBlob((blob) => {
                    if (blob) {
                        const croppedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now()
                        });
                        resolve(croppedFile);
                    } else {
                        reject(new Error("Canvas conversion to Blob failed"));
                    }
                }, file.type || 'image/jpeg');
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

export default cropToSquare;
