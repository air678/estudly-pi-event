import useAudioPlayer from '../../hooks/useAudioPlayer';
import LiveGradient from './LiveGradient'
import Controls from './Controls'

function FullScreenPlayer({ onMinimize, onToggleLibrary }) {
  const { currentTrack, isPlaying, togglePlay, next } = useAudio()

  if (!currentTrack) {
    return (
      <div className="h-full w-full bg-player-bg flex items-center justify-center">
        <p className="text-white/50">No track loaded</p>
      </div>
    )
  }

  return (
    <div className="h-full w-full relative overflow-hidden">
      <LiveGradient />
      
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      
      <div className="relative z-10 h-full flex flex-col">
        <header className="flex items-center justify-between p-4">
          <button
            onClick={onMinimize}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <h1 className="text-white/80 text-sm font-medium">Estudely Music</h1>
          
          <button
            onClick={onToggleLibrary}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </header>
        
        <main className="flex-1 flex flex-col items-center justify-center px-8 py-4">
          <div className="w-72 h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-2xl mb-8">
            {currentTrack.artwork ? (
              <img 
                src={currentTrack.artwork} 
                alt={currentTrack.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500">
                <svg className="w-20 h-20 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
            )}
          </div>
          
          <div className="text-center mb-6 w-full max-w-md">
            <h2 className="text-2xl font-semibold text-white mb-1 truncate">{currentTrack.name}</h2>
            <p className="text-white/60 truncate">{currentTrack.artist}</p>
          </div>
          
          <div className="w-full max-w-md">
            <Controls />
          </div>
        </main>
        
        <footer className="p-4 flex justify-center">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <button
              onClick={onToggleLibrary}
              className="text-white/40 hover:text-white/60 text-sm transition-colors"
            >
              Library
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default FullScreenPlayer