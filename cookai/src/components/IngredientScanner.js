import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CameraAlt,
  PhotoCamera,
  Delete,
  Edit,
  Check,
  Close,
} from '@mui/icons-material';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeImageWithGoogleVision } from '../services/visionService';

const IngredientScanner = ({
  onIngredientsUpdate,
  onImagesUpdate,
  onNext,
  existingIngredients = [],
  existingImages = [],
}) => {
  const webcamRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImages, setCapturedImages] = useState(existingImages);
  const [ingredients, setIngredients] = useState(existingIngredients);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [editDialog, setEditDialog] = useState({ open: false, ingredient: null, index: -1 });
  const [error, setError] = useState('');

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'environment', // Use back camera on mobile
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      const newImage = {
        id: Date.now(),
        src: imageSrc,
        timestamp: new Date().toISOString(),
      };
      setCapturedImages(prev => [...prev, newImage]);
      onImagesUpdate([...capturedImages, newImage]);
    }
  }, [capturedImages, onImagesUpdate]);

  const analyzeImage = async (imageSrc) => {
    setIsAnalyzing(true);
    setError('');
    
    try {
      const results = await analyzeImageWithGoogleVision(imageSrc);
      if (results && results.length > 0) {
        const newIngredients = results.map((result, index) => ({
          id: Date.now() + index,
          name: result.name,
          confidence: result.confidence,
          category: result.category,
          quantity: result.quantity || '1',
          unit: result.unit || 'piece',
          source: 'camera',
        }));
        
        setIngredients(prev => [...prev, ...newIngredients]);
        onIngredientsUpdate([...ingredients, ...newIngredients]);
      } else {
        setError('No ingredients detected. Try capturing a clearer image.');
      }
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeLastImage = () => {
    if (capturedImages.length > 0) {
      const lastImage = capturedImages[capturedImages.length - 1];
      analyzeImage(lastImage.src);
    }
  };

  const handleEditIngredient = (ingredient, index) => {
    setEditDialog({ open: true, ingredient, index });
  };

  const handleSaveEdit = () => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[editDialog.index] = editDialog.ingredient;
    setIngredients(updatedIngredients);
    onIngredientsUpdate(updatedIngredients);
    setEditDialog({ open: false, ingredient: null, index: -1 });
  };

  const handleDeleteIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
    onIngredientsUpdate(updatedIngredients);
  };

  const handleDeleteImage = (imageId) => {
    const updatedImages = capturedImages.filter(img => img.id !== imageId);
    setCapturedImages(updatedImages);
    onImagesUpdate(updatedImages);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Scan Your Ingredients
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Use your camera to scan ingredients and let AI identify them automatically
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Camera Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Camera Scanner
              </Typography>
              
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  width="100%"
                  height="auto"
                  style={{ borderRadius: 8 }}
                />
                
                {isAnalyzing && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      borderRadius: 2,
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <CircularProgress size={24} color="primary" />
                    <Typography variant="body2" color="white">
                      Analyzing...
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<PhotoCamera />}
                  onClick={capture}
                  disabled={isAnalyzing}
                  fullWidth
                >
                  Capture
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CameraAlt />}
                  onClick={handleAnalyzeLastImage}
                  disabled={capturedImages.length === 0 || isAnalyzing}
                  fullWidth
                >
                  Analyze
                </Button>
              </Box>
              
              <Button
                variant="text"
                onClick={onNext}
                fullWidth
                sx={{ mt: 1 }}
              >
                Skip Camera - Add Ingredients Manually
              </Button>

              <Typography variant="body2" color="text.secondary">
                {capturedImages.length} image(s) captured
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Captured Images */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Captured Images
              </Typography>
              
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                <AnimatePresence>
                  {capturedImages.map((image) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      style={{ marginBottom: 8 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <img
                          src={image.src}
                          alt="Captured"
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: 'cover',
                            borderRadius: 4,
                          }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2">
                            {new Date(image.timestamp).toLocaleTimeString()}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteImage(image.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Detected Ingredients */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detected Ingredients ({ingredients.length})
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <AnimatePresence>
                  {ingredients.map((ingredient, index) => (
                    <motion.div
                      key={ingredient.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Chip
                        label={`${ingredient.name} (${Math.round(ingredient.confidence * 100)}%)`}
                        color={ingredient.confidence > 0.7 ? 'success' : 'warning'}
                        onDelete={() => handleDeleteIngredient(index)}
                        onClick={() => handleEditIngredient(ingredient, index)}
                        icon={<Edit />}
                        sx={{ mb: 1 }}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Box>

              {ingredients.length > 0 && (
                <Button
                  variant="contained"
                  size="large"
                  onClick={onNext}
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  Continue to Manual Input ({ingredients.length} ingredients)
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Ingredient Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, ingredient: null, index: -1 })}>
        <DialogTitle>Edit Ingredient</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Ingredient Name"
            fullWidth
            variant="outlined"
            value={editDialog.ingredient?.name || ''}
            onChange={(e) => setEditDialog({
              ...editDialog,
              ingredient: { ...editDialog.ingredient, name: e.target.value }
            })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Quantity"
            fullWidth
            variant="outlined"
            value={editDialog.ingredient?.quantity || ''}
            onChange={(e) => setEditDialog({
              ...editDialog,
              ingredient: { ...editDialog.ingredient, quantity: e.target.value }
            })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Unit"
            fullWidth
            variant="outlined"
            value={editDialog.ingredient?.unit || ''}
            onChange={(e) => setEditDialog({
              ...editDialog,
              ingredient: { ...editDialog.ingredient, unit: e.target.value }
            })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, ingredient: null, index: -1 })}>
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} startIcon={<Check />}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IngredientScanner;
