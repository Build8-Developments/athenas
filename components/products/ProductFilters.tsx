"use client";

import { Search, SlidersHorizontal, X, Grid, List } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Category } from "@/data/products";

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  totalProducts: number;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export default function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalProducts,
  showFilters,
  onToggleFilters,
}: ProductFiltersProps) {
  const t = useTranslations("productsPage");

  return (
    <div className="space-y-4">
      {/* Top Bar - Search, Sort, View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full ps-12 pe-4 py-3 bg-white border border-accent/30 rounded-xl text-primary placeholder:text-primary/40 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute end-4 top-1/2 -translate-y-1/2 p-1 hover:bg-accent/50 rounded-full transition-colors"
              aria-label={t("clearSearch")}
            >
              <X className="w-4 h-4 text-primary/60" />
            </button>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Filter Toggle (Mobile) */}
          <button
            onClick={onToggleFilters}
            className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white border border-accent/30 rounded-xl text-primary font-medium hover:border-secondary transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>{t("filters")}</span>
          </button>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-4 py-3 bg-white border border-accent/30 rounded-xl text-primary focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-200 cursor-pointer"
          >
            <option value="default">{t("sortDefault")}</option>
            <option value="name-asc">{t("sortNameAsc")}</option>
            <option value="name-desc">{t("sortNameDesc")}</option>
            <option value="newest">{t("sortNewest")}</option>
          </select>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center bg-white border border-accent/30 rounded-xl overflow-hidden">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-3 transition-colors ${
                viewMode === "grid"
                  ? "bg-primary text-white"
                  : "text-primary/60 hover:text-primary"
              }`}
              aria-label={t("gridView")}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-3 transition-colors ${
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "text-primary/60 hover:text-primary"
              }`}
              aria-label={t("listView")}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-primary/60">
          {t("showingResults", { count: totalProducts })}
        </p>
        {selectedCategory && (
          <button
            onClick={() => onCategoryChange(null)}
            className="flex items-center gap-1 text-secondary hover:text-primary transition-colors"
          >
            <X className="w-4 h-4" />
            {t("clearFilters")}
          </button>
        )}
      </div>

      {/* Category Filters - Desktop Sidebar / Mobile Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          showFilters ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onToggleFilters}
      />
      <aside
        className={`lg:hidden fixed start-0 top-0 bottom-0 z-50 w-80 max-w-[85vw] bg-light p-6 shadow-2xl transition-transform duration-300 ${
          showFilters
            ? "translate-x-0"
            : "-translate-x-full rtl:translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-primary">{t("filters")}</h3>
          <button
            onClick={onToggleFilters}
            className="p-2 hover:bg-accent rounded-full transition-colors"
            aria-label={t("closeFilters")}
          >
            <X className="w-5 h-5 text-primary" />
          </button>
        </div>
        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => {
            onCategoryChange(cat);
            onToggleFilters();
          }}
          t={t}
        />
      </aside>
    </div>
  );
}

// Category sidebar component (used in both mobile and desktop)
export function CategoryList({
  categories,
  selectedCategory,
  onCategoryChange,
  t,
}: {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-primary/60 uppercase tracking-wider mb-3">
        {t("categories.title")}
      </h4>
      <button
        onClick={() => onCategoryChange(null)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
          selectedCategory === null
            ? "bg-primary text-white shadow-md"
            : "bg-white text-primary hover:bg-accent/50 border border-accent/30"
        }`}
      >
        <span className="font-medium">{t("allProducts")}</span>
        <span
          className={`text-sm ${
            selectedCategory === null ? "text-white/80" : "text-primary/50"
          }`}
        >
          {categories.reduce((sum, cat) => sum + (cat.count || 0), 0)}
        </span>
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.slug)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
            selectedCategory === category.slug
              ? "bg-primary text-white shadow-md"
              : "bg-white text-primary hover:bg-accent/50 border border-accent/30"
          }`}
        >
          <span className="flex items-center gap-3">
            <span className="text-lg">{category.icon}</span>
            <span className="font-medium">
              {t(`categories.${category.id}`)}
            </span>
          </span>
          <span
            className={`text-sm ${
              selectedCategory === category.slug
                ? "text-white/80"
                : "text-primary/50"
            }`}
          >
            {category.count}
          </span>
        </button>
      ))}
    </div>
  );
}
