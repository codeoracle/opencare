"use client";

import { useMemo, useState } from "react";
import { ProductCard, type PriceDisplay, type ProductCardData } from "@/components/ProductCard";

type FilterOption = { _id: string; name: string; slug: string };

export function ProductsCatalog({
  products,
  brands,
  categories,
  initialQ = "",
  initialBrand = "",
  initialCategory = "",
  initialSort = "featured",
  display,
}: {
  display: PriceDisplay;
  products: ProductCardData[];
  brands: FilterOption[];
  categories: FilterOption[];
  initialQ?: string;
  initialBrand?: string;
  initialCategory?: string;
  initialSort?: string;
}) {
  const [q, setQ] = useState(initialQ);
  const [brand, setBrand] = useState(initialBrand);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);

  const filtered = useMemo(() => {
    let list = [...products];
    const query = q.trim().toLowerCase();

    if (query) {
      list = list.filter((p) => {
        const hay = `${p.name} ${p.shortDescription || ""} ${p.brand?.name || ""} ${p.category?.name || ""}`.toLowerCase();
        return hay.includes(query);
      });
    }

    if (brand) list = list.filter((p) => p.brand?.slug === brand);
    if (category) list = list.filter((p) => p.category?.slug === category);

    list.sort((a, b) => {
      // Products without a price sort last.
      if (sort === "price_asc") return (a.price ?? Infinity) - (b.price ?? Infinity);
      if (sort === "price_desc") return (b.price ?? -1) - (a.price ?? -1);
      if (sort === "newest") return b._id.localeCompare(a._id);
      return 0;
    });

    return list;
  }, [products, q, brand, category, sort]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div className="sm:col-span-1">
          <label className="text-[12px] font-semibold text-black/60">Search</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-[13px] outline-none transition focus:border-[var(--brand)]"
          />
        </div>
        {brands.length ? (
        <div>
          <label className="text-[12px] font-semibold text-black/60">Brand</label>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-[13px] outline-none transition focus:border-[var(--brand)]"
          >
            <option value="">All brands</option>
            {brands.map((b) => (
              <option key={b._id} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        ) : null}
        {categories.length ? (
        <div>
          <label className="text-[12px] font-semibold text-black/60">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-[13px] outline-none transition focus:border-[var(--brand)]"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        ) : null}
        <div>
          <label className="text-[12px] font-semibold text-black/60">Sort</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-[13px] outline-none transition focus:border-[var(--brand)]"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            {display.showPrices ? (
              <>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
              </>
            ) : null}
          </select>
        </div>
      </div>

      <div className="mt-4 text-[13px] text-black/55">
        Showing <span className="font-semibold text-black/80">{filtered.length}</span> product
        {filtered.length === 1 ? "" : "s"}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-black/10 bg-white/70 px-4 py-10 text-center text-[14px] text-black/60">
            No products match your filters.
          </div>
        ) : (
          filtered.map((p) => <ProductCard key={p._id} product={p} display={display} />)
        )}
      </div>
    </div>
  );
}
