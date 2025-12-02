'use client';

import { useState, useEffect } from 'react';
import { useScript } from '@/hooks/useScript';

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  getPlayerState: () => number;
  setVolume: (volume: number) => void;
}

declare global {
  interface Window {
    YT: {
      Player: new (element: string, options: object) => YouTubePlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);

  useScript('https://www.youtube.com/iframe_api');

  const onPlayerReady = (event: { target: YouTubePlayer }) => {
    event.target.setVolume(20);
    const handleClick = () => {
      if (event.target.getPlayerState() !== window.YT.PlayerState.PLAYING) {
        event.target.playVideo();
      }
      document.removeEventListener('click', handleClick);
    };
    document.addEventListener('click', handleClick);
  };

  const onPlayerStateChange = (event: { data: number }) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const initPlayer = () => {
      if (typeof window !== 'undefined' && window.YT && window.YT.Player) {
        const newPlayer = new window.YT.Player('youtube-audio-hidden', {
          height: '0',
          width: '0',
          videoId: 'IfMv0pJJtAA',
          playerVars: {
            autoplay: 0,
            loop: 1,
            playlist: 'IfMv0pJJtAA',
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
        });
        setPlayer(newPlayer);
      }
    };

    const checkYT = setInterval(() => {
      if (typeof window !== 'undefined' && window.YT && window.YT.Player) {
        clearInterval(checkYT);
        initPlayer();
      }
    }, 100);

    return () => clearInterval(checkYT);
  }, []);

  const toggleMusic = () => {
    if (!player) return;
    if (player.getPlayerState() === window.YT.PlayerState.PLAYING) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  return (
    <>
      <div className={`music-float ${isPlaying ? 'music-playing' : 'music-paused'}`} id="musicWidget">
        <div className="cassette-spools">
          <div className="spool"></div>
          <div className="spool"></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'VT323', lineHeight: '1' }}>
          <span style={{ fontSize: '18px', color: 'var(--rose)' }}>LOFI RADIO</span>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Pin Dự Phòng - Dương Domic</span>
        </div>
        <button
          onClick={toggleMusic}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-main)',
            cursor: 'pointer',
            fontSize: '24px',
          }}
        >
          <i className={`bx ${isPlaying ? 'bx-pause' : 'bx-play'}`} id="playIcon"></i>
        </button>
      </div>
      <div id="youtube-audio-hidden" style={{ display: 'none' }}></div>
    </>
  );
}
