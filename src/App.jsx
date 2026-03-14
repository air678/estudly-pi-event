import { useState, useCallback } from 'react'
import MiniPlayer from './components/Player/MiniPlayer'
import FullScreenPlayer from './components/Player/FullScreenPlayer'
import Library from './components/Library/Library'
import { AudioProvider } from './hooks/useAudioPlayer'

function App() {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showLibrary, setShowLibrary] = useState(false)

  const toggleFullScreen = useCallback(() => {
    setIsFullScreen(prev => !prev)
  }, [])

  const toggleLibrary = useCallback(() => {
    setShowLibrary(prev => !prev)
  }, [])

  return (
    <AudioProvider>
      <div className="h-full w-full bg-player-bg relative overflow-hidden">
        {isFullScreen ? (
          <FullScreenPlayer 
            onMinimize={toggleFullScreen}
            onToggleLibrary={toggleLibrary}
          />
        ) : (
          <>
            <Library 
              isVisible={showLibrary} 
              onClose={() => setShowLibrary(false)} 
            />
            <div className="h-full flex flex-col">
              <main className="flex-1 flex items-center justify-center">
                <button
                  onClick={toggleLibrary}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-lg font-medium transition-all duration-300 backdrop-blur-sm"
                >
                  {showLibrary ? 'Hide Library' : 'Open Library'}
                </button>
              </main>
              <MiniPlayer onExpand={toggleFullScreen} />
            </div>
          </>
        )}
      </div>
    </AudioProvider>
  )
}

export default App