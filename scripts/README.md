# Database Seeding Script

This script seeds the MongoDB database with categories and products from the CSV data.

## Prerequisites

1. Make sure you have a MongoDB instance running
2. Set up your `.env.local` file with the `MONGODB_URI` variable

```env
MONGODB_URI=mongodb://localhost:27017/athenas
# or for MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/athenas
```

## Running the Seed Script

```bash
npm run seed
```

## What it does

1. **Connects to MongoDB** using the connection string from `.env.local`
2. **Clears existing data** from Products and Categories collections
3. **Creates categories** for both English and Arabic locales:

   - French Fries / بطاطس مقلية
   - Vegetables / خضروات
   - Fruits / فواكه
   - Fresh Products / منتجات طازجة

4. **Creates products** for both English and Arabic locales (25 products × 2 locales = 50 total):
   - All products from the CSV with proper translations
   - First 8 products marked as "featured"
   - First 4 products marked as "new"
   - Google Drive image URLs converted to direct links

## Data Structure

### Categories

- `slug`: URL-friendly identifier (e.g., "vegetables")
- `locale`: "en" or "ar"
- `name`: Localized category name
- `icon`: Emoji icon for the category
- `order`: Display order

### Products

- `slug`: URL-friendly identifier (e.g., "pommes-frites")
- `locale`: "en" or "ar"
- `name`: Localized product name
- `description`: Localized product description
- `category`: Reference to category slug
- `weight`: Product weight from CSV
- `minOrder`: Minimum order quantity
- `grade`: Product grade from CSV
- `image`: Direct Google Drive image URL
- `gallery`: Array of images
- `featured`: Boolean flag
- `new`: Boolean flag
- `active`: Boolean flag

## Troubleshooting

If you encounter errors:

1. **Connection Error**: Check your `MONGODB_URI` in `.env.local`
2. **Permission Error**: Ensure your MongoDB user has write permissions
3. **Duplicate Key Error**: The script clears data first, but if it fails midway, manually clear the collections

## Notes

- The script uses `npx tsx` to run TypeScript directly
- All products have both English and Arabic versions
- Image URLs are automatically converted from Google Drive share links to direct view links
