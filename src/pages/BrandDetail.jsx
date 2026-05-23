import { Heart } from 'lucide-react';
import { ProductGrid } from '../components/Product/ProductGrid';
import { SortDropdown } from '../components/Product/SortDropdown';
import { categories } from '../utils/constants';
import { sortProducts } from '../utils/sort';

export function BrandDetail({
  products,
  selectedBrand,
  selectedCategory,
  favoriteBrands,
  likedProductIds,
  sortOption,
  onSortChange,
  onSelectCategory,
  onToggleFavoriteBrand,
  onProductClick,
  onToggleLike,
  onSelectBrand,
}) {
  const filteredByBrand = products.filter((p) => p.brand === selectedBrand);
  const finallyFiltered = selectedCategory === 'All' ? filteredByBrand : filteredByBrand.filter((p) => p.category === selectedCategory);
  const sortedBrandProducts = sortProducts(finallyFiltered, sortOption);

  return (
    <div className="mt-32 w-full md:cursor-none">
      <div className="flex items-center gap-5 mb-5 md:cursor-none">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter md:cursor-none">{selectedBrand}</h2>
        <button onClick={(e) => onToggleFavoriteBrand(e, selectedBrand)} className="outline-none md:cursor-none flex items-center justify-center">
          <Heart strokeWidth={1.5} className={`w-7 h-7 transition-transform hover:scale-125 md:cursor-none ${favoriteBrands.includes(selectedBrand) ? 'fill-black text-black' : 'text-gray-300 hover:text-black'}`} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-gray-200 pb-4 mb-8 min-h-[2.5rem] md:cursor-none gap-4 md:gap-0">
        <div className="flex flex-wrap gap-4 md:gap-6 text-sm font-semibold text-gray-400 md:cursor-none">
          <button onClick={() => onSelectCategory('All')} className={`${selectedCategory === 'All' ? 'text-black' : 'hover:text-black'} transition md:cursor-none outline-none`}>All</button>
          {categories.slice(1).map((cat) => (
            <button key={cat} onClick={() => onSelectCategory(cat)} className={`${selectedCategory === cat ? 'text-black' : 'hover:text-black'} transition md:cursor-none outline-none`}>{cat}</button>
          ))}
        </div>

        <div className="flex flex-col items-start md:items-end gap-3 md:cursor-none w-full md:w-auto mt-4 md:mt-0">
          <SortDropdown value={sortOption} onChange={onSortChange} />
        </div>
      </div>
      <ProductGrid items={sortedBrandProducts} likedProductIds={likedProductIds} onProductClick={onProductClick} onToggleLike={onToggleLike} onSelectBrand={onSelectBrand} />
      {sortedBrandProducts.length === 0 && <p className="text-gray-400 mt-10 md:cursor-none">해당 카테고리에 등록된 상품이 없습니다.</p>}
    </div>
  );
}
