import { ProductGrid } from '../components/Product/ProductGrid';
import { SortDropdown } from '../components/Product/SortDropdown';
import { sortProducts } from '../utils/sort';

export function SearchPage({
  searchedProducts,
  likedProductIds,
  sortOption,
  onSortChange,
  onProductClick,
  onToggleLike,
  onSelectBrand,
}) {
  const sortedSearchProducts = sortProducts(searchedProducts, sortOption);

  return (
    <div className="mt-32 w-full md:cursor-none">
      <div className="flex justify-between items-center mb-5 md:cursor-none">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter md:cursor-none">SEARCH</h2>
      </div>
      <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-gray-200 pb-4 mb-8 min-h-[2.5rem] md:cursor-none gap-4 md:gap-0">
        <div className="hidden md:block md:cursor-none">
          <p className="text-sm text-transparent select-none md:cursor-none">&nbsp;</p>
        </div>
        <div className="w-full md:w-auto flex justify-start md:justify-end mt-4 md:mt-0">
          <SortDropdown value={sortOption} onChange={onSortChange} />
        </div>
      </div>
      <ProductGrid items={sortedSearchProducts} likedProductIds={likedProductIds} onProductClick={onProductClick} onToggleLike={onToggleLike} onSelectBrand={onSelectBrand} />
      {sortedSearchProducts.length === 0 && <p className="text-gray-400 mt-10 md:cursor-none">검색 결과가 없습니다.</p>}
    </div>
  );
}
