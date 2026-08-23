function ProductCard({ product }) {
  const { title, price, image, category } = product;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-navy/10 overflow-hidden hover:shadow-md hover:border-electric/40 transition-all">
      <div className="h-48 flex items-center justify-center bg-navy/5 p-4">
        <img src={image} alt={title} className="max-h-full max-w-full object-contain" />
      </div>

      <div className="p-4">
        <span className="text-xs uppercase tracking-wide text-electric font-medium">
          {category}
        </span>
        <h3 className="mt-1 text-sm font-medium text-navy line-clamp-2">
          {title}
        </h3>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-navy">${price}</span>
          <button className="rounded-md bg-navy px-3 py-1.5 text-sm text-white hover:bg-electric transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;