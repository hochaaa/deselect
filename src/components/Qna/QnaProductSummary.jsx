export function QnaProductSummary({ product, productId, compact = false }) {
  if (!product) {
    return (
      <div className="flex flex-col md:cursor-none">
        <span className="text-xs text-gray-400 font-mono uppercase mb-1 md:cursor-none">PRODUCT</span>
        <span className="text-sm font-bold text-gray-400 md:cursor-none">
          선택한 제품 정보를 불러오지 못했습니다{productId ? ` (${productId})` : ''}
        </span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3 md:cursor-none">
        <div className="w-12 h-16 bg-gray-50 border border-gray-100 shrink-0 md:cursor-none">
          <img src={product.img} alt={product.name} className="w-full h-full object-contain md:cursor-none" />
        </div>
        <div className="flex flex-col md:cursor-none">
          <span className="text-xs text-gray-400 font-mono uppercase mb-1 md:cursor-none">{product.brand}</span>
          <span className="text-sm font-bold text-gray-700 line-clamp-1 md:cursor-none">{product.name}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:cursor-none">
      <span className="text-xs text-gray-500 font-mono uppercase mb-2 md:cursor-none">{product.brand}</span>
      <span className="text-lg font-bold mb-1 md:cursor-none">{product.name}</span>
      <span className="text-sm font-bold text-gray-600 md:cursor-none">{product.price}</span>
    </div>
  );
}
