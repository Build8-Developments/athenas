"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ProductCard from "@/components/products/ProductCard";
import ProductListCard from "@/components/products/ProductListCard";
import ProductFilters, {
  CategoryList,
} from "@/components/products/ProductFilters";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { ProductData, CategoryData } from "@/lib/data";

interface ProductsClientProps {
  initialProducts: ProductData[];
  categories: (CategoryData & { count: number })[];
  initialCategory?: string | null;
}

export default function ProductsClient({
  initialProducts,
  categories,
  initialCategory,
}: ProductsClientProps) {
  const t = useTranslations("productsPage");
  const [sectionRef, isVisible] = useScrollAnimation<HTMLDivElement>({
    threshold: 0.1,
  });

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory || null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Get categories formatted for the filter component
  const categoriesForFilter = useMemo(
    () =>
      categories.map((cat) => ({
        slug: cat.slug,
        name: cat.name,
        count: cat.count,
      })),
    [categories]
  );

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter by category
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => {
        const name = p.name.toLowerCase();
        const description = p.description.toLowerCase();
        return name.includes(query) || description.includes(query);
      });
    }

    // Sort
    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
        result.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
        break;
      default:
        // Default: featured first, then new
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.new && !b.new) return -1;
          if (!a.new && b.new) return 1;
          return 0;
        });
    }

    return result;
  }, [initialProducts, selectedCategory, searchQuery, sortBy]);

  return (
    <div ref={sectionRef} className="max-w-7xl mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="text-center mb-10">
        <h1
          className={`text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {t("title")}
        </h1>
        <p
          className={`text-primary/70 text-lg max-w-2xl mx-auto transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {t("subtitle")}
        </p>
      </div>

      {/* Filters */}
      <div
        className={`mb-8 transition-all duration-700 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <ProductFilters
          categories={categoriesForFilter}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalProducts={filteredProducts.length}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />
      </div>

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:block w-64 shrink-0 transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="sticky top-28">
            <CategoryList
              categories={categoriesForFilter}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              t={t}
            />
          </div>
        </aside>

        {/* Products Grid/List */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-primary/60 text-lg">{t("noProductsFound")}</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
              >
                {t("clearFilters")}
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-3 sm:gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {filteredProducts.map((product, index) => (
                <div
                  key={product._id}
                  className={`transition-all duration-500 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${300 + index * 50}ms` }}
                >
                  {viewMode === "grid" ? (
                    <ProductCard product={product} />
                  ) : (
                    <ProductListCard product={product} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
