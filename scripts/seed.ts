import dotenv from "dotenv";
import dbConnect from "../lib/db";
import Product from "../models/Product";
import Category from "../models/Category";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// Helper function to create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Helper function to extract Google Drive direct image URL with multiple fallbacks
function getDirectImageUrl(driveUrl: string): string {
  const fileIdMatch = driveUrl.match(/\/d\/([^/]+)/);
  if (fileIdMatch) {
    const fileId = fileIdMatch[1];
    // Primary: Use thumbnail API (most reliable)
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;

    // Alternative formats you can try if thumbnail doesn't work:
    // return `https://drive.google.com/uc?export=download&id=${fileId}`;
    // return `https://lh3.googleusercontent.com/d/${fileId}`;
    // return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return driveUrl;
}

// Category mapping from CSV to standardized categories
const categoryMapping: Record<
  string,
  { en: string; ar: string; icon: string }
> = {
  "french fries": {
    en: "French Fries",
    ar: "بطاطس مقلية",
    icon: "🍟",
  },
  veggie: {
    en: "Vegetables",
    ar: "خضروات",
    icon: "🥦",
  },
  fruit: {
    en: "Fruits",
    ar: "فواكه",
    icon: "🍓",
  },
  fresh: {
    en: "Fresh Products",
    ar: "منتجات طازجة",
    icon: "🌿",
  },
};

// Product data from CSV with Arabic translations
const productsData = [
  {
    name: { en: "Pommes Frites", ar: "بطاطس مقلية" },
    description: {
      en: "Premium Egyptian frozen potato fries made from carefully selected high-quality potatoes. Produced using advanced IQF freezing technology to ensure crispy texture, natural flavor, and consistent size. Ideal for restaurants, hotels, catering services, and fast-food chains. Easy to prepare and delivers excellent taste and golden color after frying.",
      ar: "بطاطس مقلية مصرية مجمدة فاخرة مصنوعة من بطاطس عالية الجودة مختارة بعناية. يتم إنتاجها باستخدام تقنية التجميد السريع IQF لضمان قوام مقرمش ونكهة طبيعية وحجم متسق. مثالية للمطاعم والفنادق وخدمات تقديم الطعام وسلاسل الوجبات السريعة.",
    },
    weight: "2.5 kg",
    minOrder: "",
    category: "french fries",
    grade: "",
    image:
      "https://drive.google.com/file/d/1sh3VuLhKwLS37QWXZ3m9BPILDuxWO94P/view?usp=sharing",
  },
  {
    name: { en: "Okra Extra", ar: "بامية إكسترا" },
    description: {
      en: "High-quality Egyptian frozen okra, carefully selected and cleaned, then individually quick frozen (IQF) to maintain natural flavor, color, and texture. Suitable for home cooking, restaurants, and export markets.",
      ar: "بامية مصرية مجمدة عالية الجودة، مختارة ومنظفة بعناية، ثم مجمدة بسرعة بشكل فردي للحفاظ على النكهة واللون والملمس الطبيعي. مناسبة للطبخ المنزلي والمطاعم وأسواق التصدير.",
    },
    weight: "",
    minOrder: "",
    category: "veggie",
    grade: "",
    image:
      "https://drive.google.com/file/d/1MCMM94cyojuB-TR1lhI9upE7vaiKuYGk/view?usp=sharing",
  },
  {
    name: { en: "Broccoli", ar: "بروكلي" },
    description: {
      en: "High-quality Egyptian frozen broccoli florets, harvested at peak freshness and immediately frozen using IQF technology to lock in nutrients, color, and flavor. Cleaned, cut, and ready to cook.",
      ar: "زهور بروكلي مصرية مجمدة عالية الجودة، يتم حصادها في ذروة نضارتها وتجميدها فورًا باستخدام تقنية IQF لحفظ العناصر الغذائية واللون والنكهة.",
    },
    weight: "",
    minOrder: "",
    category: "veggie",
    grade: "",
    image:
      "https://drive.google.com/file/d/1H95I0mg4MG-5HOQi0QaqNYAgSfP8Npzj/view?usp=sharing",
  },
  {
    name: { en: "Green Peas", ar: "بازلاء خضراء" },
    description: {
      en: "Egyptian frozen green peas, carefully selected and IQF frozen to preserve sweetness, freshness, and vibrant green color. Perfect for cooking, food service, and export.",
      ar: "بازلاء خضراء مصرية مجمدة، مختارة بعناية ومجمدة بتقنية IQF للحفاظ على الحلاوة والنضارة واللون الأخضر النابض بالحياة.",
    },
    weight: "",
    minOrder: "",
    category: "veggie",
    grade: "",
    image:
      "https://drive.google.com/file/d/1R_6wCALfcHl3pbDoQW8NExqbT5vxHK91/view?usp=sharing",
  },
  {
    name: { en: "Peas & Carrots", ar: "بازلاء وجزر" },
    description: {
      en: "High-quality Egyptian frozen peas and carrots, evenly cut and mixed, then IQF frozen to maintain taste, texture, and nutritional value. Convenient and ready to cook.",
      ar: "بازلاء وجزر مصرية مجمدة عالية الجودة، مقطعة ومخلوطة بالتساوي، ثم مجمدة بتقنية IQF للحفاظ على الطعم والملمس والقيمة الغذائية.",
    },
    weight: "",
    minOrder: "",
    category: "veggie",
    grade: "",
    image:
      "https://drive.google.com/file/d/1bgaRpBItZVpPlBY93e-CSj79YeSU0sa4/view?usp=sharing",
  },
  {
    name: { en: "Sweet Corn", ar: "ذرة حلوة" },
    description: {
      en: "Premium Egyptian frozen sweet corn kernels, processed and IQF frozen to lock in natural sweetness, color, and freshness. Suitable for salads, cooking, and food processing.",
      ar: "حبوب ذرة حلوة مصرية مجمدة فاخرة، معالجة ومجمدة بتقنية IQF لحفظ الحلاوة الطبيعية واللون والنضارة.",
    },
    weight: "",
    minOrder: "",
    category: "veggie",
    grade: "",
    image:
      "https://drive.google.com/file/d/1LuWI3vfxDDCmt9dYoYYSBKm8lW1c_W0Q/view?usp=sharing",
  },
  {
    name: { en: "Green Spinach", ar: "سبانخ خضراء" },
    description: {
      en: "Egyptian frozen spinach, carefully cleaned, chopped, and frozen using IQF technology to preserve natural taste, green color, and nutrients. Ready to cook and easy to use.",
      ar: "سبانخ مصرية مجمدة، منظفة ومفرومة بعناية ومجمدة باستخدام تقنية IQF للحفاظ على الطعم الطبيعي واللون الأخضر والعناصر الغذائية.",
    },
    weight: "",
    minOrder: "",
    category: "veggie",
    grade: "",
    image:
      "https://drive.google.com/file/d/1Nut14qgdWqo93Qje1kWIG575D9nRam-Z/view?usp=sharing",
  },
  {
    name: { en: "Strawberry", ar: "فراولة" },
    description: {
      en: "Premium Egyptian frozen whole strawberries, carefully selected and individually quick frozen (IQF) to preserve natural sweetness, texture, and aroma. Perfect for desserts, smoothies, bakeries, and food processing applications.",
      ar: "فراولة مصرية مجمدة كاملة فاخرة، مختارة بعناية ومجمدة بسرعة بشكل فردي للحفاظ على الحلاوة الطبيعية والملمس والرائحة.",
    },
    weight: "",
    minOrder: "",
    category: "fruit",
    grade: "",
    image:
      "https://drive.google.com/file/d/1sXJRt2sN3FRh9UyrWAGWPFfaos9ALmvc/view?usp=sharing",
  },
  {
    name: { en: "Taro", ar: "قلقاس" },
    description: {
      en: "High-quality Egyptian frozen taro cubes, peeled, cut, and IQF frozen to preserve texture and natural flavor. Suitable for traditional dishes and professional kitchens.",
      ar: "مكعبات قلقاس مصرية مجمدة عالية الجودة، مقشرة ومقطعة ومجمدة بتقنية IQF للحفاظ على الملمس والنكهة الطبيعية.",
    },
    weight: "",
    minOrder: "",
    category: "veggie",
    grade: "",
    image:
      "https://drive.google.com/file/d/1gznSQzmqbwrJdXjpM_hGh12z6_K8Q5pF/view?usp=sharing",
  },
  {
    name: { en: "Colored Pepper", ar: "فلفل ملون" },
    description: {
      en: "Egyptian frozen mixed colored peppers, cleaned, sliced, and IQF frozen to preserve vibrant colors, flavor, and freshness. Perfect for cooking and food service use.",
      ar: "فلفل ملون مصري مجمد مختلط، منظف ومقطع ومجمد بتقنية IQF للحفاظ على الألوان النابضة بالحياة والنكهة والنضارة.",
    },
    weight: "",
    minOrder: "",
    category: "veggie",
    grade: "",
    image:
      "https://drive.google.com/file/d/1EkXklVcJwFWLLLHSgfQSSTEB7R8Skg37/view?usp=sharing",
  },
  {
    name: { en: "Cherry", ar: "كرز" },
    description: {
      en: "Premium Egyptian frozen pitted cherries, IQF frozen to maintain natural taste, color, and texture. Ideal for desserts, pastries, and food processing.",
      ar: "كرز مصري مجمد منزوع النوى فاخر، مجمد بتقنية IQF للحفاظ على الطعم الطبيعي واللون والملمس.",
    },
    weight: "",
    minOrder: "",
    category: "fruit",
    grade: "",
    image:
      "https://drive.google.com/file/d/1LFj5UYQHUusjc4ds9mMOVp2ZNkzPA4Me/view?usp=sharing",
  },
  {
    name: { en: "Sliced Zucchini", ar: "كوسة مقطعة" },
    description: {
      en: "Egyptian frozen zucchini, evenly sliced and IQF frozen to retain freshness, texture, and natural flavor. Ready to cook and suitable for various dishes.",
      ar: "كوسة مصرية مجمدة، مقطعة بالتساوي ومجمدة بتقنية IQF للحفاظ على النضارة والملمس والنكهة الطبيعية.",
    },
    weight: "",
    minOrder: "",
    category: "veggie",
    grade: "",
    image:
      "https://drive.google.com/file/d/1314IKQSLrxuzKtxUfGSsjzPGit6IYL0T/view?usp=sharing",
  },
  {
    name: { en: "Mango", ar: "مانجو" },
    description: {
      en: "Premium Egyptian frozen mango chunks, carefully selected and IQF frozen to preserve natural sweetness, aroma, and color. Ideal for juices, smoothies, desserts, and food processing.",
      ar: "قطع مانجو مصرية مجمدة فاخرة، مختارة بعناية ومجمدة بتقنية IQF للحفاظ على الحلاوة الطبيعية والرائحة واللون.",
    },
    weight: "",
    minOrder: "",
    category: "fruit",
    grade: "",
    image:
      "https://drive.google.com/file/d/1Q0ke767_AtvaiCk8uhpkj1RnN-F_5qGr/view?usp=sharing",
  },
  {
    name: { en: "Apricot", ar: "مشمش" },
    description: {
      en: "High-quality Egyptian frozen apricot halves, IQF frozen to maintain natural taste, texture, and nutritional value. Suitable for desserts and bakery applications.",
      ar: "أنصاف مشمش مصرية مجمدة عالية الجودة، مجمدة بتقنية IQF للحفاظ على الطعم الطبيعي والملمس والقيمة الغذائية.",
    },
    weight: "",
    minOrder: "",
    category: "fruit",
    grade: "",
    image:
      "https://drive.google.com/file/d/1UY_srTHvIyQRpGh-kYsmZjYizG_lnMzD/view?usp=sharing",
  },
  {
    name: { en: "Molokhia Paper", ar: "ملوخية ورق" },
    description: {
      en: "Authentic Egyptian molokhia leaves, freshly harvested, carefully packed, and frozen to preserve traditional taste, aroma, and green color. Ready to cook and export-quality.",
      ar: "أوراق ملوخية مصرية أصلية، محصودة طازجة ومعبأة بعناية ومجمدة للحفاظ على الطعم التقليدي والرائحة واللون الأخضر.",
    },
    weight: "",
    minOrder: "",
    category: "fresh",
    grade: "",
    image:
      "https://drive.google.com/file/d/1-MWyS1x1rI7Rcqb93sKuvRDeLIs_GWS1/view?usp=sharing",
  },
  {
    name: { en: "Molokhia Frozen", ar: "ملوخية مجمدة" },
    description: {
      en: "Premium Egyptian frozen molokhia, finely cut and IQF frozen to maintain authentic flavor, aroma, and vibrant green color. Ideal for households, restaurants, and export markets.",
      ar: "ملوخية مصرية مجمدة فاخرة، مقطعة بدقة ومجمدة بتقنية IQF للحفاظ على النكهة الأصلية والرائحة واللون الأخضر النابض بالحياة.",
    },
    weight: "",
    minOrder: "",
    category: "veggie",
    grade: "",
    image:
      "https://drive.google.com/file/d/1UU14L6HDPtkooMyXX6sh9ymwxTzkvVvw/view?usp=sharing",
  },
  {
    name: { en: "Grape Leaves", ar: "ورق عنب" },
    description: {
      en: "Carefully selected Egyptian grape leaves, cleaned and frozen to preserve softness and natural flavor. Ideal for stuffing dishes and traditional cuisines.",
      ar: "أوراق عنب مصرية مختارة بعناية، منظفة ومجمدة للحفاظ على النعومة والنكهة الطبيعية. مثالية لأطباق المحشي والمأكولات التقليدية.",
    },
    weight: "",
    minOrder: "",
    category: "veggie",
    grade: "",
    image:
      "https://drive.google.com/file/d/15aKR7nyxrnoCxwB40p0oOzqePqYUbvAp/view?usp=sharing",
  },
  {
    name: { en: "Crispy Onions", ar: "بصل مقرمش" },
    description: {
      en: "High-quality Egyptian frozen onion slices, processed and frozen to maintain texture and flavor. Suitable for cooking, toppings, and food service use.",
      ar: "شرائح بصل مصرية مجمدة عالية الجودة، معالجة ومجمدة للحفاظ على الملمس والنكهة. مناسبة للطبخ والإضافات واستخدام خدمات الطعام.",
    },
    weight: "",
    minOrder: "",
    category: "veggie",
    grade: "",
    image:
      "https://drive.google.com/file/d/1oKYkIiNzcZ5W0gOi_8v1rxESjooWxzgG/view?usp=sharing",
  },
  {
    name: { en: "Sliced Carrots", ar: "جزر مقطع" },
    description: {
      en: "Egyptian frozen sliced carrots, evenly cut and IQF frozen to preserve natural sweetness, color, and nutrients. Ready to cook and easy to use.",
      ar: "جزر مصري مجمد مقطع، مقطع بالتساوي ومجمد بتقنية IQF للحفاظ على الحلاوة الطبيعية واللون والعناصر الغذائية.",
    },
    weight: "",
    minOrder: "",
    category: "veggie",
    grade: "",
    image:
      "https://drive.google.com/file/d/1Nooik8_PTH6EIUSiSe61g97vzRYzep9X/view?usp=sharing",
  },
  {
    name: { en: "Artichoke", ar: "خرشوف" },
    description: {
      en: "Premium Egyptian frozen artichoke bottoms, carefully cleaned and IQF frozen to maintain texture, taste, and quality. Ideal for professional kitchens and export.",
      ar: "قيعان خرشوف مصرية مجمدة فاخرة، منظفة بعناية ومجمدة بتقنية IQF للحفاظ على الملمس والطعم والجودة.",
    },
    weight: "",
    minOrder: "",
    category: "veggie",
    grade: "",
    image:
      "https://drive.google.com/file/d/1z7fv245j_6sImXrl4lk715URKWBbYttB/view?usp=sharing",
  },
  {
    name: { en: "Mixed Vegetables", ar: "خضار مشكلة" },
    description: {
      en: "High-quality Egyptian frozen mixed vegetables, carefully selected, cut, and IQF frozen to preserve freshness, color, and nutritional value. Convenient and ready to cook.",
      ar: "خضار مشكلة مصرية مجمدة عالية الجودة، مختارة بعناية ومقطعة ومجمدة بتقنية IQF للحفاظ على النضارة واللون والقيمة الغذائية.",
    },
    weight: "",
    minOrder: "",
    category: "veggie",
    grade: "",
    image:
      "https://drive.google.com/file/d/1RVzoDUlCx0EjAt7z6UV7djGAcYOgczo5/view?usp=sharing",
  },
  {
    name: { en: "Pomegranate", ar: "رمان" },
    description: {
      en: "Premium Egyptian frozen pomegranate seeds, IQF frozen to preserve natural sweetness, color, and freshness. Ideal for desserts, juices, and food processing.",
      ar: "حبوب رمان مصرية مجمدة فاخرة، مجمدة بتقنية IQF للحفاظ على الحلاوة الطبيعية واللون والنضارة.",
    },
    weight: "",
    minOrder: "",
    category: "fruit",
    grade: "",
    image:
      "https://drive.google.com/file/d/1sKH3KvnMgYixP7CLtBBDSaUA18OvGkx2/view?usp=sharing",
  },
  {
    name: { en: "Green Beans", ar: "فاصوليا خضراء" },
    description: {
      en: "Egyptian frozen green beans, carefully selected and IQF frozen to maintain crisp texture, freshness, and natural flavor. Suitable for cooking and export.",
      ar: "فاصوليا خضراء مصرية مجمدة، مختارة بعناية ومجمدة بتقنية IQF للحفاظ على الملمس المقرمش والنضارة والنكهة الطبيعية.",
    },
    weight: "",
    minOrder: "",
    category: "veggie",
    grade: "",
    image:
      "https://drive.google.com/file/d/1scwd6ybvMHD9PxTGsPd1kOScX2aTIv27/view?usp=sharing",
  },
  {
    name: { en: "Broad Beans", ar: "فول مدمس" },
    description: {
      en: "High-quality Egyptian frozen broad beans, processed and IQF frozen to preserve taste, color, and nutritional value. Ideal for traditional dishes and food service.",
      ar: "فول مدمس مصري مجمد عالي الجودة، معالج ومجمد بتقنية IQF للحفاظ على الطعم واللون والقيمة الغذائية.",
    },
    weight: "",
    minOrder: "",
    category: "veggie",
    grade: "",
    image:
      "https://drive.google.com/file/d/1o0QN5GcYOzcYLP7iLacxvJgnOh40bjM9/view?usp=sharing",
  },
  {
    name: { en: "Cauliflower", ar: "قرنبيط" },
    description: {
      en: "Premium Egyptian frozen cauliflower florets, harvested at peak freshness and IQF frozen to lock in nutrients, flavor, and color. Ready to cook and export-quality.",
      ar: "زهور قرنبيط مصرية مجمدة فاخرة، محصودة في ذروة نضارتها ومجمدة بتقنية IQF لحفظ العناصر الغذائية والنكهة واللون.",
    },
    weight: "",
    minOrder: "",
    category: "veggie",
    grade: "",
    image:
      "https://drive.google.com/file/d/1ZwWI1WhxIxWAVUXmCEpDgIHuYC6p8Xe5/view?usp=sharing",
  },
];

async function seedDatabase() {
  try {
    // Debug: Check if environment variable is loaded
    console.log("🔍 Checking environment variables...");
    console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
    console.log(
      "MONGODB_URI value:",
      process.env.MONGODB_URI ? "***hidden***" : "undefined"
    );

    console.log("🔌 Connecting to database...");
    await dbConnect();
    console.log("✅ Connected to database");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log("✅ Existing data cleared");

    // Create categories for both locales
    console.log("📁 Creating categories...");
    const categoryPromises: Promise<any>[] = [];

    Object.entries(categoryMapping).forEach(([key, value], index) => {
      const slug = createSlug(key);

      // English category
      categoryPromises.push(
        Category.create({
          slug,
          locale: "en",
          name: value.en,
          icon: value.icon,
          order: index,
        })
      );

      // Arabic category
      categoryPromises.push(
        Category.create({
          slug,
          locale: "ar",
          name: value.ar,
          icon: value.icon,
          order: index,
        })
      );
    });

    await Promise.all(categoryPromises);
    console.log(`✅ Created ${categoryPromises.length} categories`);

    // Create products for both locales
    console.log("📦 Creating products...");
    const productPromises: Promise<any>[] = [];

    productsData.forEach((product, index) => {
      const slug = createSlug(product.name.en);
      const categorySlug = createSlug(product.category);
      const imageUrl = getDirectImageUrl(product.image);

      // Log the image URL conversion for debugging
      console.log(`Product ${index + 1}: ${product.name.en}`);
      console.log(`  Original: ${product.image}`);
      console.log(`  Converted: ${imageUrl}`);

      // English product
      productPromises.push(
        Product.create({
          slug,
          locale: "en",
          name: product.name.en,
          description: product.description.en,
          category: categorySlug,
          weight: product.weight,
          minOrder: product.minOrder || "Contact for details",
          grade: product.grade,
          image: imageUrl,
          featured: index < 8, // First 8 products are featured
          new: index < 4, // First 4 products are new
          active: true,
        })
      );

      // Arabic product
      productPromises.push(
        Product.create({
          slug,
          locale: "ar",
          name: product.name.ar,
          description: product.description.ar,
          category: categorySlug,
          weight: product.weight,
          minOrder: product.minOrder || "اتصل للحصول على التفاصيل",
          grade: product.grade,
          image: imageUrl,
          featured: index < 8,
          new: index < 4,
          active: true,
        })
      );
    });

    await Promise.all(productPromises);
    console.log(`✅ Created ${productPromises.length} products`);

    console.log("\n🎉 Database seeded successfully!");
    console.log(`📊 Summary:`);
    console.log(
      `   - Categories: ${Object.keys(categoryMapping).length * 2} (en + ar)`
    );
    console.log(`   - Products: ${productsData.length * 2} (en + ar)`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
