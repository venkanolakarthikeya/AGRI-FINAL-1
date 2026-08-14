import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Image as ImageIcon, SwitchCamera } from 'lucide-react';
import { motion } from 'motion/react';
import { Language } from '../types';

interface CameraCaptureProps {
  language: Language;
  onCapture: (base64Image: string) => void;
  onClose: () => void;
  onOpenGallery: () => void;
}

export function CameraCapture({ language, onCapture, onClose, onOpenGallery }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  useEffect(() => {
    startCamera(facingMode);
    return () => stopCamera();
  }, [facingMode]);

  const startCamera = async (currentFacingMode: 'environment' | 'user') => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: currentFacingMode }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      setError("Camera access denied or unavailable. Please use the gallery instead.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL('image/jpeg', 0.8);
        stopCamera();
        onCapture(base64Image);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md h-full max-h-[85vh] flex flex-col bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl relative border border-slate-800"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 absolute top-0 w-full z-10 bg-gradient-to-b from-black/80 to-transparent">
          <span className="text-white font-medium text-sm drop-shadow-md">Scan Soil Card</span>
          <button 
            onClick={() => { stopCamera(); onClose(); }} 
            className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Feed */}
        <div className="relative flex-1 w-full bg-black flex items-center justify-center min-h-0">
          {error ? (
            <div className="text-white text-center p-6">
              <Camera className="w-12 h-12 mx-auto text-slate-600 mb-4" />
              <p className="text-sm text-slate-400">{error}</p>
            </div>
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Target Guide */}
          {!error && (
            <div className="absolute inset-0 border-[2px] border-emerald-500/30 m-8 rounded-2xl flex items-center justify-center pointer-events-none">
              <div className="w-24 h-24 border-4 border-emerald-500/50 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 sm:p-6 bg-slate-900 flex justify-between items-center px-8 sm:px-10 shrink-0">
          <button 
            onClick={() => { stopCamera(); onOpenGallery(); }} 
            className="p-3 sm:p-4 bg-slate-800 rounded-full text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex flex-col items-center justify-center"
            title="Upload from Gallery"
          >
            <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <button 
            onClick={handleCapture}
            disabled={!!error}
            className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500 rounded-full border-4 border-slate-900 shadow-[0_0_0_4px_rgba(16,185,129,0.3)] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-400 transition-colors active:scale-95"
          >
            <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </button>

          <button 
            onClick={toggleCamera}
            disabled={!!error}
            className="p-3 sm:p-4 bg-slate-800 rounded-full text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex flex-col items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            title="Switch Camera"
          >
            <SwitchCamera className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </motion.div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
