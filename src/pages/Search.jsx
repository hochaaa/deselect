import { ProductGrid } from '../components/Product/ProductGrid';
import { BrandSortDropdown, SortDropdown } from '../components/Product/SortDropdown';
import { BrandList } from './Brands';
import { sortBrands, sortProducts } from '../utils/sort';

export function SearchPage({
  searchedBrands,
  searchedProducts,
  searchTab,
  onSearchTabChange,
  likedProductIds,
  sortOption,
  brandSortOption,
  onSortChange,
  onBrandSortChange,
  onProductClick,
  onToggleLike,
  onSelectBrand,
}) {
  const sortedSearchBrands = sortBrands(searchedBrands, brandSortOption);
  const sortedSearchProducts = sortProducts(searchedProducts, sortOption);

  return (
    <div className="mt-32 w-full md:cursor-none">
      <div className="flex justify-between items-center mb-5 md:cursor-none">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter md:cursor-none">SEARCH</h2>
      </div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-end border-b border-gray-200 pb-4 mb-8 min-h-[2.5rem] md:cursor-none gap-4">
        <div role="tablist" aria-label="검색 결과" className="flex items-center gap-6">
          <button type="button" role="tab" aria-selected={searchTab === 'brand'} onClick={() => onSearchTabChange('brand')} className={`text-sm font-bold transition-colors md:cursor-none outline-none ${searchTab === 'brand' ? 'text-black border-b-2 border-black pb-1' : 'text-gray-400 hover:text-black pb-1'}`}>
            Brand
          </button>
          <button type="button" role="tab" aria-selected={searchTab === 'product'} onClick={() => onSearchTabChange('product')} className={`text-sm font-bold transition-colors md:cursor-none outline-none ${searchTab === 'product' ? 'text-black border-b-2 border-black pb-1' : 'text-gray-400 hover:text-black pb-1'}`}>
            Product
          </button>
        </div>
        <div className="flex justify-start sm:justify-end">
          {searchTab === 'brand' ? <BrandSortDropdown value={brandSortOption} onChange={onBrandSortChange} /> : <SortDropdown value={sortOption} onChange={onSortChange} />}
        </div>
      </div>
      {searchTab === 'brand' ? (
        sortedSearchBrands.length > 0 ? <BrandList brands={sortedSearchBrands} onSelectBrand={onSelectBrand} /> : <p className="text-gray-400 mt-10 md:cursor-none">검색 결과가 없습니다.</p>
      ) : (
        <>
          <ProductGrid items={sortedSearchProducts} likedProductIds={likedProductIds} onProductClick={onProductClick} onToggleLike={onToggleLike} onSelectBrand={onSelectBrand} />
          {sortedSearchProducts.length === 0 && <p className="text-gray-400 mt-10 md:cursor-none">검색 결과가 없습니다.</p>}
        </>
      )}
    </div>
  );
}
