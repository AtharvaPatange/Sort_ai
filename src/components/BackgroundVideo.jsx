import { useState, useEffect } from 'react'

const BackgroundVideo = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  
  const videoUrl = "https://player.vimeo.com/external/368320203.sd.mp4?s=38d67281d472ce7d32906fc88ef3d1ff80617b0d&profile_id=164&oauth2_token_id=57447761"
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <div className={`absolute inset-0 bg-primary-800 transition-opacity duration-1000 ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80 z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.8)_100%)] z-[2]" />
      <video
        autoPlay
        loop
        muted
        playsInline
        className={`absolute inset-0 object-cover w-full h-full transition-opacity duration-1000 ${isLoaded ? 'opacity-70' : 'opacity-0'}`}
        onCanPlay={() => setIsLoaded(true)}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

export default BackgroundVideo