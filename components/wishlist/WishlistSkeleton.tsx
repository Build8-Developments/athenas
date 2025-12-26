"use client";

/**
 * WishlistSkeleton Component
 *
 * Displays animated placeholder UI while the wishlist page loads.
 * Matches the checkout-style layout with product table and summary section.
 *
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */
export default function WishlistSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Page Header Skeleton */}
      <div className="text-center mb-10">
        <div className="h-10 md:h-12 lg:h-14 bg-accent/50 rounded-lg w-64 mx-auto mb-4" />
      </div>

      {/* Summary Section Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-5 bg-accent/50 rounded w-32" />
        <div className="h-10 bg-accent/50 rounded-lg w-40" />
      </div>

      {/* Product Table Skeleton */}
      <div className="bg-white rounded-2xl shadow-md border border-accent/30 overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-accent/20 border-b border-accent/30">
          <div className="col-span-6">
            <div className="h-4 bg-accent/50 rounded w-20" />
          </div>
          <div className="col-span-3">
            <div className="h-4 bg-accent/50 rounded w-16" />
          </div>
          <div className="col-span-3 text-end">
            <div className="h-4 bg-accent/50 rounded w-14 ms-auto" />
          </div>
        </div>

        {/* Table Rows - 4 placeholder rows */}
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-accent/30 last:border-b-0"
          >
            {/* Product Column (Image + Name) */}
            <div className="col-span-1 md:col-span-6 flex items-center gap-4">
              {/* Image Placeholder */}
              <div className="w-16 h-16 md:w-20 md:h-20 bg-accent/50 rounded-lg shrink-0" />
              {/* Name and Description Placeholder */}
              <div className="flex-1 min-w-0">
                <div className="h-5 bg-accent/50 rounded w-3/4 mb-2" />
                <div className="h-3 bg-accent/40 rounded w-1/2" />
              </div>
            </div>

            {/* Category Column */}
            <div className="col-span-1 md:col-span-3 flex items-center">
              <div className="h-6 bg-accent/50 rounded-full w-24" />
            </div>

            {/* Actions Column */}
            <div className="col-span-1 md:col-span-3 flex items-center justify-end gap-2">
              <div className="h-9 w-9 bg-accent/50 rounded-lg" />
              <div className="h-9 w-9 bg-accent/50 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Summary Section Skeleton */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-2xl shadow-md border border-accent/30">
        <div className="flex items-center gap-4">
          <div className="h-5 bg-accent/50 rounded w-24" />
          <div className="h-8 bg-accent/50 rounded w-12" />
        </div>
        <div className="h-12 bg-accent/50 rounded-lg w-full sm:w-48" />
      </div>
    </div>
  );
}
