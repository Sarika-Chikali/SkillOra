'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, ZoomIn, ZoomOut, RotateCw, RotateCcw, Check, Move, Sparkles 
} from 'lucide-react';

interface PhotoCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onSave: (croppedDataUrl: string) => void;
}

export const PhotoCropModal: React.FC<PhotoCropModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onSave,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Reset controls when a new imageSrc is opened
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
    }
  }, [isOpen, imageSrc]);

  // Generate cropped base64 Data URL from Canvas
  const generateCroppedImage = useCallback((): string => {
    if (!imageRef.current) return imageSrc;

    const img = imageRef.current;
    const canvas = document.createElement('canvas');
    const targetSize = 400; // High quality 400x400 avatar output
    canvas.width = targetSize;
    canvas.height = targetSize;
    const ctx = canvas.getContext('2d');

    if (!ctx) return imageSrc;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetSize, targetSize);

    ctx.save();
    // Move origin to center of canvas
    ctx.translate(targetSize / 2, targetSize / 2);

    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);

    // Calculate scaling
    // Fit image to canvas box initially
    const minDim = Math.min(img.naturalWidth, img.naturalHeight);
    const baseScale = targetSize / minDim;
    const finalScale = baseScale * zoom;

    // Apply user pan offset (scaled to canvas target size)
    const containerSize = containerRef.current?.offsetWidth || 280;
    const panScale = targetSize / containerSize;
    
    ctx.translate(offset.x * panScale, offset.y * panScale);
    ctx.scale(finalScale, finalScale);

    // Draw centered image
    ctx.drawImage(
      img,
      -img.naturalWidth / 2,
      -img.naturalHeight / 2,
      img.naturalWidth,
      img.naturalHeight
    );

    ctx.restore();

    return canvas.toDataURL('image/png', 0.95);
  }, [imageSrc, zoom, rotation, offset]);

  // Update live preview badge periodically when transforms change
  useEffect(() => {
    if (!isOpen || !imageSrc) return;
    const timer = setTimeout(() => {
      setPreviewUrl(generateCroppedImage());
    }, 100);
    return () => clearTimeout(timer);
  }, [isOpen, imageSrc, generateCroppedImage]);

  // Pointer Event Handlers for Mouse & Touch Panning
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {
        // ignore if already released
      }
    }
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleSave = () => {
    const finalDataUrl = generateCroppedImage();
    onSave(finalDataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-20">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Move className="w-4 h-4 text-blue-600" /> Adjust Profile Photo
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Drag to reposition, zoom, or rotate for the perfect framing
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body & Crop Box Area */}
        <div className="p-6 space-y-6 overflow-y-auto bg-slate-900 text-white flex-1 flex flex-col items-center justify-center">
          
          {/* Main Interactive Crop Container */}
          <div className="relative flex items-center justify-center w-full max-w-[280px] aspect-square">
            
            {/* Viewport Box */}
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="relative w-[280px] h-[280px] rounded-3xl overflow-hidden bg-slate-950 border-2 border-blue-500/80 shadow-2xl cursor-grab active:cursor-grabbing select-none touch-none flex items-center justify-center"
            >
              {/* Invisible Image Element for Dimension Calculation */}
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Source Crop"
                className="hidden"
                crossOrigin="anonymous"
                onLoad={() => setPreviewUrl(generateCroppedImage())}
              />

              {/* Transformed Image Preview */}
              <div
                className="absolute inset-0 flex items-center justify-center transition-transform duration-75 pointer-events-none"
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                }}
              >
                <img
                  src={imageSrc}
                  alt="Crop Preview"
                  className="max-w-none max-h-none object-contain pointer-events-none"
                  style={{ width: '280px', height: '280px' }}
                />
              </div>

              {/* Circular Avatar Framing Overlay */}
              <div className="absolute inset-0 pointer-events-none border-[24px] border-slate-950/75 rounded-3xl flex items-center justify-center">
                <div className="w-full h-full rounded-full border-2 border-dashed border-blue-400/80 shadow-inner" />
              </div>

              {/* Drag Hint overlay */}
              <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-xs text-[10px] font-mono text-slate-300 pointer-events-none border border-slate-800 flex items-center gap-1">
                <Move className="w-3 h-3 text-blue-400" /> Drag to pan
              </div>
            </div>

            {/* Floating Live Circular Avatar Badge */}
            {previewUrl && (
              <div className="absolute -bottom-4 -right-4 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl flex flex-col items-center gap-1 z-10">
                <img
                  src={previewUrl}
                  alt="Live Result"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-400 shadow-md"
                />
                <span className="text-[9px] font-bold text-emerald-400 font-mono tracking-tight flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> Live
                </span>
              </div>
            )}

          </div>

          {/* Adjustments Toolbar */}
          <div className="w-full max-w-sm space-y-4 pt-2">
            
            {/* Zoom Slider Bar */}
            <div className="flex items-center gap-3 bg-slate-950/90 p-3 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.8, z - 0.15))}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <input
                type="range"
                min="0.8"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-blue-500 cursor-pointer h-1.5 rounded-lg bg-slate-800"
              />

              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(3, z + 0.15))}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono font-bold text-blue-400 w-12 text-right">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Rotate & Reset Buttons */}
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRotate}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <RotateCw className="w-3.5 h-3.5 text-blue-400" /> Rotate 90°
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Reset
              </button>
            </div>

          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex items-center justify-end gap-3 sticky bottom-0 z-20">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors min-h-[44px]"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all hover:scale-[1.02] min-h-[44px]"
          >
            <Check className="w-4 h-4" /> Save Photo
          </button>
        </div>

      </div>
    </div>
  );
};
