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
    currentComponentIndex,
    processingComponents,
    processNextComponent,
    setProcessingComponents, // Add this line to get the setter
    handleCorrectClassification, 
    handleIncorrectClassification,
    resetDetection
  } = useWaste()
  
  const [showCorrection, setShowCorrection] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [expandedComponent, setExpandedComponent] = useState(null)
  const [animationCompleted, setAnimationCompleted] = useState(false)
  
  if (!detectedObject || !classification) {
    return null
  }
  
  // Get the current component to process
  const currentComponent = components && components.length > 0 && processingComponents
    ? components[currentComponentIndex]
    : { classification };
  
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
  
  const handleAnimationComplete = () => {
    setAnimationCompleted(true)
  }
  
  const handleCorrectBin = () => {
    // If we're processing components, move to the next one
    if (processingComponents) {
      processNextComponent();
    } else {
      handleCorrectClassification();
    }
  }
  
  const handleWrongBin = () => {
    // You could add specific feedback or point reduction here
    console.log('Wrong bin selected')
  }
  
  const handleNextItem = () => {
    // If we have multiple components and haven't started processing them yet
    if (components && components.length > 1 && !processingComponents) {
      setProcessingComponents(true);
      processNextComponent();
    } else {
      resetDetection();
    }
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
              <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-1">
                {processingComponents 
                  ? `Component ${currentComponentIndex + 1}/${components.length}: ${currentComponent.name}` 
                  : 'Classification'}
              </h4>
              <div className={`p-3 rounded-lg ${currentComponent.classification.color} bg-opacity-20 border border-opacity-40 ${currentComponent.classification.color}`}>
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{currentComponent.classification.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {processingComponents ? currentComponent.name : classification.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {processingComponents ? currentComponent.reason : classification.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Interactive Waste Bins with Navigation */}
            <motion.div
              variants={resultVariants}
              custom={1}
              className="mb-6"
            >
              <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Where should this go?</h4>
              
              <WasteBins 
                classification={classification}
                components={components} // Make sure this is passed
                onAnimationComplete={handleAnimationComplete}
                onCorrectBin={handleCorrectBin}
                onWrongBin={handleWrongBin}
                onNextItem={handleNextItem}
              />
            </motion.div>
            
            {/* Only show components breakdown if not currently processing components */}
            {components && components.length > 0 && !processingComponents && (
              <motion.div
                variants={resultVariants}
                custom={2}
                className="mb-6"
              >
                <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Components</h4>
                <div className="space-y-3">
                  {/* Rest of your components code... */}
                </div>
              </motion.div>
            )}
            
            {/* Only show confirmation buttons if not processing components */}
            {!processingComponents && (
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
            )}
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