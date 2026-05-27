import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Icons } from './Icon';

interface HlsPlayerProps {
  embedUrl: string;
  poster?: string;
  title: string;
  onClose: () => void;
}

const $f = (line: string, base: string): string => {
  if (!line.startsWith('#') && line.trim() && !line.startsWith('http')) {
    try { return new URL(line.trim(), base).href; } catch { return line; }
  }
  return line;
};

const $c = (text: string, base: string): string => {
  return text.split('\n')
    .filter(l => !l.includes('convertv8/') && !l.startsWith('#EXT-X-DISCONTINUITY'))
    .map(l => $f(l, base))
    .join('\n');
};

export const HlsPlayer: React.FC<HlsPlayerProps> = ({ embedUrl, poster, title, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!embedUrl) { setError(true); return; }

    const init = async () => {
      const u = new URL(embedUrl);
      const m3u8Url = u.searchParams.get('url');
      if (!m3u8Url) { setError(true); return; }

      try {
        const masterRes = await fetch(m3u8Url);
        const masterText = await masterRes.text();

        const variantMatch = masterText.match(/^(?!\s*#)(.+\.m3u8)\s*$/m);
        if (!variantMatch) { setError(true); return; }

        const variantRel = variantMatch[1].trim();
        const variantUrl = new URL(variantRel, m3u8Url).href;

        const varRes = await fetch(variantUrl);
        const varText = await varRes.text();

        const baseDir = variantUrl.substring(0, variantUrl.lastIndexOf('/') + 1);
        const clean = $c(varText, baseDir);
        const blob = new Blob([clean], { type: 'application/vnd.apple.mpegurl' });
        const blobUrl = URL.createObjectURL(blob);

        if (videoRef.current && Hls.isSupported()) {
          if (hlsRef.current) hlsRef.current.destroy();
          const hls = new Hls();
          hls.loadSource(blobUrl);
          hls.attachMedia(videoRef.current);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setReady(true);
            videoRef.current?.play().catch(() => {});
          });
          hls.on(Hls.Events.ERROR, (_e, data) => {
            if (data.fatal) { setError(true); }
          });
          hlsRef.current = hls;
        } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
          videoRef.current.src = blobUrl;
          setReady(true);
        }
      } catch {
        setError(true);
      }
    };

    init();

    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, [embedUrl]);

  useEffect(() => {
    if (showControls) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [showControls]);

  if (error) return null;

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
            <span className="text-xs text-slate-300">Đang phát</span>
          </div>
        </button>
      </div>

      <div className="absolute top-0 left-0 w-full h-20 z-40" onMouseEnter={() => setShowControls(true)} />

      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span>Đang tải...</span>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-full outline-none"
        controls
        autoPlay
        playsInline
        onClick={() => setShowControls(!showControls)}
      />
    </div>
  );
};
