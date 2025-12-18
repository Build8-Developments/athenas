"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  X,
  ImageIcon,
  Info,
} from "lucide-react";

interface Category {
  _id: string;
  slug: string;
  name: string;
}

interface ProductData {
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  category: string;
  image: string;
  gallery: string[];
  price: number;
  priceUnit: string;
  minOrder: string;
  specifications: Record<string, string>;
  certifications: string[];
  featured: boolean;
  new: boolean;
}

interface ProductFormProps {
  initialData?: {
    en: {
      slug: string;
      name: string;
      description: string;
      category: string;
      image: string;
      gallery: string[];
      price: number;
      priceUnit: string;
      minOrder: string;
      specifications: Record<string, string>;
      certifications: string[];
      featured: boolean;
      new: boolean;
    };
    ar: {
      name: string;
      description: string;
      specifications: Record<string, string>;
    };
  };
  isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"general" | "media" | "pricing">(
    "general"
  );

  // Form state
  const [formData, setFormData] = useState<ProductData>({
    slug: "",
    name_en: "",
    name_ar: "",
    description_en: "",
    description_ar: "",
    category: "",
    image: "",
    gallery: [],
    price: 0,
    priceUnit: "kg",
    minOrder: "",
    specifications: {},
    certifications: [],
    featured: false,
    new: false,
  });

  // Specs and certs input state
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [newCert, setNewCert] = useState("");
  const [newGalleryImage, setNewGalleryImage] = useState("");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/categories?locale=en");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Populate form with initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        slug: initialData.en.slug,
        name_en: initialData.en.name,
        name_ar: initialData.ar.name,
        description_en: initialData.en.description,
        description_ar: initialData.ar.description,
        category: initialData.en.category,
        image: initialData.en.image,
        gallery: initialData.en.gallery || [],
        price: initialData.en.price,
        priceUnit: initialData.en.priceUnit,
        minOrder: initialData.en.minOrder,
        specifications: initialData.en.specifications || {},
        certifications: initialData.en.certifications || [],
        featured: initialData.en.featured,
        new: initialData.en.new,
      });
    }
  }, [initialData]);

  // Generate slug from English name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = {
        slug: formData.slug || generateSlug(formData.name_en),
        name_en: formData.name_en,
        name_ar: formData.name_ar,
        description_en: formData.description_en,
        description_ar: formData.description_ar,
        category: formData.category,
        image: formData.image,
        gallery: formData.gallery,
        price: formData.price,
        priceUnit: formData.priceUnit,
        minOrder: formData.minOrder,
        specifications: formData.specifications,
        certifications: formData.certifications,
        featured: formData.featured,
        new: formData.new,
      };

      const url = isEdit
        ? `/api/products/${initialData?.en.slug}`
        : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save product");
      }

      router.push("/dashboard/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // Add specification
  const addSpec = () => {
    if (newSpecKey && newSpecValue) {
      setFormData((prev) => ({
        ...prev,
        specifications: { ...prev.specifications, [newSpecKey]: newSpecValue },
      }));
      setNewSpecKey("");
      setNewSpecValue("");
    }
  };

  // Remove specification
  const removeSpec = (key: string) => {
    setFormData((prev) => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
    });
  };

  // Add certification
  const addCert = () => {
    if (newCert) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCert],
      }));
      setNewCert("");
    }
  };

  // Remove certification
  const removeCert = (cert: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c !== cert),
    }));
  };

  // Add gallery image
  const addGalleryImage = () => {
    if (newGalleryImage) {
      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, newGalleryImage],
      }));
      setNewGalleryImage("");
    }
  };

  // Remove gallery image
  const removeGalleryImage = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((g) => g !== url),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/products"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-gray-500 mt-1">
              {isEdit
                ? "Update product details in English and Arabic"
                : "Create a new bilingual product"}
            </p>
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Product
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {["general", "media", "pricing"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* English Details */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                EN
              </span>
              <h2 className="font-semibold text-gray-900">English Details</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name_en}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      name_en: e.target.value,
                      slug: prev.slug || generateSlug(e.target.value),
                    }));
                  }}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Premium Frozen Shrimp"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="premium-frozen-shrimp"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-generated from name if left empty
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (English) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description_en}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description_en: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  placeholder="Describe the product in English..."
                />
              </div>
            </div>
          </div>

          {/* Arabic Details */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                AR
              </span>
              <h2 className="font-semibold text-gray-900">Arabic Details</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name (Arabic) *
                </label>
                <input
                  type="text"
                  required
                  dir="rtl"
                  value={formData.name_ar}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name_ar: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="جمبري مجمد ممتاز"
                />
              </div>

              <div className="opacity-0 pointer-events-none">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Placeholder
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">Placeholder</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Arabic) *
                </label>
                <textarea
                  required
                  rows={4}
                  dir="rtl"
                  value={formData.description_ar}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description_ar: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  placeholder="اكتب وصف المنتج بالعربية..."
                />
              </div>
            </div>
          </div>

          {/* Category & Status */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">
              Category & Status
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        featured: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.new}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        new: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">New Product</span>
                </label>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Specifications</h2>
            <div className="space-y-3">
              {Object.entries(formData.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-700">{key}:</span>
                  <span className="text-gray-600 flex-1">{value}</span>
                  <button
                    type="button"
                    onClick={() => removeSpec(key)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  placeholder="Key (e.g., Weight)"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <input
                  type="text"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  placeholder="Value (e.g., 1kg)"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={addSpec}
                  className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:col-span-2">
            <h2 className="font-semibold text-gray-900 mb-4">Certifications</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.certifications.map((cert) => (
                <span
                  key={cert}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent/50 text-primary text-sm rounded-full"
                >
                  {cert}
                  <button
                    type="button"
                    onClick={() => removeCert(cert)}
                    className="hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCert}
                onChange={(e) => setNewCert(e.target.value)}
                placeholder="Add certification (e.g., ISO 22000)"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                type="button"
                onClick={addCert}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Tab */}
      {activeTab === "media" && (
        <div className="space-y-6">
          {/* Main Image */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Main Image</h2>
            <div className="flex gap-6">
              <div className="w-40 h-40 bg-gray-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, image: e.target.value }))
                  }
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                  <Info className="w-4 h-4" />
                  Enter the URL of the main product image
                </p>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Gallery Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {formData.gallery.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={url}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(url)}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                value={newGalleryImage}
                onChange={(e) => setNewGalleryImage(e.target.value)}
                placeholder="https://example.com/gallery-image.jpg"
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                type="button"
                onClick={addGalleryImage}
                className="px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Add Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Tab */}
      {activeTab === "pricing" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            Pricing & Order Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (USD) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Unit *
              </label>
              <select
                required
                value={formData.priceUnit}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    priceUnit: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
              >
                <option value="kg">per kg</option>
                <option value="ton">per ton</option>
                <option value="piece">per piece</option>
                <option value="box">per box</option>
                <option value="carton">per carton</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Order
              </label>
              <input
                type="text"
                value={formData.minOrder}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    minOrder: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="e.g., 500 kg"
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
