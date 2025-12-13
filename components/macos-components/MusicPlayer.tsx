'use client';

import { useState, useRef, useEffect } from 'react';

// --- DATA ---
const PLAYLIST = [
  {
    id: 'Q_stLMMDn8Q', 
    title: 'Playlist #13 - Chill Nhẹ Nhàng',
    artist: 'Various Artists',
    cover: 'https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/51e328c0-072e-53de-a3fc-d1b74d177511/f7f38abb-a3e0-502b-9f10-7a52ed840992.jpg'
  },
  {
    id: 'GpkfeF4qnJI',
    title: 'MỘNGMEE the mini album - AMEE',
    artist: 'AMEE',
    cover: 'https://i.scdn.co/image/ab67616100005174fd70279a04a9b3796e7dcd4d'
  }
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(30);
  const [isReady, setIsReady] = useState(false);
  const [duration, setDuration] = useState(0);

  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const currentTrack = PLAYLIST[currentTrackIndex];

  // Load YouTube IFrame API
  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: currentTrack.id,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1
        },
        events: {
          onReady: (event) => {
            setIsReady(true);
            event.target.setVolume(volume);
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              handleNext();
            }
            if (event.data === window.YT.PlayerState.PLAYING) {
              setDuration(event.target.getDuration());
            }
          }
        }
      });
    };

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Update progress (optimized với requestAnimationFrame)
  useEffect(() => {
    let animationId;
    let lastUpdate = 0;
    
    const updateProgress = (timestamp) => {
      // Chỉ update mỗi 500ms thay vì mỗi frame
      if (timestamp - lastUpdate >= 500) {
        try {
          if (playerRef.current && playerRef.current.getCurrentTime) {
            const current = playerRef.current.getCurrentTime();
            const total = playerRef.current.getDuration();
            if (total > 0) {
              setProgress((current / total) * 100);
            }
          }
        } catch (e) {}
        lastUpdate = timestamp;
      }
      
      if (isPlaying) {
        animationId = requestAnimationFrame(updateProgress);
      }
    };
    
    if (isPlaying && playerRef.current) {
      animationId = requestAnimationFrame(updateProgress);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isPlaying]);

  // Change track
  useEffect(() => {
    if (playerRef.current && playerRef.current.loadVideoById) {
      setIsReady(false);
      setProgress(0);
      playerRef.current.loadVideoById(currentTrack.id);
      
      setTimeout(() => {
        setIsReady(true);
        if (isPlaying) {
          playerRef.current.playVideo();
        }
      }, 1000);
    }
  }, [currentTrackIndex]);

  const toggleMusic = () => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(newVolume);
    }
  };

  return (
    <>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>

      <div className="fixed top-14 right-6 z-50 flex items-center p-2.5 pr-3 gap-3 rounded-[18px] bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-xl transition-all duration-500 ease-out hover:bg-white/90 dark:hover:bg-gray-800/90 hover:shadow-2xl">
        
        {/* Progress Bar */}
        <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-gray-300/30 dark:bg-gray-600/30 rounded-full overflow-hidden mb-[2px]">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* VINYL ART */}
        <div className="relative w-10 h-10 flex-shrink-0">
          <div 
            className={`w-full h-full rounded-full overflow-hidden border-2 border-white/50 dark:border-white/10 shadow-lg ${isPlaying && isReady ? 'animate-spin-slow' : ''}`}
          >
            <img src={currentTrack.cover} alt="Cover" className="w-full h-full object-cover" />
            {!isReady && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        {/* SONG INFO */}
        <div className="flex flex-col justify-center min-w-[90px]">
          <span className="text-[8px] font-bold text-blue-500 uppercase opacity-90 tracking-widest mb-0.5">
            {isReady ? 'NOW PLAYING' : 'LOADING...'}
          </span>
          <span className="text-xs font-bold text-gray-800 dark:text-gray-100 truncate max-w-[120px]">
            {currentTrack.title}
          </span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
            {currentTrack.artist}
          </span>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-2 border-l border-gray-300/30 dark:border-gray-600/30 pl-3">
          <button 
            onClick={handlePrev} 
            className="text-gray-500 hover:text-blue-500 dark:text-gray-400 transition-all hover:scale-110"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          <button
            onClick={toggleMusic}
            disabled={!isReady}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 active:scale-95 ${
              isPlaying
                ? 'bg-blue-500 text-white shadow-blue-500/40 hover:bg-blue-600'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            } ${!isReady ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isPlaying ? (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button 
            onClick={handleNext} 
            className="text-gray-500 hover:text-blue-500 dark:text-gray-400 transition-all hover:scale-110"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>

        {/* VOLUME */}
        <div className="flex flex-col justify-center gap-1 h-full pl-1">
          <svg className="w-3 h-3 text-gray-400 mx-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
          <div className="relative h-10 w-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="absolute bottom-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
              style={{ 
                writingMode: 'vertical-lr', 
                direction: 'rtl'
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-full bg-blue-400 rounded-full transition-all duration-150"
              style={{ height: `${volume}%` }}
            />
          </div>
        </div>
      </div>

      {/* YouTube Player (hidden) */}
      <div id="youtube-player" style={{ position: 'fixed', bottom: 0, right: 0, opacity: 0, pointerEvents: 'none' }}></div>
    </>
  );
}
