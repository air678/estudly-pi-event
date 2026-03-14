import { useState, useCallback } from 'react'
import { useAudio } from '../hooks/useAudioPlayer'
import { useColorExtract } from '../hooks/useColorExtract'

function Library({ isVisible, onClose }) {
  const { tracks, currentTrackIndex, addTracks, selectTrack, removeTrack, setAlbumColors } = useAudio()
  const { extractColors } = useColorExtract()
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'audio/mpeg' || file.type === 'audio/mp3' || file.name.endsWith('.mp3')
    )
    
    if (files.length > 0) {
      addTracks(files)
    }
  }, [addTracks])

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files).filter(
      file => file.type === 'audio/mpeg' || file.type === 'audio/mp3' || file.name.endsWith('.mp3')
    )
    if (files.length > 0) {
      addTracks(files)
    }
  }

  const handleSelectTrack = async (index) => {
    selectTrack(index)
    const track = tracks[index]
    if (track?.artwork) {
      const colors = await extractColors(track.artwork)
      setAlbumColors(colors)
    }
  }

  if (!isVisible) return null

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      />
      
      <div 
        className="relative z-10 w-full max-w-2xl mx-4 bg-player-surface/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-player-border">
          <h2 className="text-lg font-semibold text-white">Library</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        
        <div
          className={`relative min-h-[200px] max-h-[400px] overflow-y-auto p-4 ${isDragging ? 'bg-white/5' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {tracks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="w-16 h-16 text-white/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <p className="text-white/50 mb-2">Your library is empty</p>
              <p className="text-white/30 text-sm">Drop MP3 files here or click to add</p>
            </div>
          )}
          
          {tracks.length > 0 && (
            <div className="space-y-1">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all group ${
                    index === currentTrackIndex 
                      ? 'bg-white/10' 
                      : 'hover:bg-white/5'
                  }`}
                  onClick={() => handleSelectTrack(index)}
                >
                  <div className="w-10 h-10 rounded overflow-hidden bg-player-bg flex-shrink-0">
                    {track.artwork ? (
                      <img 
                        src={track.artwork} 
                        alt={track.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600">
                        <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm truncate ${index === currentTrackIndex ? 'text-white' : 'text-white/70'}`}>
                      {track.name}
                    </h3>
                    <p className="text-xs text-white/40 truncate">{track.artist}</p>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeTrack(index)
                    }}
                    className="w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/10 flex items-center justify-center transition-all"
                  >
                    <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {isDragging && (
            <div className="absolute inset-0 bg-pink-500/10 border-2 border-dashed border-pink-500 rounded-lg flex items-center justify-center pointer-events-none">
              <p className="text-pink-500 font-medium">Drop files here</p>
            </div>
          )}
        </div>
        
        <footer className="p-4 border-t border-player-border">
          <label className="flex items-center justify-center gap-2 py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-colors">
            <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-white/70 text-sm">Add Files</span>
            <input
              type="file"
              accept=".mp3,audio/mpeg"
              multiple
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        </footer>
      </div>
    </div>
  )
}

export default Library