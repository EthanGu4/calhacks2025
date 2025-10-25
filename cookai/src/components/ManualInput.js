import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Autocomplete,
  Grid,
  Chip,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Add,
  Delete,
  ArrowBack,
  ArrowForward,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const COMMON_INGREDIENTS = [
  'tomato', 'onion', 'garlic', 'potato', 'carrot', 'celery', 'bell pepper',
  'mushroom', 'spinach', 'lettuce', 'cucumber', 'zucchini', 'eggplant',
  'chicken', 'beef', 'pork', 'fish', 'salmon', 'shrimp', 'eggs',
  'milk', 'cheese', 'butter', 'yogurt', 'cream',
  'rice', 'pasta', 'bread', 'flour', 'sugar', 'salt', 'pepper',
  'olive oil', 'vegetable oil', 'vinegar', 'lemon', 'lime',
  'basil', 'oregano', 'thyme', 'rosemary', 'parsley', 'cilantro',
  'ginger', 'chili pepper', 'cumin', 'paprika', 'cinnamon',
  'apple', 'banana', 'orange', 'lemon', 'strawberry', 'blueberry',
  'almond', 'walnut', 'peanut', 'cashew',
  'chicken breast', 'ground beef', 'bacon', 'ham', 'sausage',
  'salmon fillet', 'tuna', 'cod', 'shrimp', 'crab', 'lobster',
  'tofu', 'tempeh', 'quinoa', 'brown rice', 'white rice',
  'black beans', 'kidney beans', 'chickpeas', 'lentils',
  'broccoli', 'cauliflower', 'cabbage', 'kale', 'arugula',
  'sweet potato', 'butternut squash', 'pumpkin', 'corn',
  'avocado', 'coconut', 'pineapple', 'mango', 'peach', 'pear'
];

const UNITS = [
  'piece', 'cup', 'tbsp', 'tsp', 'oz', 'lb', 'kg', 'g', 'ml', 'l', 'clove', 'slice', 'can', 'bunch', 'head'
];

const ManualInput = ({
  onIngredientsUpdate,
  onNext,
  existingIngredients = [],
}) => {
  const [ingredients, setIngredients] = useState(existingIngredients);
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    quantity: '1',
    unit: 'piece',
  });
  const [error, setError] = useState('');

  const handleAddIngredient = () => {
    if (!newIngredient.name.trim()) {
      setError('Please enter an ingredient name');
      return;
    }

    const ingredient = {
      id: Date.now(),
      name: newIngredient.name.toLowerCase().trim(),
      quantity: newIngredient.quantity,
      unit: newIngredient.unit,
      source: 'manual',
      confidence: 1.0, // Manual entries have 100% confidence
    };

    // Check for duplicates
    const isDuplicate = ingredients.some(
      ing => ing.name.toLowerCase() === ingredient.name.toLowerCase()
    );

    if (isDuplicate) {
      setError('This ingredient is already in your list');
      return;
    }

    setIngredients(prev => [...prev, ingredient]);
    onIngredientsUpdate([...ingredients, ingredient]);
    setNewIngredient({ name: '', quantity: '1', unit: 'piece' });
    setError('');
  };

  const handleDeleteIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
    onIngredientsUpdate(updatedIngredients);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddIngredient();
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Add Ingredients Manually
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Add ingredients that weren't detected by the camera or add additional items
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Add New Ingredient */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Add New Ingredient
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Autocomplete
                  freeSolo
                  options={COMMON_INGREDIENTS}
                  value={newIngredient.name}
                  onChange={(event, newValue) => {
                    setNewIngredient(prev => ({ ...prev, name: newValue || '' }));
                  }}
                  onInputChange={(event, newInputValue) => {
                    setNewIngredient(prev => ({ ...prev, name: newInputValue }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Ingredient Name"
                      placeholder="Type or select an ingredient"
                      onKeyPress={handleKeyPress}
                    />
                  )}
                />
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    label="Quantity"
                    type="number"
                    value={newIngredient.quantity}
                    onChange={(e) => setNewIngredient(prev => ({ ...prev, quantity: e.target.value }))}
                    sx={{ flex: 1 }}
                  />
                  <Autocomplete
                    options={UNITS}
                    value={newIngredient.unit}
                    onChange={(event, newValue) => {
                      setNewIngredient(prev => ({ ...prev, unit: newValue || 'piece' }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Unit"
                        sx={{ minWidth: 120 }}
                      />
                    )}
                  />
                </Box>
                
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddIngredient}
                  fullWidth
                  size="large"
                >
                  Add Ingredient
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Ingredients */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Ingredients ({ingredients.length})
              </Typography>
              
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                <AnimatePresence>
                  {ingredients.map((ingredient, index) => (
                    <motion.div
                      key={ingredient.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      style={{ marginBottom: 8 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}
                          color={ingredient.source === 'camera' ? 'primary' : 'secondary'}
                          sx={{ flexGrow: 1 }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteIngredient(index)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {ingredients.length === 0 && (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                    No ingredients added yet. Start by adding some ingredients above.
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Navigation */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={() => window.history.back()}
                >
                  Back to Scanner
                </Button>
                
                <Typography variant="body1" color="text.secondary">
                  {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} ready
                </Typography>
                
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  onClick={onNext}
                  disabled={ingredients.length === 0}
                  size="large"
                >
                  Review Ingredients
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManualInput;
