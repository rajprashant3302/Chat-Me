import React, { useState, useEffect, useRef } from 'react';

const InteractiveCropper = ({ file, onCrop, onCancel }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
    const [renderedSize, setRenderedSize] = useState({ width: 0, height: 0 });
    
    // Crop region coordinates relative to the rendered image
    const [crop, setCrop] = useState({ x: 0, y: 0, size: 150 });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    
    // Track cursor and start position
    const dragStart = useRef({ x: 0, y: 0, cropX: 0, cropY: 0, cropSize: 0 });
    const imgRef = useRef(null);
    const containerRef = useRef(null);

    // Read file
    useEffect(() => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => setImageSrc(e.target.result);
        reader.readAsDataURL(file);
    }, [file]);

    // Handle image load to initialize crop dimensions
    const handleImageLoad = (e) => {
        const img = e.target;
        const nw = img.naturalWidth;
        const nh = img.naturalHeight;
        setNaturalSize({ width: nw, height: nh });

        const rw = img.clientWidth;
        const rh = img.clientHeight;
        setRenderedSize({ width: rw, height: rh });

        // Start with a centered crop square of 70% of the minimum dimension
        const initialSize = Math.min(rw, rh) * 0.7;
        const initialX = (rw - initialSize) / 2;
        const initialY = (rh - initialSize) / 2;

        setCrop({
            x: Math.round(initialX),
            y: Math.round(initialY),
            size: Math.round(initialSize)
        });
    };

    // Recalculate rendered dimensions on window resize
    useEffect(() => {
        const handleResize = () => {
            if (imgRef.current) {
                const rw = imgRef.current.clientWidth;
                const rh = imgRef.current.clientHeight;
                setRenderedSize({ width: rw, height: rh });
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Drag start handler (differentiates between dragging the crop box vs resizing it)
    const handleStart = (e, type) => {
        e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        dragStart.current = {
            x: clientX,
            y: clientY,
            cropX: crop.x,
            cropY: crop.y,
            cropSize: crop.size
        };

        if (type === 'resize') {
            setIsResizing(true);
        } else if (type === 'drag') {
            setIsDragging(true);
        }
    };

    // Move handler
    useEffect(() => {
        const handleMove = (e) => {
            if (!isDragging && !isResizing) return;
            e.preventDefault();
            
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const dx = clientX - dragStart.current.x;
            const dy = clientY - dragStart.current.y;

            if (isDragging) {
                // Keep inside boundaries
                let nextX = dragStart.current.cropX + dx;
                let nextY = dragStart.current.cropY + dy;

                nextX = Math.max(0, Math.min(nextX, renderedSize.width - crop.size));
                nextY = Math.max(0, Math.min(nextY, renderedSize.height - crop.size));

                setCrop(prev => ({ ...prev, x: nextX, y: nextY }));
            }

            if (isResizing) {
                // Resize relative to bottom-right corner (maintain 1:1 aspect ratio)
                const delta = Math.max(dx, dy); // Use max delta to maintain square
                let nextSize = dragStart.current.cropSize + delta;

                // Enforce minimum size of 60px
                nextSize = Math.max(60, nextSize);

                // Enforce boundaries
                const maxSize = Math.min(
                    renderedSize.width - dragStart.current.cropX,
                    renderedSize.height - dragStart.current.cropY
                );
                nextSize = Math.min(nextSize, maxSize);

                setCrop(prev => ({ ...prev, size: nextSize }));
            }
        };

        const handleEnd = () => {
            setIsDragging(false);
            setIsResizing(false);
        };

        if (isDragging || isResizing) {
            window.addEventListener('mousemove', handleMove, { passive: false });
            window.addEventListener('mouseup', handleEnd);
            window.addEventListener('touchmove', handleMove, { passive: false });
            window.addEventListener('touchend', handleEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [isDragging, isResizing, crop.size, renderedSize]);

    const handleSave = () => {
        if (!imgRef.current) return;
        
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');

        // Scale factors from screen dimensions to actual image file dimensions
        const scaleX = naturalSize.width / renderedSize.width;
        const scaleY = naturalSize.height / renderedSize.height;

        const actualX = crop.x * scaleX;
        const actualY = crop.y * scaleY;
        const actualSize = crop.size * Math.min(scaleX, scaleY);

        ctx.drawImage(
            imgRef.current,
            actualX,
            actualY,
            actualSize,
            actualSize,
            0,
            0,
            400,
            400
        );

        canvas.toBlob((blob) => {
            if (blob) {
                const croppedFile = new File([blob], file.name, {
                    type: file.type || 'image/jpeg',
                    lastModified: Date.now()
                });
                onCrop(croppedFile);
            }
        }, file.type || 'image/jpeg');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[60] p-4 select-none">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-5 flex flex-col items-center">
                <h3 className="font-semibold text-lg mb-2 text-slate-800">Crop Profile Photo</h3>
                <p className="text-xs text-slate-500 mb-4 text-center">
                    Drag the square to move. Drag the bottom-right corner to resize.
                </p>

                {/* Cropping Workspace Container */}
                <div 
                    ref={containerRef}
                    className="relative w-full max-h-[300px] bg-slate-900 flex justify-center items-center overflow-hidden border border-slate-300 rounded"
                >
                    {imageSrc && (
                        <img
                            ref={imgRef}
                            src={imageSrc}
                            alt="Crop target"
                            onLoad={handleImageLoad}
                            className="max-w-full max-h-[300px] object-contain pointer-events-none"
                        />
                    )}

                    {/* Semi-transparent Dark Overlays outside the crop area */}
                    {renderedSize.width > 0 && (
                        <>
                            {/* Top overlay */}
                            <div className="absolute bg-black bg-opacity-50" style={{ left: 0, top: 0, width: '100%', height: `${crop.y}px` }} />
                            {/* Bottom overlay */}
                            <div className="absolute bg-black bg-opacity-50" style={{ left: 0, top: `${crop.y + crop.size}px`, width: '100%', height: `${renderedSize.height - (crop.y + crop.size)}px` }} />
                            {/* Left overlay */}
                            <div className="absolute bg-black bg-opacity-50" style={{ left: 0, top: `${crop.y}px`, width: `${crop.x}px`, height: `${crop.size}px` }} />
                            {/* Right overlay */}
                            <div className="absolute bg-black bg-opacity-50" style={{ left: `${crop.x + crop.size}px`, top: `${crop.y}px`, width: `${renderedSize.width - (crop.x + crop.size)}px`, height: `${crop.size}px` }} />
                        </>
                    )}

                    {/* Draggable Square Crop Box */}
                    {renderedSize.width > 0 && (
                        <div
                            onMouseDown={(e) => handleStart(e, 'drag')}
                            onTouchStart={(e) => handleStart(e, 'drag')}
                            className="absolute border-2 border-[#00acb4] cursor-move flex items-center justify-center"
                            style={{
                                left: `${crop.x}px`,
                                top: `${crop.y}px`,
                                width: `${crop.size}px`,
                                height: `${crop.size}px`,
                                boxShadow: '0 0 0 4000px rgba(0, 0, 0, 0.35)'
                            }}
                        >
                            {/* Highlight corner indicators */}
                            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white -mt-[2px] -ml-[2px]" />
                            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white -mt-[2px] -mr-[2px]" />
                            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white -mb-[2px] -ml-[2px]" />
                            
                            {/* Bottom-right Resizing Handle */}
                            <div
                                onMouseDown={(e) => handleStart(e, 'resize')}
                                onTouchStart={(e) => handleStart(e, 'resize')}
                                className="absolute bottom-0 right-0 w-5 h-5 bg-[#00acb4] border border-white cursor-se-resize -mb-[8px] -mr-[8px] rounded-full shadow z-10 flex items-center justify-center hover:scale-110 active:scale-95 transition"
                            />
                        </div>
                    )}
                </div>

                <div className="flex gap-3 w-full mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 border border-slate-300 text-slate-700 py-2 rounded-md hover:bg-slate-100 transition text-sm font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="flex-1 bg-[#00acb4] hover:bg-[#009ca4] text-white py-2 rounded-md transition text-sm font-medium"
                    >
                        Save Crop
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InteractiveCropper;
