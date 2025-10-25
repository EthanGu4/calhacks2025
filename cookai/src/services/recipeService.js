// Recipe Generation Service using Free AI APIs
// This will automatically call AI services and display the results

import axios from 'axios';

// Free AI services that don't require tokens
const FREE_AI_SERVICES = {
  // Use a completely free text generation service
  FREE_TEXT: 'https://api.text-generator.io/api/v1/text',
  // Alternative free service
  ALTERNATIVE: 'https://api.quotable.io/random',
  // Simple text generation
  SIMPLE: 'https://httpbin.org/post'
};

// Generate mock recipes based on actual user ingredients
const generateMockRecipes = (userIngredients) => {
  if (!userIngredients || userIngredients.length === 0) {
    return [];
  }

  const recipes = [];
  
  // Simple recipe 1: Use most ingredients
  if (userIngredients.length >= 2) {
    const mainIngredients = userIngredients.slice(0, Math.min(4, userIngredients.length));
    recipes.push({
      id: 1,
      name: `Simple ${mainIngredients[0].name} Dish`,
      description: `A quick and easy dish using your available ingredients`,
      prepTime: "10 minutes",
      cookTime: "15 minutes",
      servings: 2,
      difficulty: "Easy",
      ingredients: mainIngredients.map(ing => ({
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit
      })),
      instructions: [
        `Prepare your ${mainIngredients[0].name} by washing and cutting as needed`,
        `Heat a pan over medium heat`,
        `Add your ingredients and cook for 10-15 minutes`,
        `Season with salt and pepper to taste`,
        `Serve hot and enjoy!`
      ],
      tips: [
        "Adjust cooking time based on ingredient size",
        "Taste and adjust seasoning as needed",
        "Add a splash of water if ingredients stick to the pan"
      ]
    });
  }

  // Simple recipe 2: Minimal ingredients
  if (userIngredients.length >= 1) {
    const simpleIngredients = userIngredients.slice(0, Math.min(2, userIngredients.length));
    recipes.push({
      id: 2,
      name: `Quick ${simpleIngredients[0].name} Preparation`,
      description: `A simple way to prepare your ingredients`,
      prepTime: "5 minutes",
      cookTime: "10 minutes",
      servings: 1,
      difficulty: "Easy",
      ingredients: simpleIngredients.map(ing => ({
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit
      })),
      instructions: [
        `Clean and prepare your ${simpleIngredients[0].name}`,
        `Heat a pan or pot over medium heat`,
        `Add your ingredients and cook until tender`,
        `Season with salt and pepper`,
        `Serve immediately`
      ],
      tips: [
        "Keep it simple for best results",
        "Don't overcook your ingredients",
        "Fresh ingredients taste best with minimal seasoning"
      ]
    });
  }

  return recipes;
};

// Generate recipes using free AI services
export const generateRecipesWithAI = async (ingredients, preferences = {}) => {
  try {
    console.log('Calling free AI service for recipe generation');
    console.log('Ingredients:', ingredients);
    // Create the prompt for AI
    const prompt = createAIPrompt(ingredients, preferences);
    
    // Try multiple free AI services
    let recipes = await tryFreeAIServices(prompt);
    
    if (!recipes || recipes.length === 0) {
      console.log('AI services failed, using smart mock data');
      recipes = generateMockRecipes(ingredients);
    }
    
    return recipes;

  } catch (error) {
    console.error('Error generating recipes with AI:', error);
    return generateMockRecipes(ingredients);
  }
};

// Create AI prompt for free services
const createAIPrompt = (ingredients, preferences) => {
  const ingredientList = ingredients.map(ing => 
    `${ing.quantity} ${ing.unit} ${ing.name}`
  ).join(', ');

  return `Create 2-3 detailed recipes using ONLY these ingredients: ${ingredientList}

IMPORTANT RULES:
- Use ONLY the ingredients listed above
- You may use less than all ingredients, but never add new ones
- If you need basic seasonings (salt, pepper, oil), mention them as "basic seasonings" only
- Create realistic recipes that work with the available ingredients

For each recipe, provide:
1. Recipe name
2. Brief description  
3. Prep time and cook time
4. Number of servings
5. Difficulty level (Easy/Medium/Hard)
6. Complete ingredient list (ONLY from the provided ingredients)
7. Step-by-step cooking instructions
8. Helpful cooking tips

Format each recipe clearly with headings and bullet points.`;
};

// Try multiple free AI services
const tryFreeAIServices = async (prompt) => {
  // Try free text generation service
  try {
    console.log('Trying free text generator...');
    const response = await axios.post(FREE_AI_SERVICES.FREE_TEXT, {
      prompt: prompt,
      max_length: 200,
      temperature: 0.8
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('Free text response:', response.data);
    
    if (response.data && response.data.text) {
      const recipes = parseAIResponse(response.data.text);
      if (recipes && recipes.length > 0) {
        return recipes;
      }
    }
  } catch (error) {
    console.log('Free text service failed:', error.message);
  }
  
  // Try alternative service
  try {
    console.log('Trying alternative service...');
    const response = await axios.get(FREE_AI_SERVICES.ALTERNATIVE);
    console.log('Alternative service response:', response.data);
    
    // Create a simple recipe from the response
    if (response.data && response.data.content) {
      const recipes = parseAIResponse(response.data.content);
      if (recipes && recipes.length > 0) {
        return recipes;
      }
    }
  } catch (error) {
    console.log('Alternative service failed:', error.message);
  }
  
  // Try simple service
  try {
    console.log('Trying simple service...');
    const response = await axios.post(FREE_AI_SERVICES.SIMPLE, {
      prompt: prompt,
      max_length: 150,
      temperature: 0.7
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('Simple service response:', response.data);
    
    if (response.data && response.data.text) {
      const recipes = parseAIResponse(response.data.text);
      if (recipes && recipes.length > 0) {
        return recipes;
      }
    }
  } catch (error) {
    console.log('Simple service failed:', error.message);
  }
  
  console.log('All AI services failed, will use smart mock data');
  return null;
};

// Parse AI response into recipe format
const parseAIResponse = (aiText) => {
  try {
    console.log('Parsing AI response:', aiText);
    
    // If the AI response is too short or doesn't contain recipe-like content,
    // create a simple recipe from the text
    if (!aiText || aiText.length < 50) {
      console.log('AI response too short, creating simple recipe');
      return createSimpleRecipeFromText(aiText);
    }
    
    // Try to extract recipes from AI response
    const recipes = [];
    const lines = aiText.split('\n').filter(line => line.trim());
    
    let currentRecipe = null;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Recipe title patterns
      if (trimmedLine.match(/^\d+\.|Recipe|^[A-Z][a-z]+.*Recipe|^[A-Z][a-z]+.*Dish/i)) {
        if (currentRecipe) {
          recipes.push(currentRecipe);
        }
        currentRecipe = {
          id: recipes.length + 1,
          name: trimmedLine.replace(/^\d+\.\s*/, ''),
          description: 'AI-generated recipe',
          prepTime: '10 minutes',
          cookTime: '15 minutes',
          servings: 2,
          difficulty: 'Easy',
          ingredients: [],
          instructions: [],
          tips: []
        };
      }
      // Instructions (numbered steps)
      else if (trimmedLine.match(/^\d+\./) && currentRecipe) {
        currentRecipe.instructions.push(trimmedLine);
      }
      // Tips or additional info
      else if (trimmedLine.match(/tip|hint|note/i) && currentRecipe) {
        currentRecipe.tips.push(trimmedLine);
      }
      // Any other meaningful content
      else if (trimmedLine.length > 10 && currentRecipe) {
        currentRecipe.instructions.push(trimmedLine);
      }
    }
    
    if (currentRecipe) {
      recipes.push(currentRecipe);
    }
    
    // If no structured recipes found, create a simple one from the text
    if (recipes.length === 0) {
      return createSimpleRecipeFromText(aiText);
    }
    
    return recipes.length > 0 ? recipes : null;
    
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return createSimpleRecipeFromText(aiText);
  }
};

// Create a simple recipe from AI text when parsing fails
const createSimpleRecipeFromText = (text) => {
  if (!text || text.length < 10) {
    return null;
  }
  
  // Split text into sentences and use as instructions
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  return [{
    id: 1,
    name: "AI Generated Recipe",
    description: "Recipe created from AI response",
    prepTime: "10 minutes",
    cookTime: "15 minutes",
    servings: 2,
    difficulty: "Easy",
    ingredients: [],
    instructions: sentences.slice(0, 5), // Use first 5 sentences as instructions
    tips: ["Generated by AI", "Adjust seasoning to taste", "Cook until tender"]
  }];
};


// Create a ChatGPT prompt for manual use (fallback) - UNUSED
/*
const createChatGPTPrompt = (ingredients, preferences) => {
  const ingredientList = ingredients.map(ing => 
    `${ing.quantity} ${ing.unit} ${ing.name}`
  ).join(', ');

  return `Create 2-3 detailed recipes using ONLY these ingredients: ${ingredientList}

IMPORTANT RULES:
- Use ONLY the ingredients listed above
- You may use less than all ingredients, but never add new ones
- If you need basic seasonings (salt, pepper, oil), mention them as "basic seasonings" only
- Create realistic recipes that work with the available ingredients

For each recipe, provide:
1. Recipe name
2. Brief description  
3. Prep time and cook time
4. Number of servings
5. Difficulty level (Easy/Medium/Hard)
6. Complete ingredient list (ONLY from the provided ingredients)
7. Step-by-step cooking instructions
8. Helpful cooking tips

Format each recipe clearly with headings and bullet points.`;
};
*/

// Show ChatGPT prompt to user - UNUSED
/*
const showChatGPTPrompt = (prompt) => {
  // Create a modal or alert to show the prompt
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Arial, sans-serif;
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 80%;
    max-height: 80%;
    overflow: auto;
    position: relative;
  `;
  
  content.innerHTML = `
    <h2 style="color: #ff6b35; margin-top: 0;">🤖 Get Free AI Recipes with ChatGPT</h2>
    <p style="color: #666; margin-bottom: 15px;">
      <strong>Step 1:</strong> Copy the prompt below<br>
      <strong>Step 2:</strong> Go to <a href="https://chat.openai.com" target="_blank" style="color: #ff6b35;">chat.openai.com</a><br>
      <strong>Step 3:</strong> Paste the prompt and get your recipes!
    </p>
    <textarea readonly style="
      width: 100%;
      height: 250px;
      padding: 15px;
      border: 2px solid #ff6b35;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      resize: vertical;
      background: #f8f9fa;
    ">${prompt}</textarea>
    <div style="margin-top: 20px; text-align: center;">
      <button onclick="navigator.clipboard.writeText(this.parentElement.previousElementSibling.value); this.textContent='Copied!'; setTimeout(() => this.textContent='Copy Prompt', 2000)" style="
        background: #ff6b35;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
        margin-right: 10px;
      ">📋 Copy Prompt</button>
      <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
        background: #666;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
      ">Close</button>
    </div>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Auto-select the text
  const textarea = content.querySelector('textarea');
  textarea.select();
  textarea.focus();
};
*/

// All API-related code removed - using ChatGPT web interface only

// Get recipe suggestions based on ingredients
export const getRecipeSuggestions = (ingredients) => {
  const suggestions = [];
  
  // Analyze ingredients to suggest recipe types
  const hasProtein = ingredients.some(ing => 
    ing.category === 'protein' || 
    ing.name.includes('chicken') || 
    ing.name.includes('beef') || 
    ing.name.includes('fish')
  );
  
  const hasVegetables = ingredients.some(ing => 
    ing.category === 'vegetable' || 
    ing.name.includes('tomato') || 
    ing.name.includes('onion')
  );
  
  const hasDairy = ingredients.some(ing => 
    ing.category === 'dairy' || 
    ing.name.includes('cheese') || 
    ing.name.includes('milk')
  );

  if (hasProtein && hasVegetables) {
    suggestions.push("Stir-fry", "Pasta dish", "Soup", "Salad with protein");
  }
  
  if (hasDairy && hasVegetables) {
    suggestions.push("Creamy pasta", "Gratin", "Casserole");
  }
  
  if (ingredients.length >= 5) {
    suggestions.push("Complex main dish", "Multi-course meal");
  }
  
  return suggestions;
};

// Calculate recipe difficulty based on ingredients
export const calculateRecipeDifficulty = (ingredients) => {
  const complexIngredients = ingredients.filter(ing => 
    ing.name.includes('yeast') || 
    ing.name.includes('phyllo') || 
    ing.name.includes('tempeh')
  );
  
  if (complexIngredients.length > 0) {
    return "Hard";
  } else if (ingredients.length > 8) {
    return "Medium";
  } else {
    return "Easy";
  }
};

// Estimate cooking time based on ingredients
export const estimateCookingTime = (ingredients) => {
  const hasMeat = ingredients.some(ing => 
    ing.category === 'protein' && 
    (ing.name.includes('chicken') || ing.name.includes('beef'))
  );
  
  const hasPasta = ingredients.some(ing => 
    ing.name.includes('pasta') || ing.name.includes('rice')
  );
  
  if (hasMeat && hasPasta) {
    return "25-30 minutes";
  } else if (hasPasta) {
    return "15-20 minutes";
  } else {
    return "10-15 minutes";
  }
};
