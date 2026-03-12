import { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from './ui/button';

interface ImageViewerProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export function ImageViewer({ src, alt, onClose }: ImageViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.5, 5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.5, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.max(0.5, Math.min(5, prev + delta)));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
      if (e.key === '0') handleReset();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!src) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center">
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4 hover:bg-rose-300/10 text-rose-300 z-10"
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-2xl p-2 border border-rose-300/20 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomOut}
          disabled={zoom <= 0.5}
          className="hover:bg-rose-300/10 text-rose-300"
        >
          <ZoomOut className="w-5 h-5" />
        </Button>
        <span className="text-rose-100 font-medium min-w-[3rem] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomIn}
          disabled={zoom >= 5}
          className="hover:bg-rose-300/10 text-rose-300"
        >
          <ZoomIn className="w-5 h-5" />
        </Button>
        <div className="w-px h-6 bg-rose-300/30 mx-1" />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleReset}
          className="hover:bg-rose-300/10 text-rose-300"
        >
          <RotateCw className="w-5 h-5" />
        </Button>
      </div>

      {/* Image container */}
      <div
        ref={containerRef}
        className="w-full h-full overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain transition-transform select-none"
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
            cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
          }}
          draggable={false}
          onError={() => console.error('Failed to load image:', src)}
        />
      </div>

      {/* Instructions */}
      <div className="absolute top-4 left-4 text-xs text-rose-200/50 font-medium">
        Scroll to zoom • Drag to pan • ESC to close
      </div>
    </div>
  );
}