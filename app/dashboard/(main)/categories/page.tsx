"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  X,
  Save,
  GripVertical,
  Folder,
} from "lucide-react";

interface Category {
  _id: string;
  slug: string;
  locale: string;
  name: string;
  icon: string;
  order: number;
}

interface CategoryFormData {
  slug: string;
  name_en: string;
  name_ar: string;
  icon: string;
  order: number;
}

const ICON_OPTIONS = [
  { value: "🐟", label: "Fish" },
  { value: "🦐", label: "Shrimp" },
  { value: "🍖", label: "Meat" },
  { value: "🍗", label: "Poultry" },
  { value: "🥬", label: "Vegetables" },
  { value: "🍕", label: "Prepared" },
  { value: "🧊", label: "Frozen" },
  { value: "🥡", label: "Ready Meals" },
];

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<CategoryFormData>({
    slug: "",
    name_en: "",
    name_ar: "",
    icon: "🐟",
    order: 0,
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories?locale=en");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Generate slug from English name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Open modal for new category
  const openNewModal = () => {
    setFormData({
      slug: "",
      name_en: "",
      name_ar: "",
      icon: "🐟",
      order: categories.length,
    });
    setEditingCategory(null);
    setError("");
    setShowModal(true);
  };

  // Open modal for editing
  const openEditModal = async (slug: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/categories/${slug}?both=true`);
      if (!res.ok) throw new Error("Category not found");
      const data = await res.json();

      setFormData({
        slug: data.en.slug,
        name_en: data.en.name,
        name_ar: data.ar.name,
        icon: data.en.icon,
        order: data.en.order,
      });
      setEditingCategory(slug);
      setError("");
      setShowModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load category");
    } finally {
      setLoading(false);
    }
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
        icon: formData.icon,
        order: formData.order,
      };

      const url = editingCategory
        ? `/api/categories/${editingCategory}`
        : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save category");
      }

      await fetchCategories();
      setShowModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // Delete handlers
  const handleDeleteClick = (slug: string) => {
    setCategoryToDelete(slug);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/categories/${categoryToDelete}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchCategories();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }

    setSaving(false);
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Categories Management
          </h1>
          <p className="text-gray-500 mt-1">Organize your product categories</p>
        </div>
        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
            <Folder className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500">No categories yet</p>
            <button
              onClick={openNewModal}
              className="mt-4 text-primary hover:underline"
            >
              Create your first category
            </button>
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-accent/50 rounded-lg flex items-center justify-center text-2xl shrink-0">
                  {category.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">{category.slug}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Order: {category.order}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(category.slug)}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(category.slug)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingCategory ? "Edit Category" : "New Category"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* English Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    EN
                  </span>
                  Category Name (English) *
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
                  placeholder="Frozen Seafood"
                />
              </div>

              {/* Arabic Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                    AR
                  </span>
                  Category Name (Arabic) *
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
                  placeholder="المأكولات البحرية المجمدة"
                />
              </div>

              {/* Slug */}
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
                  placeholder="frozen-seafood"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-generated from English name if left empty
                </p>
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, icon: option.value }))
                      }
                      className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                        formData.icon === option.value
                          ? "bg-primary text-white ring-2 ring-primary ring-offset-2"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      title={option.label}
                    >
                      {option.value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      order: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingCategory ? "Update" : "Create"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Category
            </h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this category? This will remove
              both the English and Arabic versions. Products in this category
              will not be deleted.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={saving}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={saving}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
              >
                {saving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
