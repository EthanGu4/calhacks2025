import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ExpandMore,
  AccessTime,
  People,
  TrendingUp,
  Restaurant,
  Lightbulb,
  ArrowBack,
  Refresh,
  Share,
  Bookmark,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { generateRecipesWithAI, getRecipeSuggestions } from '../services/recipeService';

const RecipeDisplay = ({ ingredients, onBack, onRegenerate }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    generateRecipes();
    setSuggestions(getRecipeSuggestions(ingredients));
  }, [ingredients]);

  const generateRecipes = async () => {
    setLoading(true);
    setError('');
    
    try {
      const generatedRecipes = await generateRecipesWithAI(ingredients);
      setRecipes(generatedRecipes);
    } catch (err) {
      setError('Failed to generate recipes. Please try again.');
      console.error('Error generating recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  const formatTime = (time) => {
    return time.replace(/\d+/g, match => `${match} min`);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" color="primary">
          🍳 Generated Recipes
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={onBack}
          >
            Back to Ingredients
          </Button>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={generateRecipes}
            disabled={loading}
          >
            Regenerate
          </Button>
        </Box>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2, alignSelf: 'center' }}>
            Generating recipes with AI...
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {suggestions.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              💡 Recipe Suggestions
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {suggestions.map((suggestion, index) => (
                <Chip
                  key={index}
                  label={suggestion}
                  color="info"
                  variant="outlined"
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        <AnimatePresence>
          {recipes.map((recipe, index) => (
            <Grid item xs={12} md={6} key={recipe.id || index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                  onClick={() => handleRecipeSelect(recipe)}
                >
                  <CardContent>
                    <Typography variant="h5" gutterBottom color="primary">
                      {recipe.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {recipe.description}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      <Chip
                        icon={<AccessTime />}
                        label={`Prep: ${formatTime(recipe.prepTime)}`}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                      <Chip
                        icon={<AccessTime />}
                        label={`Cook: ${formatTime(recipe.cookTime)}`}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                      <Chip
                        icon={<People />}
                        label={`${recipe.servings} servings`}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                      <Chip
                        label={recipe.difficulty}
                        size="small"
                        color={getDifficultyColor(recipe.difficulty)}
                        variant="outlined"
                      />
                    </Box>

                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                      Key Ingredients:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {recipe.ingredients.slice(0, 4).map((ingredient, idx) => (
                        <Chip
                          key={idx}
                          label={`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                      {recipe.ingredients.length > 4 && (
                        <Chip
                          label={`+${recipe.ingredients.length - 4} more`}
                          size="small"
                          color="default"
                          variant="outlined"
                        />
                      )}
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<Restaurant />}
                    >
                      View Full Recipe
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>

      {/* Recipe Detail Dialog */}
      <Dialog 
        open={!!selectedRecipe} 
        onClose={() => setSelectedRecipe(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedRecipe && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">
                  {selectedRecipe.name}
                </Typography>
                <Box>
                  <IconButton>
                    <Bookmark />
                  </IconButton>
                  <IconButton>
                    <Share />
                  </IconButton>
                </Box>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {selectedRecipe.description}
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    📋 Ingredients
                  </Typography>
                  <List dense>
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    ⏱️ Timing
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime color="info" />
                      <Typography>Prep: {selectedRecipe.prepTime}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime color="warning" />
                      <Typography>Cook: {selectedRecipe.cookTime}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <People color="secondary" />
                      <Typography>Serves: {selectedRecipe.servings}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUp color="primary" />
                      <Typography>Difficulty: {selectedRecipe.difficulty}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="h6">👨‍🍳 Cooking Instructions</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {selectedRecipe.instructions.map((instruction, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <Typography variant="h6" color="primary">
                                {index + 1}
                              </Typography>
                            </ListItemIcon>
                            <ListItemText primary={instruction} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>

                  {selectedRecipe.tips && selectedRecipe.tips.length > 0 && (
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="h6">💡 Pro Tips</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List>
                          {selectedRecipe.tips.map((tip, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <Lightbulb color="warning" />
                              </ListItemIcon>
                              <ListItemText primary={tip} />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={() => setSelectedRecipe(null)}>
                Close
              </Button>
              <Button variant="contained" startIcon={<Bookmark />}>
                Save Recipe
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default RecipeDisplay;
