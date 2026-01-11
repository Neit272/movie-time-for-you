import React, { useState, useEffect } from 'react';
import { Icons } from './Icon';
import { ContentType } from '../types';

interface VideoPlayerProps {
  src?: string;
  embedUrl?: string;
  poster?: string;
  title: string;
  onClose: () => void;
  contentId?: string;
  episodeNumber?: number;
  contentTitle?: string;
  contentImage?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
    embedUrl, poster, title, onClose,
    contentId, episodeNumber, contentTitle, contentImage 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls]);

  if (embedUrl) {
      return (
        <div className="relative w-full h-full bg-black group">
            <div 
                className={`absolute top-0 left-0 right-0 p-4 z-50 bg-gradient-to-b from-black/80 to-transparent transition-transform duration-300 ${showControls ? 'translate-y-0' : '-translate-y-full'}`}
                onMouseEnter={() => setShowControls(true)}
            >
                <button onClick={onClose} className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors">
                    <Icons.ChevronLeft size={28} />
                    <div className="flex flex-col text-left">
                         <span className="font-bold text-lg leading-none shadow-black drop-shadow-md">{title}</span>
                         <span className="text-xs text-slate-300">Đang phát từ Server VIP</span>
                    </div>
                </button>
            </div>

            <div 
                className="absolute top-0 left-0 w-full h-20 z-40" 
                onMouseEnter={() => setShowControls(true)}
            />

            <iframe 
                src={embedUrl}
                title={title}
                className="w-full h-full border-0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
        </div>
      );
  }

  return (
    <div 
      className="relative w-full h-full bg-black flex items-center justify-center group overflow-hidden"
      onMouseMove={() => setShowControls(true)}
    >
      <div className={`absolute top-0 left-0 right-0 p-6 z-50 transition-transform duration-300 ${showControls ? 'translate-y-0' : '-translate-y-full'}`}>
         <button onClick={onClose} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <Icons.ChevronLeft size={24} />
            <span className="font-semibold text-lg drop-shadow-md">{title}</span>
         </button>
      </div>

      <div className="w-full h-full relative cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
        <img 
            src={poster} 
            alt="Video Content" 
            className={`w-full h-full object-cover opacity-60 transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-40'}`} 
        />
        {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-purple-600/90 rounded-full flex items-center justify-center pl-1 shadow-lg shadow-purple-900/50 animate-pulse">
                    <Icons.Play size={32} className="text-white fill-white" />
                </div>
            </div>
        )}
      </div>
      
      <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
         <div className="text-center text-white mb-4">Chế độ giả lập (Không có link Embed)</div>
      </div>
    </div>
  );
};