import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const WasteBins = ({ classification, onAnimationComplete, onCorrectBin, onWrongBin, onNextItem }) => {
  const [feedback, setFeedback] = useState(null);
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const speechSynthesisRef = useRef(null);
  
  const bins = [
    { 
      id: 'recyclable', 
      icon: '♻️', 
      color: 'bg-primary-500',
      label: 'Recyclable',
      gradient: 'from-primary-400 to-primary-600',
      description: 'Paper, Glass, Plastic, Metal'
    },
    { 
      id: 'hazardous', 
      icon: '⚠️', 
      color: 'bg-error-500',
      label: 'Hazardous',
      gradient: 'from-error-400 to-error-600',
      description: 'Batteries, Paint, Medical, Scissors, Sharp Objects'
    },
    { 
      id: 'solid', 
      icon: '🗑️', 
      color: 'bg-gray-600',
      label: 'Solid',
      gradient: 'from-gray-500 to-gray-700',
      description: 'Non-recyclable Items'
    },
    { 
      id: 'organic', 
      icon: '🌱', 
      color: 'bg-secondary-500',
      label: 'Organic',
      gradient: 'from-secondary-400 to-secondary-600',
      description: 'Food & Plant Waste'
    }
  ];

  const targetBin = classification?.id || 'unknown';

  // Function to speak text using the Web Speech API
  const speak = (text, rate = 1) => {
    // Cancel any ongoing speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Store the utterance reference to be able to cancel it later if needed
      speechSynthesisRef.current = utterance;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speak instructions when animation completes
  useEffect(() => {
    if (animationCompleted && targetBin) {
      const targetBinObj = bins.find(bin => bin.id === targetBin);
      if (targetBinObj) {
        const instructionText = `Please put this item in the ${targetBinObj.label} bin.`;
        speak(instructionText);
      }
    }
    
    // Cleanup function to cancel any speech when component unmounts
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [animationCompleted, targetBin]);

  const handleBinClick = (binId) => {
    if (feedback) return; // Prevent multiple clicks during feedback
    
    if (binId === targetBin) {
      const feedbackMessage = 'Great job! That\'s the correct bin.';
      setFeedback({
        type: 'correct',
        message: feedbackMessage
      });
      
      // Speak the positive feedback
      speak(feedbackMessage, 1.1);
      
      if (onCorrectBin) onCorrectBin();
      
      // Move to next item after delay
      setTimeout(() => {
        setFeedback(null);
        if (onNextItem) onNextItem();
      }, 8000);
    } else {
      const targetBinObj = bins.find(bin => bin.id === targetBin);
      const feedbackMessage = `Oops! This item belongs in the ${targetBinObj?.label} bin.`;
      
      setFeedback({
        type: 'wrong',
        message: feedbackMessage
      });
      
      // Speak the correction feedback
      speak(feedbackMessage);
      
      if (onWrongBin) onWrongBin();
      
      // Clear feedback after delay
      setTimeout(() => {
        setFeedback(null);
      }, 2000);
    }
  };

  const handleAnimationComplete = () => {
    setAnimationCompleted(true);
    if (onAnimationComplete) onAnimationComplete();
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Feedback message */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-4 px-6 py-3 rounded-lg shadow-lg z-20 ${
              feedback.type === 'correct' ? 'bg-green-500' : 'bg-red-500'
            } text-white font-medium`}
          >
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed horizontal layout with 4 bins */}
      <div className="grid grid-cols-4 gap-3 w-full">
        {bins.map((bin, index) => (
          <motion.div
            key={bin.id}
            className="relative flex flex-col items-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {/* Navigation arrow - only show after item animation completes */}
            {animationCompleted && targetBin === bin.id && (
              <motion.div 
                className="absolute -top-12 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ 
                  opacity: [0.5, 1, 0.5], 
                  y: [-10, -5, -10]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <div className="text-white text-3xl">⬇️</div>
              </motion.div>
            )}

            <motion.div
              className={`w-full h-36 relative ${bin.color} rounded-t-lg overflow-hidden
                bg-gradient-to-b ${bin.gradient} shadow-lg
                ${targetBin === bin.id ? 'ring-2 ring-white/30' : ''}
                transform-gpu transition-all duration-300
                hover:scale-105 hover:shadow-xl
                cursor-pointer`}
              onClick={() => handleBinClick(bin.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-black/10" />
              <div className="h-full flex flex-col items-center justify-center p-2">
                <motion.div 
                  className="text-3xl mb-2"
                  animate={targetBin === bin.id ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, -10, 10, 0]
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {bin.icon}
                </motion.div>
                <span className="text-white font-medium text-xs mb-1">{bin.label}</span>
                <span className="text-white/70 text-xs text-center line-clamp-2">{bin.description}</span>
              </div>

              <AnimatePresence>
                {targetBin === bin.id && (
                  <motion.div
                    className="absolute -top-16 left-1/2 transform -translate-x-1/2"
                    initial={{ y: -50, scale: 0.5, opacity: 0 }}
                    animate={{ y: 0, scale: 1, opacity: 1 }}
                    exit={{ y: 100, scale: 0.5, opacity: 0 }}
                    onAnimationComplete={handleAnimationComplete}
                  >
                    <motion.div
                      className="relative"
                      animate={{ 
                        y: [0, 140],
                      }}
                      transition={{ 
                        duration: 1,
                        ease: "easeIn"
                      }}
                    >
                      <div className="text-3xl">{classification?.icon || '📦'}</div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div 
              className={`w-full h-3 ${bin.color} rounded-b-lg mx-auto
                bg-gradient-to-b from-black/20 to-black/10`}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WasteBins;