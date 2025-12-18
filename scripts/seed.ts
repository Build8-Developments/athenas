import dotenv from "dotenv";
import path from "path";

// Load .env.local file
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import dbConnect from "../lib/db";
import { Product, Category } from "../models";

const categories = [
  {
    slug: "vegetables",
    icon: "🥬",
    order: 1,
    name_en: "Vegetables",
    name_ar: "خضروات",
  },
  {
    slug: "fruits",
    icon: "🍓",
    order: 2,
    name_en: "Fruits",
    name_ar: "فواكه",
  },
  {
    slug: "fries",
    icon: "🍟",
    order: 3,
    name_en: "Fries",
    name_ar: "بطاطس مقلية",
  },
  {
    slug: "herbs",
    icon: "🌿",
    order: 4,
    name_en: "Herbs",
    name_ar: "أعشاب",
  },
  {
    slug: "mixes",
    icon: "🥗",
    order: 5,
    name_en: "Mixes",
    name_ar: "خلطات",
  },
];

const products = [
  {
    slug: "green-peas",
    category: "vegetables",
    image: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=800",
      "https://images.unsplash.com/photo-1563746098251-d35aef196e83?w=800",
    ],
    price: 2.5,
    priceUnit: "kg" as const,
    minOrder: "500 kg",
    specifications: {
      packaging: "Bulk (10-25 kg)",
      shelfLife: "24 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP", "Halal"],
    featured: true,
    new: false,
    name_en: "Green Peas",
    name_ar: "بازلاء خضراء",
    description_en:
      "Premium quality frozen green peas, carefully selected and processed to maintain freshness and nutritional value.",
    description_ar:
      "بازلاء خضراء مجمدة عالية الجودة، يتم اختيارها ومعالجتها بعناية للحفاظ على الطازجة والقيمة الغذائية.",
  },
  {
    slug: "sweet-corn",
    category: "vegetables",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800",
    gallery: [],
    price: 2.8,
    priceUnit: "kg" as const,
    minOrder: "500 kg",
    specifications: {
      packaging: "Bulk (10-25 kg)",
      shelfLife: "24 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP"],
    featured: true,
    new: true,
    name_en: "Sweet Corn",
    name_ar: "ذرة حلوة",
    description_en:
      "Golden sweet corn kernels, frozen at peak freshness for maximum flavor.",
    description_ar:
      "حبات ذرة حلوة ذهبية، مجمدة في ذروة نضارتها للحصول على أقصى نكهة.",
  },
  {
    slug: "mixed-vegetables",
    category: "mixes",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800",
    gallery: [],
    price: 3.2,
    priceUnit: "kg" as const,
    minOrder: "500 kg",
    specifications: {
      packaging: "Bulk (10-25 kg)",
      shelfLife: "24 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP", "Halal"],
    featured: true,
    new: false,
    name_en: "Mixed Vegetables",
    name_ar: "خضروات مشكلة",
    description_en:
      "A colorful blend of premium frozen vegetables including carrots, peas, corn, and green beans.",
    description_ar:
      "مزيج ملون من الخضروات المجمدة الفاخرة بما في ذلك الجزر والبازلاء والذرة والفاصوليا الخضراء.",
  },
  {
    slug: "strawberries",
    category: "fruits",
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800",
    gallery: [],
    price: 4.5,
    priceUnit: "kg" as const,
    minOrder: "300 kg",
    specifications: {
      packaging: "Retail (500g - 2.5 kg)",
      shelfLife: "18 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP", "Organic"],
    featured: true,
    new: true,
    name_en: "Strawberries",
    name_ar: "فراولة",
    description_en:
      "Sweet and juicy frozen strawberries, perfect for smoothies, desserts, and baking.",
    description_ar:
      "فراولة مجمدة حلوة وعصيرية، مثالية للعصائر والحلويات والخبز.",
  },
  {
    slug: "french-fries",
    category: "fries",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800",
    gallery: [],
    price: 2.0,
    priceUnit: "kg" as const,
    minOrder: "1000 kg",
    specifications: {
      packaging: "Bulk (10-25 kg)",
      shelfLife: "24 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP"],
    featured: false,
    new: false,
    name_en: "French Fries",
    name_ar: "بطاطس مقلية",
    description_en:
      "Classic cut frozen french fries, pre-fried and ready for quick preparation.",
    description_ar:
      "بطاطس مقلية مجمدة بالقطع الكلاسيكي، مقلية مسبقاً وجاهزة للتحضير السريع.",
  },
  {
    slug: "broccoli",
    category: "vegetables",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800",
    gallery: [],
    price: 3.0,
    priceUnit: "kg" as const,
    minOrder: "500 kg",
    specifications: {
      packaging: "Bulk (10-25 kg)",
      shelfLife: "24 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP", "Halal"],
    featured: false,
    new: true,
    name_en: "Broccoli",
    name_ar: "بروكلي",
    description_en:
      "Fresh frozen broccoli florets, blanched and frozen to preserve nutrients.",
    description_ar:
      "زهيرات بروكلي مجمدة طازجة، مسلوقة ومجمدة للحفاظ على العناصر الغذائية.",
  },
  {
    slug: "spinach",
    category: "herbs",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800",
    gallery: [],
    price: 2.2,
    priceUnit: "kg" as const,
    minOrder: "500 kg",
    specifications: {
      packaging: "Bulk (10-25 kg)",
      shelfLife: "24 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP"],
    featured: false,
    new: false,
    name_en: "Spinach",
    name_ar: "سبانخ",
    description_en:
      "Nutrient-rich frozen spinach leaves, perfect for cooking and smoothies.",
    description_ar:
      "أوراق سبانخ مجمدة غنية بالعناصر الغذائية، مثالية للطبخ والعصائر.",
  },
  {
    slug: "mango-chunks",
    category: "fruits",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800",
    gallery: [],
    price: 5.0,
    priceUnit: "kg" as const,
    minOrder: "300 kg",
    specifications: {
      packaging: "Retail (500g - 2.5 kg)",
      shelfLife: "18 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP", "Halal"],
    featured: true,
    new: false,
    name_en: "Mango Chunks",
    name_ar: "قطع المانجو",
    description_en:
      "Ripe Egyptian mango chunks, frozen at peak sweetness for tropical flavor.",
    description_ar:
      "قطع مانجو مصرية ناضجة، مجمدة في ذروة حلاوتها للحصول على نكهة استوائية.",
  },
];

async function seed() {
  try {
    await dbConnect();
    console.log("Connected to MongoDB");

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log("Cleared existing data");

    // Seed categories
    for (const cat of categories) {
      // Create English version
      await Category.create({
        slug: cat.slug,
        locale: "en",
        name: cat.name_en,
        icon: cat.icon,
        order: cat.order,
      });

      // Create Arabic version
      await Category.create({
        slug: cat.slug,
        locale: "ar",
        name: cat.name_ar,
        icon: cat.icon,
        order: cat.order,
      });
    }
    console.log(
      `Seeded ${categories.length} categories (${
        categories.length * 2
      } documents)`
    );

    // Seed products
    for (const prod of products) {
      const baseProduct = {
        slug: prod.slug,
        category: prod.category,
        image: prod.image,
        gallery: prod.gallery,
        price: prod.price,
        priceUnit: prod.priceUnit,
        minOrder: prod.minOrder,
        specifications: prod.specifications,
        certifications: prod.certifications,
        featured: prod.featured,
        new: prod.new,
        active: true,
      };

      // Create English version
      await Product.create({
        ...baseProduct,
        locale: "en",
        name: prod.name_en,
        description: prod.description_en,
      });

      // Create Arabic version
      await Product.create({
        ...baseProduct,
        locale: "ar",
        name: prod.name_ar,
        description: prod.description_ar,
      });
    }
    console.log(
      `Seeded ${products.length} products (${products.length * 2} documents)`
    );

    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
