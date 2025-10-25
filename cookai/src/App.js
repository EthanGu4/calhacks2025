import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, Typography, AppBar, Toolbar } from '@mui/material';
import { motion } from 'framer-motion';
import IngredientScanner from './components/IngredientScanner';
import ManualInput from './components/ManualInput';
import IngredientList from './components/IngredientList';
import RecipeDisplay from './components/RecipeDisplay';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6b35',
    },
    secondary: {
      main: '#2c3e50',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
});

function App() {
  const [currentStep, setCurrentStep] = useState('scanner'); // 'scanner', 'manual', 'ingredients', 'recipes'
  const [ingredients, setIngredients] = useState([]);
  const [capturedImages, setCapturedImages] = useState([]);

  const handleIngredientsUpdate = (newIngredients) => {
    setIngredients(newIngredients);
  };

  const handleImagesUpdate = (newImages) => {
    setCapturedImages(newImages);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'scanner':
        return (
          <IngredientScanner
            onIngredientsUpdate={handleIngredientsUpdate}
            onImagesUpdate={handleImagesUpdate}
            onNext={() => setCurrentStep('manual')}
            existingIngredients={ingredients}
            existingImages={capturedImages}
          />
        );
      case 'manual':
        return (
          <ManualInput
            onIngredientsUpdate={handleIngredientsUpdate}
            onNext={() => setCurrentStep('ingredients')}
            existingIngredients={ingredients}
          />
        );
      case 'ingredients':
        return (
          <IngredientList
            ingredients={ingredients}
            images={capturedImages}
            onEdit={() => setCurrentStep('scanner')}
            onNext={() => setCurrentStep('recipes')}
          />
        );
      case 'recipes':
        return (
          <RecipeDisplay
            ingredients={ingredients}
            onBack={() => setCurrentStep('ingredients')}
            onRegenerate={() => setCurrentStep('recipes')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
        <AppBar position="static" sx={{ backgroundColor: 'primary.main' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              🍳 CookAI
            </Typography>
            <Typography variant="body2">
              {currentStep === 'scanner' && 'Scan Ingredients'}
              {currentStep === 'manual' && 'Add Ingredients'}
              {currentStep === 'ingredients' && 'Review Ingredients'}
              {currentStep === 'recipes' && 'Generated Recipes'}
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderCurrentStep()}
          </motion.div>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;