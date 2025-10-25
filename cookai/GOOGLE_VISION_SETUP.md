# Google Vision API Setup Guide

## 🚀 Quick Setup

### 1. Get Google Cloud API Key

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** (or select existing)
3. **Enable Vision API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Cloud Vision API"
   - Click "Enable"
4. **Create API Key**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key

### 2. Configure Environment Variables

Create a `.env` file in the `cookai` directory:

```bash
REACT_APP_GOOGLE_VISION_API_KEY=your_api_key_here
```

### 3. Test the Setup

The app will automatically use Google Vision API when the key is configured. You can test by:

1. **Start the app**: `npm start`
2. **Go to camera scanner**
3. **Take a photo** of any food items
4. **Check browser console** for detection results

## 🔧 Advanced Configuration

### API Quotas and Limits

- **Free Tier**: 1,000 requests/month
- **Paid Tier**: $1.50 per 1,000 requests
- **Rate Limit**: 600 requests/minute

### Supported Image Formats

- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)
- **WebP** (.webp)
- **BMP** (.bmp)
- **GIF** (.gif)
- **TIFF** (.tiff)

### Detection Features Enabled

1. **Label Detection**: Identifies objects, food items, scenes
2. **Object Localization**: Finds spatial location of objects
3. **Text Detection**: Reads labels, packaging, text
4. **Web Detection**: Uses web context for better identification

## 🛠️ Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check API key is correct
2. **403 Forbidden**: Enable Vision API in Google Cloud Console
3. **429 Too Many Requests**: Rate limit exceeded
4. **400 Bad Request**: Invalid image format

### Debug Mode

Enable debug logging by adding to `.env`:
```bash
REACT_APP_DEBUG_VISION=true
```

## 📊 What Gets Detected

The enhanced Vision API now detects:

- **Food Items**: Any food, not just predefined list
- **Text on Packaging**: Labels, ingredients, quantities
- **Spatial Objects**: Location and size of items
- **Web Context**: Related information from web
- **Categories**: Automatically categorizes items

## 🔒 Security Notes

- **API Key**: Keep your API key secure
- **Rate Limits**: Monitor usage to avoid charges
- **Image Privacy**: Images are sent to Google for processing

## 💡 Tips for Better Detection

1. **Good Lighting**: Well-lit photos work better
2. **Clear Focus**: Sharp, in-focus images
3. **Multiple Angles**: Try different camera angles
4. **Close-up**: Get close to individual items
5. **Clean Background**: Avoid cluttered backgrounds

## 🚀 Ready to Use!

Once configured, the app will automatically:
- Detect ANY food items in photos
- Extract text from packaging
- Categorize ingredients automatically
- Provide confidence scores
- Handle multiple items in one photo
