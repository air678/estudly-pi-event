import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react'

const AudioContext = createContext(null)

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider')
  }
  return context
}

export function AudioProvider({ children }) {
  const audioRef = useRef(new Audio())
  const [tracks, setTracks] = useState([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [albumColors, setAlbumColors] = useState(['#ec4899', '#8b5cf6', '#3b82f6'])

  const audio = audioRef.current

  useEffect(() => {
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleDurationChange = () => setDuration(audio.duration)
    const handleEnded = () => {
      setIsPlaying(false)
      if (currentTrackIndex < tracks.length - 1) {
        setCurrentTrackIndex(prev => prev + 1)
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('durationchange', handleDurationChange)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('durationchange', handleDurationChange)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [audio, currentTrackIndex, tracks.length])

  useEffect(() => {
    audio.volume = volume
  }, [audio, volume])

  const currentTrack = tracks[currentTrackIndex] || null

  useEffect(() => {
    if (currentTrack?.url) {
      audio.src = currentTrack.url
      if (isPlaying) {
        audio.play().catch(() => {})
      }
    }
  }, [currentTrackIndex, tracks])

  const addTracks = useCallback((files) => {
    const newTracks = files.map(file => ({
      id: crypto.randomUUID(),
      name: file.name.replace(/\.[^/.]+$/, ''),
      url: URL.createObjectURL(file),
      file: file,
      artist: 'Unknown Artist',
      album: 'Unknown Album',
      artwork: null,
    }))
    
    setTracks(prev => {
      const updated = [...prev, ...newTracks]
      if (prev.length === 0 && updated.length > 0) {
        setCurrentTrackIndex(0)
      }
      return updated
    })
  }, [])

  const play = useCallback(() => {
    if (currentTrack) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }, [audio, currentTrack])

  const pause = useCallback(() => {
    audio.pause()
    setIsPlaying(false)
  }, [audio])

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying, pause, play])

  const seek = useCallback((time) => {
    audio.currentTime = time
    setCurrentTime(time)
  }, [audio])

  const next = useCallback(() => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(prev => prev + 1)
      setIsPlaying(true)
    }
  }, [currentTrackIndex, tracks.length])

  const prev = useCallback(() => {
    if (currentTime > 3) {
      seek(0)
    } else if (currentTrackIndex > 0) {
      setCurrentTrackIndex(prev => prev - 1)
      setIsPlaying(true)
    }
  }, [currentTime, currentTrackIndex, seek])

  const selectTrack = useCallback((index) => {
    setCurrentTrackIndex(index)
    setIsPlaying(true)
  }, [])

  const removeTrack = useCallback((index) => {
    setTracks(prev => {
      const updated = prev.filter((_, i) => i !== index)
      if (index < currentTrackIndex) {
        setCurrentTrackIndex(prev => prev - 1)
      } else if (index === currentTrackIndex && updated.length === 0) {
        pause()
        setCurrentTrackIndex(0)
      } else if (index === currentTrackIndex && index > updated.length - 1) {
        setCurrentTrackIndex(0)
      }
      return updated
    })
  }, [currentTrackIndex, pause])

  const value = {
    tracks,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    albumColors,
    setAlbumColors,
    addTracks,
    play,
    pause,
    togglePlay,
    seek,
    next,
    prev,
    selectTrack,
    removeTrack,
    setVolume,
  }

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  )
}