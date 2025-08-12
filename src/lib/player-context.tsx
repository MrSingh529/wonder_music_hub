
"use client";

import type { ClientTrack } from "@/lib/types";
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { getAllTracks } from "./data";


interface PlayerContextType {
  playlist: ClientTrack[];
  currentTrack: ClientTrack | null;
  currentTrackIndex: number | null;
  isPlaying: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  progress: number;
  volume: number;
  isMuted: boolean;
  duration: number;
  audioRef: React.RefObject<HTMLAudioElement>;
  setPlaylist: (tracks: ClientTrack[], playOnLoad?: boolean) => void;
  play: (index?: number) => void;
  pause: () => void;
  playNext: () => void;
  playPrev: () => void;
  playTrackById: (id: string) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  seek: (value: number) => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [playlist, setPlaylistState] = useState<ClientTrack[]>([]);
  const [originalPlaylist, setOriginalPlaylist] = useState<ClientTrack[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = currentTrackIndex !== null ? playlist[currentTrackIndex] : null;

  const setPlaylist = useCallback((tracks: ClientTrack[], playOnLoad = false) => {
    setOriginalPlaylist(tracks);
    setPlaylistState(isShuffle ? [...tracks].sort(() => Math.random() - 0.5) : tracks);
    if (playOnLoad && tracks.length > 0) {
      setCurrentTrackIndex(0);
      setIsPlaying(true);
    }
  }, [isShuffle]);

  const play = useCallback((index?: number) => {
    const targetIndex = index ?? currentTrackIndex ?? 0;
    if (playlist.length === 0) return;

    if (currentTrackIndex !== targetIndex) {
      setCurrentTrackIndex(targetIndex);
    }
    setIsPlaying(true);
    audioRef.current?.play().catch(console.error);
  }, [currentTrackIndex, playlist.length]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    audioRef.current?.pause();
  }, []);

  const playNext = useCallback(() => {
    if (playlist.length === 0) return;
    const nextIndex = (currentTrackIndex! + 1) % playlist.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  }, [currentTrackIndex, playlist.length]);
  
  const playPrev = useCallback(() => {
      if (playlist.length === 0) return;
      const prevIndex = (currentTrackIndex! - 1 + playlist.length) % playlist.length;
      setCurrentTrackIndex(prevIndex);
      setIsPlaying(true);
  }, [currentTrackIndex, playlist.length]);

  const playTrackById = useCallback(async (id: string) => {
    let trackIndex = playlist.findIndex(t => t.id === id);
  
    if (trackIndex !== -1) {
      play(trackIndex);
    } else {
      // If the track is not in the current playlist, fetch all tracks.
      const allTracks = await getAllTracks();
      const allTracksIndex = allTracks.findIndex(t => t.id === id);
      
      if (allTracksIndex !== -1) {
        setPlaylist(allTracks, false); // Update the playlist without auto-shuffling
        // Since setPlaylist might shuffle, we need to find the index again in the new playlist
        const newPlaylist = isShuffle ? [...allTracks].sort(() => Math.random() - 0.5) : allTracks;
        const newIndex = newPlaylist.findIndex(t => t.id === id);
        setPlaylistState(newPlaylist);
        play(newIndex);
      }
    }
  }, [playlist, play, setPlaylist, isShuffle]);


  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => {
      const newShuffleState = !prev;
      if (newShuffleState) {
        const shuffled = [...originalPlaylist].sort(() => Math.random() - 0.5);
        setPlaylistState(shuffled);
        if (currentTrack) {
          setCurrentTrackIndex(shuffled.findIndex(t => t.id === currentTrack.id));
        }
      } else {
        setPlaylistState(originalPlaylist);
        if (currentTrack) {
          setCurrentTrackIndex(originalPlaylist.findIndex(t => t.id === currentTrack.id));
        }
      }
      return newShuffleState;
    });
  }, [originalPlaylist, currentTrack]);

  const toggleRepeat = useCallback(() => setIsRepeat(prev => !prev), []);

  const seek = useCallback((value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
      setProgress(value);
    }
  }, []);
  
  const setVolume = useCallback((value: number) => {
    setVolumeState(value);
    if (audioRef.current) audioRef.current.volume = value;
    setIsMuted(value === 0);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      if (audioRef.current) audioRef.current.muted = !prev;
      return !prev;
    });
  }, []);

  useEffect(() => {
    if (isPlaying && currentTrackIndex !== null) {
        audioRef.current?.play().catch(console.error);
    }
  }, [currentTrackIndex, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
      setDuration(audio.duration || 0);
    };
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadedmetadata", () => setDuration(audio.duration));
    };
  }, [isRepeat, playNext]);

  return (
    <PlayerContext.Provider
      value={{
        playlist,
        currentTrack,
        currentTrackIndex,
        isPlaying,
        isShuffle,
        isRepeat,
        progress,
        volume,
        isMuted,
        duration,
        audioRef,
        setPlaylist,
        play,
        pause,
        playNext,
        playPrev,
        playTrackById,
        toggleShuffle,
        toggleRepeat,
        seek,
        setVolume,
        toggleMute,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
