import React from 'react';
import { WasteProvider } from './context/WasteContext';
import { PointsProvider } from './context/PointsContext';
import Header from './components/Header';
import BackgroundVideo from './components/BackgroundVideo';
import DetectionContainer from './components/DetectionContainer';
import Footer from './components/Footer';
import ClassificationResult from './components/ClassificationResult';

function App() {
  const handleInfoClick = () => {
    // Handle info panel opening logic here
    console.log('Info button clicked');
  };

  return (
    <PointsProvider>
      <WasteProvider>
        <div className="min-h-screen bg-gray-100 relative overflow-hidden">
          <BackgroundVideo />
          <Header onInfoClick={handleInfoClick} />
          
          <main className="container mx-auto px-4 py-20 relative z-10">
            <DetectionContainer />
            <ClassificationResult />
          </main>
          
          <Footer />
        </div>
      </WasteProvider>
    </PointsProvider>
  );
}

export default App;