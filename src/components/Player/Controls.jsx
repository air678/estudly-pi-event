import { useAudio } from '../../hooks/useAudioPlayer'

function Controls() {
  const { 
    currentTrack,
    isPlaying, 
    togglePlay, 
    next, 
    prev, 
    seek, 
    currentTime, 
    duration,
    volume,
    setVolume 
  } = useAudio()

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    seek(percent * duration)
  }

  if (!currentTrack) return null

  return (
    <div className="w-full">
      <div className="flex justify-center items-center gap-6 mb-6">
        <button
          onClick={prev}
          className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <svg className="w-6 h-6 text-white/70" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z"/>
          </svg>
        </button>
        
        <button
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
        >
          {isPlaying ? (
            <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className="w-7 h-7 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
        
        <button
          onClick={next}
          className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <svg className="w-6 h-6 text-white/70" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs text-white/50 w-10 text-right">{formatTime(currentTime)}</span>
        <div 
          className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer group"
          onClick={handleSeek}
        >
          <div 
            className="h-full bg-white group-hover:bg-white/90 transition-colors rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-white/50 w-10">{formatTime(duration)}</span>
      </div>
      
      <div className="flex items-center justify-center gap-2">
        <svg className="w-4 h-4 text-white/50" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24"
        />
      </div>
    </div>
  )
}

export default Controls