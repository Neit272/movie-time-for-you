import React, { useRef, useEffect } from "react";
import Hls from "hls.js";

const HlsPlayer = ({ src, controls = true, autoPlay = false, style }) => {
  const videoRef = useRef(null);
  const adStartTime = 901; // 15 minutes in seconds
  const adEndTime = 931; // Ad end time in seconds
  const skipToTime = 932; // Time to skip to after the ad

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

    // Function to handle time updates and skip ad
    const handleTimeUpdate = () => {
      const currentTime = videoRef.current.currentTime;

      // If the current time is between 900 and 930 seconds, skip to 931 seconds
      if (currentTime >= adStartTime && currentTime <= adEndTime) {
        videoRef.current.currentTime = skipToTime; // Skip the ad
        console.log("Ad skipped: Jumped to 931 seconds");
      }
    };

    // Attach the time update event listener
    const video = videoRef.current;
    video.addEventListener("timeupdate", handleTimeUpdate);

    // Clean up event listener when the component unmounts
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [src, autoPlay]);

  return <video ref={videoRef} controls={controls} style={style}></video>;
};

export default HlsPlayer;
