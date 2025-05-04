import { motion, AnimatePresence } from 'framer-motion';

const WasteBins = ({ classification, onAnimationComplete }) => {
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
      description: 'Batteries, Paint, Medical'
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

  return (
    <div className="flex flex-wrap justify-around w-full max-w-4xl mx-auto mt-8 gap-6">
      {bins.map((bin) => (
        <motion.div
          key={bin.id}
          className={`relative group`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className={`w-40 h-48 relative ${bin.color} rounded-t-2xl overflow-hidden
              bg-gradient-to-b ${bin.gradient} shadow-lg
              ${targetBin === bin.id ? 'ring-4 ring-white/30' : ''}
              transform-gpu transition-all duration-300
              group-hover:scale-105 group-hover:shadow-xl`}
          >
            <div className="absolute inset-0 bg-black/10" />
            <div className="h-full flex flex-col items-center justify-center p-4">
              <motion.div 
                className="text-5xl mb-3"
                animate={targetBin === bin.id ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, 0]
                } : {}}
                transition={{ duration: 0.5 }}
              >
                {bin.icon}
              </motion.div>
              <span className="text-white font-medium text-lg mb-1">{bin.label}</span>
              <span className="text-white/70 text-xs text-center">{bin.description}</span>
            </div>

            <AnimatePresence>
              {targetBin === bin.id && (
                <motion.div
                  className="absolute -top-16 left-1/2 transform -translate-x-1/2"
                  initial={{ y: -50, scale: 0.5, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ y: 100, scale: 0.5, opacity: 0 }}
                  onAnimationComplete={onAnimationComplete}
                >
                  <motion.div
                    className="relative"
                    animate={{ 
                      y: [0, 160],
                    }}
                    transition={{ 
                      duration: 1,
                      ease: "easeIn"
                    }}
                  >
                    <div className="text-3xl">{classification?.icon || '📦'}</div>
                    <motion.div 
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 whitespace-nowrap"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span className="bg-black/50 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
                        {classification?.objectName || classification?.name || 'Unknown Object'}
                      </span>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div 
            className={`w-44 h-4 ${bin.color} rounded-b-xl mx-auto
              bg-gradient-to-b from-black/20 to-black/10`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default WasteBins;