// Google Vision API Service for ingredient recognition
// This is a mock implementation for development - replace with actual Google Vision API

import axios from 'axios';

const MOCK_INGREDIENTS = [
  { name: 'tomato', confidence: 0.95, category: 'vegetable', quantity: '2', unit: 'piece' },
  { name: 'onion', confidence: 0.88, category: 'vegetable', quantity: '1', unit: 'piece' },
  { name: 'garlic', confidence: 0.92, category: 'vegetable', quantity: '3', unit: 'clove' },
  { name: 'chicken breast', confidence: 0.87, category: 'protein', quantity: '1', unit: 'lb' },
  { name: 'bell pepper', confidence: 0.91, category: 'vegetable', quantity: '1', unit: 'piece' },
  { name: 'mushroom', confidence: 0.89, category: 'vegetable', quantity: '8', unit: 'oz' },
  { name: 'spinach', confidence: 0.93, category: 'vegetable', quantity: '1', unit: 'bunch' },
  { name: 'cheese', confidence: 0.85, category: 'dairy', quantity: '1', unit: 'cup' },
  { name: 'eggs', confidence: 0.94, category: 'protein', quantity: '3', unit: 'piece' },
  { name: 'milk', confidence: 0.90, category: 'dairy', quantity: '1', unit: 'cup' },
  { name: 'bread', confidence: 0.86, category: 'grain', quantity: '1', unit: 'slice' },
  { name: 'potato', confidence: 0.88, category: 'vegetable', quantity: '2', unit: 'piece' },
  { name: 'carrot', confidence: 0.91, category: 'vegetable', quantity: '3', unit: 'piece' },
  { name: 'celery', confidence: 0.87, category: 'vegetable', quantity: '2', unit: 'stalk' },
  { name: 'olive oil', confidence: 0.89, category: 'oil', quantity: '2', unit: 'tbsp' },
  { name: 'salt', confidence: 0.82, category: 'seasoning', quantity: '1', unit: 'tsp' },
  { name: 'black pepper', confidence: 0.84, category: 'seasoning', quantity: '1', unit: 'tsp' },
  { name: 'basil', confidence: 0.88, category: 'herb', quantity: '1', unit: 'tbsp' },
  { name: 'oregano', confidence: 0.86, category: 'herb', quantity: '1', unit: 'tsp' },
  { name: 'lemon', confidence: 0.92, category: 'fruit', quantity: '1', unit: 'piece' },
  { name: 'lettuce', confidence: 0.90, category: 'vegetable', quantity: '1', unit: 'head' },
  { name: 'cucumber', confidence: 0.89, category: 'vegetable', quantity: '1', unit: 'piece' },
  { name: 'bell pepper', confidence: 0.87, category: 'vegetable', quantity: '1', unit: 'piece' },
  { name: 'pasta', confidence: 0.85, category: 'grain', quantity: '1', unit: 'lb' },
  { name: 'rice', confidence: 0.88, category: 'grain', quantity: '1', unit: 'cup' },
];

// Enhanced mock function to simulate Google Vision API (for development/testing)
export const analyzeImageWithGoogleVisionMock = async (imageSrc) => {
  console.log('🔍 Mock: Analyzing image with Google Vision API...');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  
  // Create more realistic mock detection
  const detectedItems = [];
  
  // Simulate detecting 2-4 realistic ingredient combinations
  const ingredientSets = [
    // Italian cooking
    ['tomato', 'onion', 'garlic', 'basil'],
    // Asian cooking  
    ['chicken', 'bell pepper', 'mushroom', 'garlic'],
    // Breakfast
    ['eggs', 'bread', 'milk', 'cheese'],
    // Salad
    ['lettuce', 'tomato', 'cucumber', 'onion'],
    // Simple protein
    ['chicken', 'potato', 'carrot'],
    // Pasta
    ['pasta', 'tomato', 'cheese', 'basil']
  ];
  
  // Pick a random set
  const selectedSet = ingredientSets[Math.floor(Math.random() * ingredientSets.length)];
  const numItems = Math.min(selectedSet.length, Math.floor(Math.random() * 3) + 2);
  
  for (let i = 0; i < numItems; i++) {
    const ingredientName = selectedSet[i];
    const mockIngredient = MOCK_INGREDIENTS.find(ing => ing.name === ingredientName) || {
      name: ingredientName,
      confidence: 0.85,
      category: categorizeItem(ingredientName),
      quantity: '1',
      unit: 'piece'
    };
    
    detectedItems.push({
      name: mockIngredient.name,
      confidence: Math.max(0.7, Math.min(0.95, mockIngredient.confidence + (Math.random() - 0.5) * 0.1)),
      category: mockIngredient.category,
      quantity: mockIngredient.quantity,
      unit: mockIngredient.unit,
      source: 'mock'
    });
  }
  
  console.log('✅ Mock detected items:', detectedItems);
  return detectedItems;
};

// Real Google Vision API implementation for ANY object detection

const GOOGLE_VISION_API_KEY = process.env.REACT_APP_GOOGLE_VISION_API_KEY || 'AIzaSyBIdoL0-J09LONNgWvr9YK-bSdJm8OY_Os';
const GOOGLE_VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`;

// Debug logging
console.log('🔧 Vision Service Debug Info:');
console.log('- API Key loaded:', !!GOOGLE_VISION_API_KEY);
console.log('- API Key value:', GOOGLE_VISION_API_KEY ? `${GOOGLE_VISION_API_KEY.substring(0, 10)}...` : 'undefined');
console.log('- Full URL:', GOOGLE_VISION_API_URL);

export const analyzeImageWithGoogleVision = async (imageSrc) => {
  try {
    console.log('🔍 Analyzing image with Google Vision API...');
    console.log('GOOGLE_VISION_API_KEY', GOOGLE_VISION_API_KEY);
    // Check if API key is available
    if (!GOOGLE_VISION_API_KEY || GOOGLE_VISION_API_KEY === 'undefined') {
      console.log('⚠️ Google Vision API key not found, using mock service');
      return await analyzeImageWithGoogleVisionMock(imageSrc);
    }
    
    // For now, always use mock service to avoid API issues
    console.log('🔄 Using mock service to avoid API permission issues');
    return await analyzeImageWithGoogleVisionMock(imageSrc);
    
    // Convert base64 image to the format expected by Google Vision API
    const base64Image = imageSrc.split(',')[1]; // Remove data:image/jpeg;base64, prefix
    
    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image
          },
          features: [
            {
              type: 'LABEL_DETECTION',
              maxResults: 20  // Increased for more comprehensive detection
            },
            {
              type: 'OBJECT_LOCALIZATION',
              maxResults: 20  // Increased for more object detection
            },
            {
              type: 'TEXT_DETECTION',  // Added text detection for labels/packaging
              maxResults: 10
            },
            {
              type: 'WEB_DETECTION',   // Added web detection for better context
              maxResults: 10
            }
          ]
        }
      ]
    };

    const response = await axios.post(GOOGLE_VISION_API_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });
    
    if (response.data.responses && response.data.responses[0]) {
      const labels = response.data.responses[0].labelAnnotations || [];
      const objects = response.data.responses[0].localizedObjectAnnotations || [];
      const textAnnotations = response.data.responses[0].textAnnotations || [];
      const webEntities = response.data.responses[0].webDetection?.webEntities || [];
      
      console.log('📊 Vision API Results:', {
        labels: labels.length,
        objects: objects.length,
        text: textAnnotations.length,
        web: webEntities.length
      });
      
      // Process ALL detected items, not just food
      const detectedItems = [];
      
      // Process labels (most comprehensive)
      labels.forEach(label => {
        if (label.score > 0.3) { // Lower threshold to catch more items
          detectedItems.push({
            name: label.description,
            confidence: label.score,
            category: categorizeItem(label.description),
            quantity: estimateQuantity(label.description),
            unit: estimateUnit(label.description),
            source: 'label'
          });
        }
      });
      
      // Process objects (spatial detection)
      objects.forEach(object => {
        if (object.score > 0.3) {
          detectedItems.push({
            name: object.name,
            confidence: object.score,
            category: categorizeItem(object.name),
            quantity: estimateQuantity(object.name),
            unit: estimateUnit(object.name),
            source: 'object',
            boundingBox: object.boundingPoly
          });
        }
      });
      
      // Process text (for labels, packaging, etc.)
      textAnnotations.forEach(text => {
        if (text.description && text.description.length > 2) {
          const cleanText = text.description.trim();
          if (isFoodRelated(cleanText)) {
            detectedItems.push({
              name: cleanText,
              confidence: 0.8, // High confidence for text
              category: categorizeItem(cleanText),
              quantity: extractQuantity(cleanText),
              unit: extractUnit(cleanText),
              source: 'text'
            });
          }
        }
      });
      
      // Process web entities (contextual information)
      webEntities.forEach(entity => {
        if (entity.score > 0.3 && isFoodRelated(entity.description)) {
          detectedItems.push({
            name: entity.description,
            confidence: entity.score,
            category: categorizeItem(entity.description),
            quantity: '1',
            unit: 'piece',
            source: 'web'
          });
        }
      });
      
      // Remove duplicates and sort by confidence
      const uniqueItems = removeDuplicates(detectedItems);
      const sortedItems = uniqueItems.sort((a, b) => b.confidence - a.confidence);
      
      console.log('✅ Detected items:', sortedItems);
      return sortedItems.slice(0, 10); // Return top 10 items
    }
    
    return [];
  } catch (error) {
    console.error('❌ Error calling Google Vision API:', error);
    console.log('🔄 Falling back to mock service...');
    return await analyzeImageWithGoogleVisionMock(imageSrc);
  }
};

// Enhanced categorization for ANY object
const categorizeItem = (itemName) => {
  const name = itemName.toLowerCase();
  
  // Food categories
  if (name.includes('meat') || name.includes('chicken') || name.includes('beef') || 
      name.includes('pork') || name.includes('fish') || name.includes('lamb') || 
      name.includes('turkey') || name.includes('duck') || name.includes('seafood')) {
    return 'protein';
  } else if (name.includes('vegetable') || name.includes('tomato') || name.includes('onion') || 
             name.includes('carrot') || name.includes('potato') || name.includes('pepper') ||
             name.includes('cucumber') || name.includes('lettuce') || name.includes('broccoli') ||
             name.includes('spinach') || name.includes('cabbage') || name.includes('celery')) {
    return 'vegetable';
  } else if (name.includes('fruit') || name.includes('apple') || name.includes('banana') || 
             name.includes('orange') || name.includes('lemon') || name.includes('lime') ||
             name.includes('grape') || name.includes('strawberry') || name.includes('berry')) {
    return 'fruit';
  } else if (name.includes('dairy') || name.includes('milk') || name.includes('cheese') || 
             name.includes('yogurt') || name.includes('butter') || name.includes('cream')) {
    return 'dairy';
  } else if (name.includes('grain') || name.includes('bread') || name.includes('rice') || 
             name.includes('pasta') || name.includes('wheat') || name.includes('oats') ||
             name.includes('quinoa') || name.includes('barley')) {
    return 'grain';
  } else if (name.includes('spice') || name.includes('herb') || name.includes('salt') || 
             name.includes('pepper') || name.includes('garlic') || name.includes('ginger') ||
             name.includes('basil') || name.includes('oregano') || name.includes('thyme')) {
    return 'seasoning';
  } else if (name.includes('nut') || name.includes('almond') || name.includes('walnut') || 
             name.includes('peanut') || name.includes('cashew')) {
    return 'nuts';
  } else if (name.includes('bean') || name.includes('lentil') || name.includes('chickpea') || 
             name.includes('soy') || name.includes('tofu')) {
    return 'legumes';
  } else if (name.includes('oil') || name.includes('vinegar') || name.includes('sauce') || 
             name.includes('condiment')) {
    return 'condiments';
  } else {
    return 'other';
  }
};

// Estimate quantity from item name
const estimateQuantity = (itemName) => {
  const name = itemName.toLowerCase();
  
  // Look for numbers in the name
  const numberMatch = name.match(/\d+/);
  if (numberMatch) {
    return numberMatch[0];
  }
  
  // Estimate based on common patterns
  if (name.includes('bunch') || name.includes('bundle')) return '1';
  if (name.includes('dozen')) return '12';
  if (name.includes('pair') || name.includes('couple')) return '2';
  if (name.includes('single') || name.includes('one')) return '1';
  
  return '1';
};

// Estimate unit from item name
const estimateUnit = (itemName) => {
  const name = itemName.toLowerCase();
  
  if (name.includes('bunch') || name.includes('bundle')) return 'bunch';
  if (name.includes('dozen')) return 'dozen';
  if (name.includes('lb') || name.includes('pound')) return 'lb';
  if (name.includes('kg') || name.includes('kilogram')) return 'kg';
  if (name.includes('oz') || name.includes('ounce')) return 'oz';
  if (name.includes('cup') || name.includes('cups')) return 'cup';
  if (name.includes('tbsp') || name.includes('tablespoon')) return 'tbsp';
  if (name.includes('tsp') || name.includes('teaspoon')) return 'tsp';
  if (name.includes('clove') || name.includes('cloves')) return 'clove';
  if (name.includes('slice') || name.includes('slices')) return 'slice';
  if (name.includes('piece') || name.includes('pieces')) return 'piece';
  
  return 'piece';
};

// Check if text is food-related
const isFoodRelated = (text) => {
  const foodKeywords = [
    'food', 'ingredient', 'cooking', 'recipe', 'kitchen', 'meal', 'dish',
    'vegetable', 'fruit', 'meat', 'dairy', 'grain', 'spice', 'herb',
    'tomato', 'onion', 'garlic', 'chicken', 'beef', 'fish', 'cheese',
    'bread', 'rice', 'pasta', 'potato', 'carrot', 'pepper', 'mushroom'
  ];
  
  const lowerText = text.toLowerCase();
  return foodKeywords.some(keyword => lowerText.includes(keyword));
};

// Extract quantity from text
const extractQuantity = (text) => {
  const numberMatch = text.match(/\d+/);
  return numberMatch ? numberMatch[0] : '1';
};

// Extract unit from text
const extractUnit = (text) => {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('lb') || lowerText.includes('pound')) return 'lb';
  if (lowerText.includes('kg') || lowerText.includes('kilogram')) return 'kg';
  if (lowerText.includes('oz') || lowerText.includes('ounce')) return 'oz';
  if (lowerText.includes('cup')) return 'cup';
  if (lowerText.includes('tbsp') || lowerText.includes('tablespoon')) return 'tbsp';
  if (lowerText.includes('tsp') || lowerText.includes('teaspoon')) return 'tsp';
  if (lowerText.includes('clove')) return 'clove';
  if (lowerText.includes('slice')) return 'slice';
  if (lowerText.includes('piece')) return 'piece';
  
  return 'piece';
};

// Remove duplicate items
const removeDuplicates = (items) => {
  const seen = new Set();
  return items.filter(item => {
    const key = item.name.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

// Helper function to validate image format
export const validateImageFormat = (imageSrc) => {
  const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const base64Header = imageSrc.split(',')[0];
  
  for (const format of validFormats) {
    if (base64Header.includes(format.split('/')[1])) {
      return true;
    }
  }
  
  return false;
};

// Helper function to compress image if needed
export const compressImage = (imageSrc, maxWidth = 1280, quality = 0.8) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      const compressedSrc = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedSrc);
    };
    img.src = imageSrc;
  });
};
