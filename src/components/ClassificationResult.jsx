import React from 'react';
import { useWaste } from '../context/WasteContext';
import { motion } from 'framer-motion';

const ClassificationResult = () => {
  const { detectedObject, classification, components } = useWaste();

  if (!detectedObject || !classification) {
    return null;
  }

  // Find the matching waste category for additional info
  const categoryInfo = components[0]?.classification || classification;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Main Result Header */}
        <div className={`p-6 ${categoryInfo.gradient || categoryInfo.color}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-4xl">{categoryInfo.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-white">{detectedObject.name}</h2>
                <p className="text-white opacity-90">
                  Confidence: {detectedObject.confidence}%
                </p>
              </div>
            </div>
            <div className="bg-white bg-opacity-25 px-4 py-2 rounded-lg">
              <p className="text-white font-semibold">{categoryInfo.name}</p>
            </div>
          </div>
        </div>

        {/* Object Image */}
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 p-4">
            <img 
              src={detectedObject.imageSrc} 
              alt={detectedObject.name}
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Components and Reasoning */}
          <div className="md:w-2/3 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Classification Details</h3>
            
            {components.length > 0 ? (
              <div className="space-y-6">
                {components.map((component, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-4 shadow-sm"
                  >
                    {component.name && (
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">
                          {component.classification?.icon || '🔍'}
                        </span>
                        <h4 className="text-lg font-medium text-gray-800">
                          {component.name}
                        </h4>
                      </div>
                    )}
                    
                    {component.reason && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {component.reason}
                      </p>
                    )}
                    
                    {component.classification && component.classification.id !== 'unknown' && (
                      <div className="mt-3 flex items-center">
                        <span className={`${component.classification.color} text-white text-xs px-2 py-1 rounded-full`}>
                          {component.classification.name}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600">
                  {detectedObject.reason || "No detailed classification information available."}
                </p>
              </div>
            )}
            
            {/* Disposal Instructions */}
            <div className="mt-6 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
              <h4 className="text-lg font-medium text-blue-800 mb-2">How to dispose</h4>
              <p className="text-blue-700 text-sm">
                {categoryInfo.id === 'recyclable' && "Place in the recycling bin after cleaning."}
                {categoryInfo.id === 'organic' && "Place in compost or green waste bin."}
                {categoryInfo.id === 'hazardous' && "Take to a hazardous waste collection center."}
                {categoryInfo.id === 'landfill' && "Place in general waste bin."}
                {categoryInfo.id === 'solid' && "For electronics, take to an e-waste recycling center."}
                {categoryInfo.id === 'unknown' && "Check with local waste management for proper disposal."}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ClassificationResult;