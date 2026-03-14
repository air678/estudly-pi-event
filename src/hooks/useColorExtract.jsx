import { useCallback } from 'react'

export function useColorExtract() {
  const extractColors = useCallback((imageSource) => {
    return new Promise((resolve) => {
      const defaultColors = ['#ec4899', '#8b5cf6', '#3b82f6']
      
      if (!imageSource) {
        resolve(defaultColors)
        return
      }

      const img = new Image()
      img.crossOrigin = 'Anonymous'
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          const sampleSize = 100
          canvas.width = sampleSize
          canvas.height = sampleSize
          
          ctx.drawImage(img, 0, 0, sampleSize, sampleSize)
          
          const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize)
          const pixels = imageData.data
          
          const colorMap = new Map()
          
          for (let i = 0; i < pixels.length; i += 16) {
            const r = pixels[i]
            const g = pixels[i + 1]
            const b = pixels[i + 2]
            
            const quantR = Math.floor(r / 32) * 32
            const quantG = Math.floor(g / 32) * 32
            const quantB = Math.floor(b / 32) * 32
            
            const key = `${quantR},${quantG},${quantB}`
            colorMap.set(key, (colorMap.get(key) || 0) + 1)
          }
          
          const sortedColors = Array.from(colorMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
          
          const brightness = (r, g, b) => (r * 299 + g * 587 + b * 114) / 1000
          
          const filtered = sortedColors.filter(([key]) => {
            const [r, g, b] = key.split(',').map(Number)
            const bright = brightness(r, g, b)
            return bright > 20 && bright < 235
          })
          
          const selected = filtered.slice(0, 3)
          
          if (selected.length < 3) {
            resolve(defaultColors)
            return
          }
          
          const colors = selected.map(([key]) => {
            const [r, g, b] = key.split(',').map(Number)
            return `rgb(${r}, ${g}, ${b})`
          })
          
          resolve(colors)
        } catch {
          resolve(defaultColors)
        }
      }
      
      img.onerror = () => {
        resolve(defaultColors)
      }
      
      if (typeof imageSource === 'string') {
        img.src = imageSource
      } else if (imageSource instanceof Blob) {
        img.src = URL.createObjectURL(imageSource)
      } else {
        resolve(defaultColors)
      }
    })
  }, [])

  return { extractColors }
}