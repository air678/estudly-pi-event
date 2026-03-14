import { useMemo } from 'react'
import { useAudio } from '../../hooks/useAudioPlayer'

function LiveGradient() {
  const { albumColors, isPlaying } = useAudio()

  const gradientStyle = useMemo(() => {
    const [color1, color2, color3] = albumColors
    return {
      background: `
        radial-gradient(ellipse at 20% 20%, ${color1}aa 0%, transparent 50%),
        radial-gradient(ellipse at 80% 80%, ${color2}aa 0%, transparent 50%),
        radial-gradient(ellipse at 50% 50%, ${color3}88 0%, transparent 60%)
      `,
      animation: isPlaying ? 'breathe 8s ease-in-out infinite, drift 20s linear infinite' : 'none',
    }
  }, [albumColors, isPlaying])

  return (
    <>
      <div 
        className="absolute inset-0 z-0 transition-all duration-1000"
        style={gradientStyle}
      />
      <div className="absolute inset-0 z-0 bg-black/40" />
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.85; }
        }
        @keyframes drift {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(5%, 5%) rotate(5deg); }
          50% { transform: translate(0, 10%) rotate(0deg); }
          75% { transform: translate(-5%, 5%) rotate(-5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
      `}</style>
    </>
  )
}

export default LiveGradient