import { createContext, useState, useContext } from 'react'

const WasteContext = createContext()

const CLOUDINARY_CLOUD_NAME = 'drxliiejo';
const CLOUDINARY_UPLOAD_PRESET = 'newsidd';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const useWaste = () => useContext(WasteContext)

export const WasteProvider = ({ children }) => {
  const [detectedObject, setDetectedObject] = useState(null)
  const [classification, setClassification] = useState(null)
  const [components, setComponents] = useState([])
  const [showConfetti, setShowConfetti] = useState(false)
  
  const wasteCategories = [
    { 
      id: 'recyclable', 
      name: 'Recyclable Waste', 
      color: 'bg-blue-500',
      icon: '♻️',
      description: 'Materials that can be reprocessed into new products',
      examples: ['Paper', 'Glass', 'Metal cans', 'Plastic bottles']
    },
    { 
      id: 'organic', 
      name: 'Organic Waste', 
      color: 'bg-green-500',
      icon: '🍃',
      description: 'Biodegradable waste from food or plant material',
      examples: ['Fruit scraps', 'Vegetable peels', 'Coffee grounds', 'Yard trimmings']
    },
    { 
      id: 'hazardous', 
      name: 'Hazardous Waste', 
      color: 'bg-red-500',
      icon: '⚠️',
      description: 'Waste that poses substantial danger to health or environment',
      examples: ['Batteries', 'Paint', 'Chemicals', 'Electronics']
    },
    { 
      id: 'landfill', 
      name: 'Landfill Waste', 
      color: 'bg-gray-500',
      icon: '🗑️',
      description: 'Waste that cannot be recycled or composted',
      examples: ['Styrofoam', 'Certain plastics', 'Dirty paper products', 'Diapers']
    },
    { 
      id: 'solid', 
      name: 'Solid Waste', 
      color: 'bg-gray-600',
      gradient: 'from-gray-500 to-gray-700',
      icon: '🗑️',
      description: 'Non-recyclable solid materials that require proper disposal',
      examples: ['Broken electronics', 'Mixed materials', 'Non-recyclable plastics']
    },
    { 
      id: 'unknown', 
      name: 'Unclassified Waste',
      color: 'bg-yellow-500',
      icon: '❓',
      description: 'Items that could not be classified into a specific category',
      examples: ['Unidentified materials', 'Complex composite items']
    }
  ]
  
  const uploadToCloudinary = async (imageData) => {
    const formData = new FormData();
    formData.append('file', imageData);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload to Cloudinary');
    }

    const data = await response.json();
    return data.secure_url;
  };

  const classifyObject = async (imageData) => {
    try {
      // First upload to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(imageData);

      // Then send URL to backend
      const response = await fetch('http://localhost:3001/api/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: cloudinaryUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to classify image');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to classify image');
      }
      console.log(data);
        
      setDetectedObject({
        imageSrc: cloudinaryUrl,
        name: data.objectName,
        confidence: data.confidence,
        reason: data.components?.[0]?.reason || ''
      });
      
      setClassification(data.classification);
      
      // Set components if available
      if (data.components && data.components.length > 0) {
        setComponents(data.components.filter(comp => comp.name || comp.reason));
      } else {
        setComponents([]);
      }
      
      return data.classification;
    } catch (error) {
      console.error('Error classifying object:', error);
      return null;
    }
  };
  
  const handleCorrectClassification = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 2000)
  }

  const resetDetection = () => {
    setDetectedObject(null)
    setClassification(null)
    setComponents([])
  }

  return (
    <WasteContext.Provider value={{
      detectedObject, 
      setDetectedObject,
      classification, 
      setClassification,
      components,
      showConfetti,
      wasteCategories,
      classifyObject,
      handleCorrectClassification,
      resetDetection
    }}>
      {children}
    </WasteContext.Provider>
  )
}
