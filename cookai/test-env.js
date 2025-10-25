// Test script to verify environment variables are loaded
console.log('🔧 Environment Variables Test:');
console.log('REACT_APP_GOOGLE_VISION_API_KEY:', process.env.REACT_APP_GOOGLE_VISION_API_KEY);
console.log('REACT_APP_OPENAI_API_KEY:', process.env.REACT_APP_OPENAI_API_KEY);

if (process.env.REACT_APP_GOOGLE_VISION_API_KEY) {
  console.log('✅ Google Vision API Key is loaded!');
} else {
  console.log('❌ Google Vision API Key is NOT loaded!');
}
