import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
  if (!products?.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        Chưa có sản phẩm nào.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
