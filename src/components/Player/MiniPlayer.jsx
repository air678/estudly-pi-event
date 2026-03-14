import { useAudio } from '../../hooks/useAudioPlayer'
import Controls from './Controls'
import { useRef } from 'react'

function MiniPlayer({ onExpand }) {
  const { currentTrack, isPlaying, togglePlay, next } = useAudio()
  const progressRef = useRef(null)

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!currentTrack) {
    return (
      <div className="h-20 bg-player-surface border-t border-player-border flex items-center justify-center">
        <p className="text-white/50 text-sm">No track loaded</p>
      </div>
    )
  }

  return (
    <div 
      className="h-20 bg-player-surface/95 backdrop-blur-xl border-t border-player-border flex items-center px-4 gap-4 cursor-pointer hover:bg-player-surface/80 transition-all duration-200"
      onClick={(e) => {
        if (!e.target.closest('button') && !e.target.closest('input')) {
          onExpand()
        }
      }}
    >
      <div className="w-14 h-14 rounded-lg overflow-hidden bg-player-bg flex-shrink-0 relative group">
        {currentTrack.artwork ? (
          <img 
            src={currentTrack.artwork} 
            alt={currentTrack.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600">
            <svg className="w-6 h-6 text-white/80" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-white truncate">{currentTrack.name}</h3>
        <p className="text-xs text-white/60 truncate">{currentTrack.artist}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
        >
          {isPlaying ? (
            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation()
            next()
          }}
          className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default MiniPlayer