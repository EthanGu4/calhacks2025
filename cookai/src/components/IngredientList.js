import React, { useState } from 'react';
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
  Divider,
} from '@mui/material';
import {
  Edit,
  Delete,
  ArrowBack,
  ArrowForward,
  CameraAlt,
  EditNote,
  CheckCircle,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const IngredientList = ({
  ingredients = [],
  images = [],
  onEdit,
  onNext,
}) => {
  const [editDialog, setEditDialog] = useState({ open: false, ingredient: null, index: -1 });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, index: -1 });

  const handleEditIngredient = (ingredient, index) => {
    setEditDialog({ open: true, ingredient: { ...ingredient }, index });
  };

  const handleSaveEdit = () => {
    // This would need to be passed up to parent component
    // For now, we'll just close the dialog
    setEditDialog({ open: false, ingredient: null, index: -1 });
  };

  const handleDeleteIngredient = (index) => {
    setDeleteDialog({ open: true, index });
  };

  const confirmDelete = () => {
    // This would need to be passed up to parent component
    setDeleteDialog({ open: false, index: -1 });
  };

  const getIngredientStats = () => {
    const cameraIngredients = ingredients.filter(ing => ing.source === 'camera');
    const manualIngredients = ingredients.filter(ing => ing.source === 'manual');
    const highConfidence = ingredients.filter(ing => ing.confidence > 0.7);
    
    return {
      total: ingredients.length,
      camera: cameraIngredients.length,
      manual: manualIngredients.length,
      highConfidence: highConfidence.length,
    };
  };

  const stats = getIngredientStats();

  return (
    <Box>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Review Your Ingredients
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Review and edit your ingredients before generating recipes
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="primary">
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Ingredients
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="info.main">
              {stats.camera}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              From Camera
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="secondary.main">
              {stats.manual}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manual Entry
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="success.main">
              {stats.highConfidence}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              High Confidence
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Ingredients List */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Ingredients ({ingredients.length})
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<EditNote />}
                  onClick={onEdit}
                  size="small"
                >
                  Edit All
                </Button>
              </Box>
              
              <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
                <AnimatePresence>
                  {ingredients.map((ingredient, index) => (
                    <motion.div
                      key={ingredient.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2,
                          mb: 1,
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      >
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {ingredient.name}
                            </Typography>
                            <Chip
                              label={`${ingredient.quantity} ${ingredient.unit}`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            {ingredient.source === 'camera' && (
                              <Chip
                                icon={<CameraAlt />}
                                label={`${Math.round(ingredient.confidence * 100)}%`}
                                size="small"
                                color={ingredient.confidence > 0.7 ? 'success' : 'warning'}
                                variant="outlined"
                              />
                            )}
                            {ingredient.source === 'manual' && (
                              <Chip
                                icon={<EditNote />}
                                label="Manual"
                                size="small"
                                color="secondary"
                                variant="outlined"
                              />
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {ingredient.category && `Category: ${ingredient.category}`}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEditIngredient(ingredient, index)}
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteIngredient(index)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {ingredients.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No ingredients found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Go back and add some ingredients to get started
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Captured Images */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Captured Images ({images.length})
              </Typography>
              
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                <AnimatePresence>
                  {images.map((image) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      style={{ marginBottom: 8 }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <img
                          src={image.src}
                          alt="Captured"
                          style={{
                            width: '100%',
                            height: 120,
                            objectFit: 'cover',
                            borderRadius: 8,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            position: 'absolute',
                            bottom: 4,
                            left: 4,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            px: 1,
                            borderRadius: 1,
                          }}
                        >
                          {new Date(image.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {images.length === 0 && (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                    No images captured
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
                  onClick={onEdit}
                >
                  Back to Edit
                </Button>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Ready to generate recipes with {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''}
                  </Typography>
                </Box>
                
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  onClick={onNext}
                  disabled={ingredients.length === 0}
                  size="large"
                  startIcon={<CheckCircle />}
                >
                  Generate Recipes
                </Button>
              </Box>
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
          <Button onClick={handleSaveEdit} startIcon={<CheckCircle />}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, index: -1 })}>
        <DialogTitle>Delete Ingredient</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this ingredient? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, index: -1 })}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" startIcon={<Delete />}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IngredientList;
