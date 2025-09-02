import React, { useEffect, useRef } from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';
import { Movie } from '../types';

interface VideoPlayerProps {
  movie: Movie;
  onBack: () => void;
}

function VideoPlayer({ movie, onBack }: VideoPlayerProps) {
  const plyrRef = useRef<any>(null);

  useEffect(() => {
    // Configure Plyr when component mounts
    if (plyrRef.current?.plyr) {
      const player = plyrRef.current.plyr;
      
      // Set up event listeners
      player.on('ready', () => {
        console.log('Plyr is ready');
      });
      
      player.on('error', (event: any) => {
        console.error('Plyr error:', event);
      });
      
      player.on('loadstart', () => {
        console.log('Video loading started');
      });
    }
  }, []);

  const plyrOptions = {
    controls: [
      'play-large',
      'play',
      'progress',
      'current-time',
      'duration',
      'mute',
      'volume',
      'settings',
      'fullscreen'
    ],
    settings: ['quality', 'speed'],
    quality: {
      default: 1080,
      options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240]
    },
    speed: {
      selected: 1,
      options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
    },
    keyboard: {
      focused: true,
      global: true
    },
    tooltips: {
      controls: true,
      seek: true
    },
    captions: {
      active: false,
      language: 'auto',
      update: false
    },
    fullscreen: {
      enabled: true,
      fallback: true,
      iosNative: true
    },
    storage: {
      enabled: true,
      key: 'streamhub-plyr'
    },
    ratio: '16:9',
    invertTime: false,
    toggleInvert: true,
    resetOnEnd: false,
    autoplay: false,
    clickToPlay: true,
    disableContextMenu: false
  };

  const videoSource = {
    type: 'video' as const,
    sources: movie.streamUrl ? [
      {
        src: movie.streamUrl,
        type: 'video/mp4',
        size: 1080
      }
    ] : [],
    poster: movie.backdropUrl
  };

  if (!movie.streamUrl) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 z-50 bg-black/50 hover:bg-black/70 rounded-full p-3 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <div className="text-center max-w-md">
          <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center mb-6 mx-auto">
            <AlertCircle className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-red-400">No Stream Available</h2>
          <p className="text-gray-400 mb-4">
            This content doesn't have a valid stream URL. Please try adding it to Real-Debrid first.
          </p>
          <button
            onClick={onBack}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-50 bg-black/50 hover:bg-black/70 rounded-full p-3 transition-colors"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </button>

      {/* Movie Info Overlay */}
      <div className="absolute top-6 right-6 z-50 bg-black/70 backdrop-blur-sm rounded-lg p-4 max-w-sm">
        <h1 className="text-xl font-bold mb-2">{movie.title}</h1>
        <p className="text-sm text-gray-300 mb-2">{movie.overview}</p>
        <div className="flex items-center space-x-4 text-xs text-gray-400">
          <span>Rating: {movie.rating}/10</span>
          <span>{movie.duration} min</span>
          <span className="bg-green-600 px-2 py-1 rounded text-white">
            Real-Debrid
          </span>
        </div>
      </div>

      {/* Plyr Video Player */}
      <div className="w-full h-full">
        <Plyr
          ref={plyrRef}
          source={videoSource}
          options={plyrOptions}
        />
      </div>
    </div>
  );
}

export default VideoPlayer;