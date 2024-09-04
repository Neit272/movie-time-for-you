import React, { useRef, useEffect } from "react";
import Hls from "hls.js";

const HlsPlayer = ({ src, controls = true, autoPlay = false, style }) => {
  const videoRef = useRef(null);
  const adStartTime = 901;
  const adEndTime = 931;
  const skipToTime = 932;

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);

      if (autoPlay) {
        const playVideo = () => {
          videoRef.current.play().catch((error) => {
            console.error("Error trying to play video:", error);
          });
        };

        document.addEventListener("click", playVideo, { once: true });

        return () => {
          document.removeEventListener("click", playVideo);
        };
      }
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = src;

      if (autoPlay) {
        videoRef.current.play().catch((error) => {
          console.error("Error trying to play video:", error);
        });
      }
    }

    const handleTimeUpdate = () => {
      const currentTime = videoRef.current.currentTime;

      if (currentTime >= adStartTime && currentTime <= adEndTime) {
        videoRef.current.currentTime = skipToTime;
        console.log("Ad skipped: Jumped to 931 seconds");
      }
    };

    const video = videoRef.current;
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [src, autoPlay]);

  return <video ref={videoRef} controls={controls} style={style}></video>;
};

export default HlsPlayer;
