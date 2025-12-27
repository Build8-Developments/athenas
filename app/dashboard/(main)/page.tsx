"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  FolderOpen,
  TrendingUp,
  ShoppingCart,
  Eye,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

interface Product {
  _id: string;
  slug: string;
  locale: string;
  name: string;
  category: string;
  image: string;
  price: number;
  priceUnit: string;
  featured: boolean;
  new: boolean;
}

interface Category {
  _id: string;
  slug: string;
  locale: string;
  name: string;
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/products?locale=en"),
          fetch("/api/categories?locale=en"),
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData.products || []);
        setCategories(categoriesData.categories || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      name: "Total Products",
      value: products.length,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      name: "Categories",
      value: categories.length,
      icon: FolderOpen,
      color: "bg-purple-500",
    },
    {
      name: "Featured Products",
      value: products.filter((p) => p.featured).length,
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      name: "New Products",
      value: products.filter((p) => p.new).length,
      icon: ShoppingCart,
      color: "bg-orange-500",
    },
  ];

  const recentProducts = products.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your products.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 ${stat.color} rounded-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Products
            </h2>
            <p className="text-sm text-gray-500">
              The latest products added to your catalog
            </p>
          </div>
          <Link
            href="/dashboard/products"
            className="text-sm font-medium text-primary hover:text-secondary transition-colors"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No products found.{" "}
                    <Link
                      href="/dashboard/products/new"
                      className="text-primary hover:underline"
                    >
                      Add your first product
                    </Link>
                  </td>
                </tr>
              ) : (
                recentProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={
                              product.image ||
                              "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100&h=100&fit=crop&crop=center"
                            }
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-medium text-gray-900">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      ${product.price.toFixed(2)}/{product.priceUnit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        {product.featured && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                            Featured
                          </span>
                        )}
                        {product.new && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                            New
                          </span>
                        )}
                        {!product.featured && !product.new && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                            Active
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        href={`/en/products/${product.slug}`}
                        className="inline-flex items-center gap-1 text-sm text-primary hover:text-secondary transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/products/new"
          className="flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-primary/30 hover:shadow-md transition-all"
        >
          <div className="p-3 bg-primary/10 rounded-xl">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Add New Product</h3>
            <p className="text-sm text-gray-500">
              Create a new product listing
            </p>
          </div>
        </Link>

        <Link
          href="/dashboard/categories"
          className="flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-primary/30 hover:shadow-md transition-all"
        >
          <div className="p-3 bg-purple-100 rounded-xl">
            <FolderOpen className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Manage Categories</h3>
            <p className="text-sm text-gray-500">
              Organize your product categories
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
