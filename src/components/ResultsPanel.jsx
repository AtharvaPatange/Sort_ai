import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWaste } from '../context/WasteContext'
import WasteBins from './WasteBins'
import ClassificationAnimation from './ClassificationAnimation'
import ComponentsBreakdown from './ComponentsBreakdown'

const ResultsPanel = () => {
  const { 
    detectedObject, 
    classification, 
    wasteCategories,
    components,
    handleCorrectClassification, 
    handleIncorrectClassification 
  } = useWaste()
  
  const [showCorrection, setShowCorrection] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [expandedComponent, setExpandedComponent] = useState(null)
  
  if (!detectedObject || !classification) {
    return null
  }
  
  const handleConfirm = () => {
    handleCorrectClassification()
  }
  
  const handleWrong = () => {
    setShowCorrection(true)
  }
  
  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
  }
  
  const handleSubmitCorrection = () => {
    if (selectedCategory) {
      handleIncorrectClassification(selectedCategory)
      setShowCorrection(false)
    }
  }

  const toggleComponentDetails = (index) => {
    setExpandedComponent(expandedComponent === index ? null : index)
  }
  
  const imageContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 } 
    }
  }
  
  const resultVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: 0.3 + (i * 0.1),
        duration: 0.5
      } 
    })
  }

  const arrowVariants = {
    hidden: { opacity: 0, pathLength: 0 },
    visible: { 
      opacity: 1, 
      pathLength: 1,
      transition: { 
        duration: 1,
        delay: 0.5
      }
    }
  }
  
  return (
    <div className="card max-w-md mx-auto overflow-hidden">
      <motion.div
        className="flex flex-col"
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="mb-4"
          variants={imageContainerVariants}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-2">Detection Result</h3>
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
            {detectedObject.imageSrc && (
              <img 
                src={detectedObject.imageSrc} 
                alt="Detected object" 
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-2 px-3">
              <div className="flex justify-between items-center">
                <span className="text-white text-sm">Confidence: {detectedObject.confidence}%</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {!showCorrection ? (
          <>
            <motion.div
              className="mb-6"
              variants={resultVariants}
              custom={0}
            >
              <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-1">Classification</h4>
              <div className={`p-3 rounded-lg ${classification.color} bg-opacity-20 border border-opacity-40 ${classification.color}`}>
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{classification.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-800">{classification.name}</h3>
                    <p className="text-sm text-gray-600">{classification.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Horizontal Waste Bins Section */}
            <motion.div
              variants={resultVariants}
              custom={1}
              className="mb-6 overflow-x-auto pb-4"
            >
              <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Waste Bins</h4>
              <div className="flex space-x-4 min-w-max">
                {wasteCategories.map((bin) => (
                  <div 
                    key={bin.id} 
                    className={`relative flex-shrink-0 w-32 ${bin.id === classification.id ? 'ring-2 ring-offset-2 ' + bin.color : ''}`}
                  >
                    <div className={`h-40 rounded-t-lg ${bin.color} bg-gradient-to-b ${bin.gradient} flex flex-col items-center justify-center p-2 text-white`}>
                      <span className="text-3xl mb-2">{bin.icon}</span>
                      <span className="font-medium text-sm text-center">{bin.name}</span>
                    </div>
                    <div className={`h-3 ${bin.color} rounded-b-lg mx-auto w-28`}></div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* Components with Smart Navigation Arrows */}
            {components && components.length > 0 && (
              <motion.div
                variants={resultVariants}
                custom={2}
                className="mb-6"
              >
                <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Components</h4>
                <div className="space-y-3">
                  {components.map((component, index) => {
                    const targetBin = wasteCategories.find(cat => cat.id === component.classification.id);
                    
                    return (
                      <motion.div 
                        key={index}
                        className="relative"
                      >
                        <motion.div 
                          className={`p-3 rounded-lg bg-gray-100 cursor-pointer ${expandedComponent === index ? 'bg-gray-200' : ''}`}
                          onClick={() => toggleComponentDetails(index)}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-xl mr-2">{component.classification.icon}</span>
                              <span className="font-medium">{component.name}</span>
                            </div>
                            <motion.div
                              animate={{ rotate: expandedComponent === index ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </motion.div>
                          </div>
                          
                          {/* Smart Navigation Arrow */}
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                            <motion.svg 
                              width="80" 
                              height="20" 
                              viewBox="0 0 80 20" 
                              className="absolute right-0"
                              initial="hidden"
                              animate="visible"
                            >
                              <motion.path
                                d="M0,10 C30,10 30,10 60,10 L60,10 L70,10"
                                fill="transparent"
                                stroke={targetBin ? `var(--${targetBin.color.replace('bg-', '')})` : "#888"}
                                strokeWidth="2"
                                strokeDasharray="0 1"
                                variants={arrowVariants}
                              />
                              <motion.path
                                d="M70,5 L80,10 L70,15"
                                fill="transparent"
                                stroke={targetBin ? `var(--${targetBin.color.replace('bg-', '')})` : "#888"}
                                strokeWidth="2"
                                variants={arrowVariants}
                              />
                            </motion.svg>
                          </div>
                        </motion.div>
                        
                        {/* Expandable Component Details */}
                        <AnimatePresence>
                          {expandedComponent === index && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-3 bg-gray-50 rounded-b-lg border-t border-gray-200">
                                <p className="text-sm text-gray-700">{component.reason}</p>
                                <div className="mt-2 inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-200">
                                  {component.classification.name}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
            
            <motion.div
              variants={resultVariants}
              custom={3}
            >
              <p className="text-center mb-4">Is this classification correct?</p>
              <div className="flex justify-center space-x-3">
                <motion.button
                  onClick={handleWrong}
                  className="btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  No
                </motion.button>
                <motion.button
                  onClick={handleConfirm}
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Yes!
                </motion.button>
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Select the correct category:</h4>
            <div className="grid grid-cols-1 gap-2 mb-4">
              {wasteCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className={`p-3 rounded-lg flex items-center transition-all ${
                    selectedCategory?.id === category.id
                      ? `${category.color} bg-opacity-30 border-2 border-opacity-70 ${category.color}`
                      : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  <span className="text-2xl mr-2">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-center">
              <motion.button
                onClick={handleSubmitCorrection}
                disabled={!selectedCategory}
                className={`btn ${
                  selectedCategory
                    ? 'bg-secondary-600 text-white hover:bg-secondary-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                whileHover={selectedCategory ? { scale: 1.05 } : {}}
                whileTap={selectedCategory ? { scale: 0.95 } : {}}
              >
                Submit Correction
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default ResultsPanel