"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Search, SlidersHorizontal, X, Grid, List } from "lucide-react";
import { useTranslations } from "next-intl";
import { createPortal } from "react-dom";

// Hook to safely check if we're on the client
function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

// Simple category type for filters
interface FilterCategory {
  slug: string;
  name: string;
  count: number;
}

interface ProductFiltersProps {
  categories: FilterCategory[];
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

// Mobile Filter Drawer Component
function MobileFilterDrawer({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onCategoryChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  categories: FilterCategory[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}) {
  const t = useTranslations("productsPage");
  const isClient = useIsClient();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Don't render on server
  if (!isClient) return null;

  const handleCategorySelect = (cat: string | null) => {
    onCategoryChange(cat);
    onClose();
  };

  const drawerContent = (
    <div
      className={`fixed inset-0 z-9999 lg:hidden transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`absolute top-0 start-0 bottom-0 w-[280px] max-w-[85vw] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-accent/30">
          <h3 className="text-lg font-bold text-primary">{t("filters")}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent/50 rounded-full transition-colors"
            aria-label={t("closeFilters")}
          >
            <X className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <h4 className="text-sm font-semibold text-primary/60 uppercase tracking-wider mb-3">
            {t("categories.title")}
          </h4>

          <div className="space-y-2">
            <button
              onClick={() => handleCategorySelect(null)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                selectedCategory === null
                  ? "bg-primary text-white"
                  : "bg-accent/30 text-primary hover:bg-accent/50"
              }`}
            >
              <span className="font-medium">{t("allProducts")}</span>
              <span
                className={`text-sm ${
                  selectedCategory === null
                    ? "text-white/80"
                    : "text-primary/50"
                }`}
              >
                {categories.reduce((sum, cat) => sum + (cat.count || 0), 0)}
              </span>
            </button>

            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => handleCategorySelect(category.slug)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                  selectedCategory === category.slug
                    ? "bg-primary text-white"
                    : "bg-accent/30 text-primary hover:bg-accent/50"
                }`}
              >
                <span className="font-medium">{category.name}</span>
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
        </div>
      </div>
    </div>
  );

  // Render via portal
  return createPortal(drawerContent, document.body);
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
    <>
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
      </div>

      {/* Mobile Filter Drawer - Rendered via Portal */}
      <MobileFilterDrawer
        isOpen={showFilters}
        onClose={onToggleFilters}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />
    </>
  );
}

// Category sidebar component (used in desktop only now)
export function CategoryList({
  categories,
  selectedCategory,
  onCategoryChange,
  t,
}: {
  categories: FilterCategory[];
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
          key={category.slug}
          onClick={() => onCategoryChange(category.slug)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
            selectedCategory === category.slug
              ? "bg-primary text-white shadow-md"
              : "bg-white text-primary hover:bg-accent/50 border border-accent/30"
          }`}
        >
          <span className="font-medium">{category.name}</span>
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
