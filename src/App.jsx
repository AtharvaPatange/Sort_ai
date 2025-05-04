import { useState } from 'react'
import BackgroundVideo from './components/BackgroundVideo'
import Header from './components/Header'
import DetectionContainer from './components/DetectionContainer'
import Footer from './components/Footer'
import InfoPanel from './components/InfoPanel'
import { WasteProvider } from './context/WasteContext'

function App() {
  const [showInfo, setShowInfo] = useState(false)
  
  return (
    <WasteProvider>
      <div className="relative min-h-screen">
        <BackgroundVideo />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header onInfoClick={() => setShowInfo(true)} />
          <div className="flex-grow flex flex-col items-center justify-center px-4 py-12">
            <div className="text-center max-w-4xl mx-auto mb-12">
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 drop-shadow-lg">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
                  EcoSort
                </span>
              </h1>
              <p className="text-2xl md:text-3xl text-white/90 mb-8 leading-relaxed drop-shadow-md">
                Join the movement to protect our planet through smart waste management
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-4">
                  <span className="text-2xl mb-2">🌱</span>
                  <p className="text-white/90">Reduce Waste</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-4">
                  <span className="text-2xl mb-2">♻️</span>
                  <p className="text-white/90">Recycle Smart</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-4">
                  <span className="text-2xl mb-2">🌍</span>
                  <p className="text-white/90">Save Earth</p>
                </div>
              </div>
            </div>
            <DetectionContainer />
          </div>
          <Footer />
        </div>
        {showInfo && <InfoPanel onClose={() => setShowInfo(false)} />}
      </div>
    </WasteProvider>
  )
}

export default App