'use client';

import { useState, useEffect, useRef } from 'react';
import { useScript } from '@/hooks/useScript';

// --- DATA: Danh sách phát ---
const PLAYLIST = [
  {
    id: 'Q_stLMMDn8Q', 
    title: 'Playlist #13 - Chill Nhẹ Nhàng',
    artist: 'Various Artists',
    cover: 'https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/51e328c0-072e-53de-a3fc-d1b74d177511/f7f38abb-a3e0-502b-9f10-7a52ed840992.jpg'
  },
  {
    id: 'GpkfeF4qnJI',
    title: '‘MỘNGMEE’ the mini album - AMEE',
    artist: 'AMEE',
    cover: 'https://i.scdn.co/image/ab67616100005174fd70279a04a9b3796e7dcd4d'
  }
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(30);

  const playerRef = useRef<any>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  useScript('https://www.youtube.com/iframe_api');

  // --- LOGIC PLAYER ---
  useEffect(() => {
    if (playerRef.current && playerRef.current.loadVideoById) {
      playerRef.current.loadVideoById(currentTrack.id);
      playerRef.current.playVideo();
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  useEffect(() => {
    const initPlayer = () => {
      if (playerRef.current) return;

      if (typeof window !== 'undefined' && window.YT && window.YT.Player) {
        playerRef.current = new window.YT.Player('youtube-audio-hidden', {
          height: '0',
          width: '0',
          videoId: currentTrack.id,
          playerVars: {
            autoplay: 1,
            controls: 0,
            showinfo: 0,
            modestbranding: 1,
            loop: 1,
          },
          events: {
            onReady: (event: any) => {
              event.target.setVolume(volume);
              event.target.playVideo();
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                startProgressTimer();
              } else {
                setIsPlaying(false);
                stopProgressTimer();
              }
              if (event.data === window.YT.PlayerState.ENDED) {
                handleNext();
              }
            },
            onError: (e: any) => {
              console.log("YouTube Player Error:", e);
              setIsPlaying(false);
            }
          },
        });
      }
    };

    if (!window.YT) {
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    return () => {
      stopProgressTimer();
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (e) { }
        playerRef.current = null;
      }
    };
  }, []);

  const startProgressTimer = () => {
    stopProgressTimer();
    progressInterval.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const current = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        if (duration > 0) {
          setProgress((current / duration) * 100);
        }
      }
    }, 1000);
  };

  const stopProgressTimer = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  };

  const toggleMusic = () => {
    if (playerRef.current) {
      isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setProgress(0);
  };

  return (
    <>
      <div
        className={`
          fixed top-14 right-6 z-50
          flex items-center p-2.5 pr-3 gap-3
          rounded-[18px]
          bg-white/70 dark:bg-[#1e1e1e]/70
          backdrop-blur-2xl
          border border-white/40 dark:border-white/10
          shadow-[0_8px_32px_rgba(0,0,0,0.12)]
          transition-all duration-500 ease-out
          hover:bg-white/90 dark:hover:bg-[#1e1e1e]/90
          hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)]
        `}
      >
        {/* Progress Bar (Chạy dọc dưới đáy widget) */}
        <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-gray-300/30 dark:bg-gray-600/30 rounded-full overflow-hidden mb-[2px]">
          <div
            className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 1. VINYL ALBUM ART (Spinning - Compact Size) */}
        <div className="relative w-10 h-10 flex-shrink-0">
          <div className={`
                w-full h-full rounded-full overflow-hidden border-[2px] border-white/50 dark:border-white/10 shadow-lg
                ${isPlaying ? 'animate-spin-slow' : ''}
            `} style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
            <img src={currentTrack.cover} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-gray-200 dark:bg-[#2c2c2c] rounded-full -translate-x-1/2 -translate-y-1/2 border border-gray-400/50" />
          </div>
        </div>

        {/* 2. SONG INFO (Compact Size) */}
        <div className="flex flex-col justify-center min-w-[90px]">
          <span className="text-[8px] font-bold text-blue-500 uppercase opacity-90 tracking-widest mb-0.5">
            NOW PLAYING
          </span>
          <span className="text-xs font-bold text-gray-800 dark:text-gray-100 truncate max-w-[120px]">
            {currentTrack.title}
          </span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
            {currentTrack.artist}
          </span>
        </div>

        {/* 3. CONTROLS (Compact Size) */}
        <div className="flex items-center gap-2 border-l border-gray-300/30 dark:border-gray-600/30 pl-3">
          {/* Prev */}
          <button onClick={handlePrev} className="text-gray-500 hover:text-blue-500 dark:text-gray-400 transition-colors hover:scale-110">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={toggleMusic}
            className={`
                 w-8 h-8 rounded-full flex items-center justify-center 
                 shadow-lg transition-all duration-300 active:scale-95
                 ${isPlaying
                ? 'bg-blue-500 text-white shadow-blue-500/40 hover:bg-blue-600'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }
               `}
          >
            {isPlaying ? (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
            ) : (
              <svg className="w-3.5 h-3.5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>

          {/* Next */}
          <button onClick={handleNext} className="text-gray-500 hover:text-blue-500 dark:text-gray-400 transition-colors hover:scale-110">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
          </button>
        </div>

        {/* 4. VOLUME SLIDER (Compact Vertical) */}
        <div className="flex flex-col justify-center gap-1 h-full pl-1">
          <svg className="w-3 h-3 text-gray-400 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
          <div className="relative h-10 w-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden group/vol">
            <input
              type="range"
              min="0" max="100"
              value={volume}
              orient="vertical" // Cho Firefox
              onChange={(e) => setVolume(Number(e.target.value))}
              className="
                      absolute bottom-0 left-0 w-full h-full opacity-0 cursor-pointer z-10
                    "
              style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' } as any} // Cho Chrome/Safari
            />
            <div
              className="absolute bottom-0 left-0 w-full bg-blue-400 rounded-full transition-all duration-150"
              style={{ height: `${volume}%` }}
            />
          </div>
        </div>

      </div>

      <div className="hidden"><div id="youtube-audio-hidden"></div></div>
    </>
  );
}