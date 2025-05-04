import { createContext, useState, useContext } from 'react'

const WasteContext = createContext()

const CLOUDINARY_CLOUD_NAME = 'drxliiejo';
const CLOUDINARY_UPLOAD_PRESET = 'newsidd';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const useWaste = () => useContext(WasteContext)

export const WasteProvider = ({ children }) => {
  const [detectedObject, setDetectedObject] = useState(null)
  const [classification, setClassification] = useState(null)
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
        imageSrc: cloudinaryUrl, // Now using Cloudinary URL
        name: data.objectName,
        confidence: data.confidence,
        reason: data.reason
      });
      setClassification(data.classification);
      
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
  }

  return (
    <WasteContext.Provider value={{
      detectedObject, 
      setDetectedObject,
      classification, 
      setClassification,
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
