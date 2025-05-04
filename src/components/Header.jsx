import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const Header = ({ onInfoClick }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-20 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
            className="mr-3"
          >
            <span className="text-3xl">🌎</span>
          </motion.div>
          <span className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${
            isScrolled ? 'text-primary-800' : 'text-white'
          }`}>
            EcoSort
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={onInfoClick}
            className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
              isScrolled 
                ? 'bg-primary-100 text-primary-800 hover:bg-primary-200' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <span className="text-xl">ℹ️</span>
            <span className="hidden md:inline">Learn More</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header