# CookAI - Smart Recipe Generator

CookAI is a web application that helps users cook with leftover ingredients by using AI to scan ingredients and generate personalized recipes.

## Features

### Phase 1 & 2 (Current Implementation)
- 📸 **Camera Ingredient Scanning**: Use your device's camera to scan ingredients
- 🤖 **AI Ingredient Recognition**: Google Vision API integration for automatic ingredient detection
- ✏️ **Manual Ingredient Input**: Add ingredients manually with autocomplete suggestions
- 📝 **Ingredient Management**: Review, edit, and organize your ingredient list
- 🎨 **Modern UI**: Beautiful, responsive interface with Material-UI components

### Future Phases
- 🍳 **AI Recipe Generation**: ChatGPT-powered recipe creation
- 🎬 **Cooking Animations**: Step-by-step cooking process visualization
- ⚙️ **User Preferences**: Cost, cuisine, and dietary preference settings
- 📅 **Long-term Planning**: Extended meal planning and shopping lists

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Material-UI (MUI)
- **Animations**: Framer Motion
- **Camera**: React Webcam
- **AI Services**: Google Vision API, OpenAI GPT-4
- **Styling**: CSS3 with custom animations

## Setup Instructions

### 1. Install Dependencies

```bash
cd cookai
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Google Vision API (Optional - app works with mock data)
REACT_APP_GOOGLE_VISION_API_KEY=your_google_vision_api_key_here

# OpenAI API (For future recipe generation)
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Google Vision API Setup (Optional)

The app currently uses mock data for development. To enable real Google Vision API:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Vision API
4. Create credentials (API Key)
5. Add the API key to your `.env` file

### 4. Run the Application

```bash
npm start
```

The app will open at `http://localhost:3000`

## How to Use

### Step 1: Scan Ingredients
1. Click "Capture" to take a photo of your ingredients
2. Click "Analyze" to let AI identify the ingredients
3. Review and edit the detected ingredients
4. Add multiple photos as needed

### Step 2: Manual Input
1. Add any missed ingredients manually
2. Use the autocomplete for common ingredients
3. Set quantities and units
4. Review your complete ingredient list

### Step 3: Review Ingredients
1. Edit any ingredient details
2. Remove unwanted items
3. Confirm your final ingredient list
4. Proceed to recipe generation (coming in Phase 3)

## Testing the Application

### Camera Functionality
1. **Grant Camera Permission**: Allow camera access when prompted
2. **Test Capture**: Click "Capture" to take photos
3. **Test Analysis**: Click "Analyze" to see mock ingredient detection
4. **Mobile Testing**: Test on mobile devices for better camera experience

### Manual Input
1. **Autocomplete**: Type ingredient names to see suggestions
2. **Quantity/Units**: Test different quantity and unit combinations
3. **Add/Remove**: Test adding and removing ingredients

### UI/UX Testing
1. **Responsive Design**: Test on different screen sizes
2. **Animations**: Check smooth transitions and hover effects
3. **Error Handling**: Test with invalid inputs
4. **Navigation**: Test flow between different steps

## Development Notes

### Mock Data
The app currently uses mock ingredient data for development. The `visionService.js` file contains:
- Mock ingredient database
- Simulated API delays
- Random confidence scores
- Realistic ingredient categories

### Component Structure
```
src/
├── components/
│   ├── IngredientScanner.js    # Camera scanning interface
│   ├── ManualInput.js          # Manual ingredient entry
│   └── IngredientList.js       # Review and edit ingredients
├── services/
│   └── visionService.js        # Google Vision API integration
└── App.js                      # Main application component
```

### Key Features Implemented
- ✅ Camera integration with React Webcam
- ✅ Mock Google Vision API simulation
- ✅ Manual ingredient input with autocomplete
- ✅ Ingredient management (add, edit, delete)
- ✅ Responsive Material-UI design
- ✅ Smooth animations with Framer Motion
- ✅ Error handling and loading states

## Troubleshooting

### Camera Issues
- **Permission Denied**: Ensure camera permissions are granted
- **No Camera Found**: Check if camera is connected and not in use by other apps
- **Poor Quality**: Ensure good lighting and stable camera position

### Performance Issues
- **Slow Loading**: Check network connection for API calls
- **Memory Issues**: Clear browser cache and restart the app
- **Mobile Performance**: Close other apps to free up memory

### Development Issues
- **Dependencies**: Run `npm install` to ensure all packages are installed
- **Port Conflicts**: Change port with `PORT=3001 npm start`
- **Build Issues**: Clear cache with `npm start -- --reset-cache`

## Next Steps

1. **Phase 3**: Implement ChatGPT recipe generation
2. **Phase 4**: Add cooking animations
3. **Phase 5**: User preferences and long-term planning
4. **Phase 6**: Polish and optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.