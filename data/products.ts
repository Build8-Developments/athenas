export interface Product {
  id: string;
  slug: string;
  nameKey: string;
  descriptionKey: string;
  category: string;
  image: string;
  gallery?: string[];
  price: number; // Price per kg in USD
  priceUnit: "kg" | "ton"; // Unit for pricing display
  minOrder?: string; // Minimum order quantity
  specifications?: {
    packagingKey: string;
    shelfLife: string;
    storage: string;
    origin: string;
  };
  certifications?: string[];
  featured?: boolean;
  new?: boolean;
}

export interface Category {
  id: string;
  nameKey: string;
  slug: string;
  icon: string;
  count?: number;
}

export const categories: Category[] = [
  { id: "vegetables", nameKey: "vegetables", slug: "vegetables", icon: "🥕" },
  { id: "fruits", nameKey: "fruits", slug: "fruits", icon: "🍓" },
  { id: "fries", nameKey: "fries", slug: "fries", icon: "🍟" },
  { id: "herbs", nameKey: "herbs", slug: "herbs", icon: "🌿" },
  { id: "mixes", nameKey: "mixes", slug: "mixes", icon: "🥗" },
];

export const products: Product[] = [
  // Vegetables
  {
    id: "green-peas",
    slug: "green-peas",
    nameKey: "greenPeas.name",
    descriptionKey: "greenPeas.description",
    category: "vegetables",
    image: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=600&h=600&fit=crop&crop=center",
    price: 1.85,
    priceUnit: "kg",
    minOrder: "500 kg",
    gallery: [
      "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&h=600&fit=crop&crop=center",
    ],
    specifications: {
      packagingKey: "packaging.bulk",
      shelfLife: "24 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP", "BRC"],
    featured: true,
  },
  {
    id: "green-beans",
    slug: "green-beans",
    nameKey: "greenBeans.name",
    descriptionKey: "greenBeans.description",
    category: "vegetables",
    image: "https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=600&h=600&fit=crop&crop=center",
    price: 1.95,
    priceUnit: "kg",
    minOrder: "500 kg",
    specifications: {
      packagingKey: "packaging.bulk",
      shelfLife: "24 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP"],
    featured: true,
  },
  {
    id: "okra",
    slug: "okra",
    nameKey: "okra.name",
    descriptionKey: "okra.description",
    category: "vegetables",
    image: "https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=600&h=600&fit=crop&crop=center",
    price: 2.45,
    priceUnit: "kg",
    minOrder: "500 kg",
    specifications: {
      packagingKey: "packaging.bulk",
      shelfLife: "24 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP", "BRC"],
  },
  {
    id: "spinach",
    slug: "spinach",
    nameKey: "spinach.name",
    descriptionKey: "spinach.description",
    category: "vegetables",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=600&fit=crop&crop=center",
    price: 1.65,
    priceUnit: "kg",
    minOrder: "500 kg",
    specifications: {
      packagingKey: "packaging.bulk",
      shelfLife: "18 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP"],
    new: true,
  },
  {
    id: "corn-kernels",
    slug: "corn-kernels",
    nameKey: "cornKernels.name",
    descriptionKey: "cornKernels.description",
    category: "vegetables",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&h=600&fit=crop&crop=center",
    price: 1.75,
    priceUnit: "kg",
    minOrder: "500 kg",
    specifications: {
      packagingKey: "packaging.bulk",
      shelfLife: "24 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP", "BRC"],
  },
  {
    id: "broccoli",
    slug: "broccoli",
    nameKey: "broccoli.name",
    descriptionKey: "broccoli.description",
    category: "vegetables",
    image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600&h=600&fit=crop&crop=center",
    price: 2.25,
    priceUnit: "kg",
    minOrder: "500 kg",
    specifications: {
      packagingKey: "packaging.bulk",
      shelfLife: "24 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP"],
  },
  {
    id: "cauliflower",
    slug: "cauliflower",
    nameKey: "cauliflower.name",
    descriptionKey: "cauliflower.description",
    category: "vegetables",
    image: "https://images.unsplash.com/photo-1568584711271-946d4d46b834?w=600&h=600&fit=crop&crop=center",
    price: 2.15,
    priceUnit: "kg",
    minOrder: "500 kg",
    specifications: {
      packagingKey: "packaging.bulk",
      shelfLife: "24 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP"],
  },
  {
    id: "carrots",
    slug: "carrots",
    nameKey: "carrots.name",
    descriptionKey: "carrots.description",
    category: "vegetables",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&h=600&fit=crop&crop=center",
    price: 1.45,
    priceUnit: "kg",
    minOrder: "500 kg",
    specifications: {
      packagingKey: "packaging.bulk",
      shelfLife: "24 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP", "BRC"],
  },
  // Fruits
  {
    id: "strawberries",
    slug: "strawberries",
    nameKey: "strawberries.name",
    descriptionKey: "strawberries.description",
    category: "fruits",
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&h=600&fit=crop&crop=center",
    price: 2.85,
    priceUnit: "kg",
    minOrder: "500 kg",
    specifications: {
      packagingKey: "packaging.bulk",
      shelfLife: "24 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP", "BRC"],
    featured: true,
  },
  {
    id: "mango-chunks",
    slug: "mango-chunks",
    nameKey: "mangoChunks.name",
    descriptionKey: "mangoChunks.description",
    category: "fruits",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&h=600&fit=crop&crop=center",
    price: 3.25,
    priceUnit: "kg",
    minOrder: "500 kg",
    specifications: {
      packagingKey: "packaging.bulk",
      shelfLife: "24 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP", "BRC"],
    featured: true,
  },
  {
    id: "pomegranate-seeds",
    slug: "pomegranate-seeds",
    nameKey: "pomegranateSeeds.name",
    descriptionKey: "pomegranateSeeds.description",
    category: "fruits",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&h=600&fit=crop&crop=center",
    price: 4.5,
    priceUnit: "kg",
    minOrder: "250 kg",
    specifications: {
      packagingKey: "packaging.bulk",
      shelfLife: "24 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP"],
    new: true,
  },
  {
    id: "guava",
    slug: "guava",
    nameKey: "guava.name",
    descriptionKey: "guava.description",
    category: "fruits",
    image: "https://images.unsplash.com/photo-1536511132770-e5058c4e1d63?w=600&h=600&fit=crop&crop=center",
    price: 2.65,
    priceUnit: "kg",
    minOrder: "500 kg",
    specifications: {
      packagingKey: "packaging.bulk",
      shelfLife: "24 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP"],
  },
  // Fries
  {
    id: "french-fries",
    slug: "french-fries",
    nameKey: "frenchFries.name",
    descriptionKey: "frenchFries.description",
    category: "fries",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=600&fit=crop&crop=center",
    price: 1.35,
    priceUnit: "kg",
    minOrder: "1000 kg",
    specifications: {
      packagingKey: "packaging.retail",
      shelfLife: "18 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP", "BRC"],
    featured: true,
  },
  {
    id: "crinkle-cut-fries",
    slug: "crinkle-cut-fries",
    nameKey: "crinkleCutFries.name",
    descriptionKey: "crinkleCutFries.description",
    category: "fries",
    image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&h=600&fit=crop&crop=center",
    price: 1.45,
    priceUnit: "kg",
    minOrder: "1000 kg",
    specifications: {
      packagingKey: "packaging.retail",
      shelfLife: "18 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP"],
  },
  {
    id: "wedges",
    slug: "potato-wedges",
    nameKey: "potatoWedges.name",
    descriptionKey: "potatoWedges.description",
    category: "fries",
    image: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=600&h=600&fit=crop&crop=center",
    price: 1.55,
    priceUnit: "kg",
    minOrder: "1000 kg",
    specifications: {
      packagingKey: "packaging.retail",
      shelfLife: "18 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP"],
    new: true,
  },
  // Herbs
  {
    id: "molokhia",
    slug: "molokhia",
    nameKey: "molokhia.name",
    descriptionKey: "molokhia.description",
    category: "herbs",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=600&fit=crop&crop=center",
    price: 2.35,
    priceUnit: "kg",
    minOrder: "250 kg",
    specifications: {
      packagingKey: "packaging.bulk",
      shelfLife: "18 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP"],
    featured: true,
  },
  {
    id: "parsley",
    slug: "parsley",
    nameKey: "parsley.name",
    descriptionKey: "parsley.description",
    category: "herbs",
    image: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=600&h=600&fit=crop&crop=center",
    price: 2.95,
    priceUnit: "kg",
    minOrder: "250 kg",
    specifications: {
      packagingKey: "packaging.bulk",
      shelfLife: "18 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP"],
  },
  {
    id: "dill",
    slug: "dill",
    nameKey: "dill.name",
    descriptionKey: "dill.description",
    category: "herbs",
    image: "https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=600&h=600&fit=crop&crop=center",
    price: 3.15,
    priceUnit: "kg",
    minOrder: "250 kg",
    specifications: {
      packagingKey: "packaging.bulk",
      shelfLife: "18 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP"],
  },
  // Mixes
  {
    id: "mixed-vegetables",
    slug: "mixed-vegetables",
    nameKey: "mixedVegetables.name",
    descriptionKey: "mixedVegetables.description",
    category: "mixes",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=600&fit=crop&crop=center",
    price: 1.75,
    priceUnit: "kg",
    minOrder: "500 kg",
    specifications: {
      packagingKey: "packaging.bulk",
      shelfLife: "24 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP", "BRC"],
    featured: true,
  },
  {
    id: "stir-fry-mix",
    slug: "stir-fry-mix",
    nameKey: "stirFryMix.name",
    descriptionKey: "stirFryMix.description",
    category: "mixes",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=600&fit=crop&crop=center",
    price: 2.15,
    priceUnit: "kg",
    minOrder: "500 kg",
    specifications: {
      packagingKey: "packaging.retail",
      shelfLife: "24 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP"],
  },
  {
    id: "soup-mix",
    slug: "soup-mix",
    nameKey: "soupMix.name",
    descriptionKey: "soupMix.description",
    category: "mixes",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=600&fit=crop&crop=center",
    price: 1.95,
    priceUnit: "kg",
    minOrder: "500 kg",
    specifications: {
      packagingKey: "packaging.retail",
      shelfLife: "24 months",
      storage: "-18°C",
      origin: "Egypt",
    },
    certifications: ["ISO 22000", "HACCP"],
    new: true,
  },
];

// Helper functions
export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getNewProducts(): Product[] {
  return products.filter((p) => p.new);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoriesWithCount(): Category[] {
  return categories.map((cat) => ({
    ...cat,
    count: products.filter((p) => p.category === cat.id).length,
  }));
}
