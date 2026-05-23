import { Heart } from 'lucide-react';
import { ProductGrid } from '../components/Product/ProductGrid';
import { SortDropdown } from '../components/Product/SortDropdown';
import { sortProducts } from '../utils/sort';

export function Liked({
  products,
  likedProductIds,
  favoriteBrands,
  likedTab,
  sortOption,
  onTabChange,
  onSortChange,
  onProductClick,
  onToggleLike,
  onToggleFavoriteBrand,
  onSelectBrand,
}) {
  const wishlistProds = products.filter((p) => likedProductIds.includes(p.id));
  const sortedWishlistProds = sortProducts(wishlistProds, sortOption);

  return (
    <div className="mt-32 w-full md:cursor-none">
      <div className="flex justify-between items-center mb-5 md:cursor-none">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter md:cursor-none">LIKED</h2>
      </div>
      <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-gray-200 pb-4 mb-8 min-h-[2.5rem] md:cursor-none gap-4 md:gap-0">
        <div className="flex gap-6 text-sm font-semibold text-gray-400 md:cursor-none">
          <button onClick={() => onTabChange('products')} className={`${likedTab === 'products' ? 'text-black' : 'hover:text-black'} transition md:cursor-none outline-none`}>Product</button>
          <button onClick={() => onTabChange('brands')} className={`${likedTab === 'brands' ? 'text-black' : 'hover:text-black'} transition md:cursor-none outline-none`}>Brand</button>
        </div>
      </div>

      {likedTab === 'products' && (
        <>
          <div className="flex justify-end mb-8 md:cursor-none">
            <SortDropdown value={sortOption} onChange={onSortChange} />
          </div>
          <ProductGrid items={sortedWishlistProds} likedProductIds={likedProductIds} onProductClick={onProductClick} onToggleLike={onToggleLike} onSelectBrand={onSelectBrand} />
          {sortedWishlistProds.length === 0 && (
            <div className="text-center py-20 md:cursor-none">
              <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4 md:cursor-none" />
              <p className="text-gray-400 font-medium md:cursor-none">좋아요 누른 상품이 없습니다.</p>
            </div>
          )}
        </>
      )}

      {likedTab === 'brands' && (
        <>
          <ul className="flex flex-col gap-6 text-2xl md:text-4xl font-medium tracking-tighter mt-8 md:cursor-none">
            {favoriteBrands.map((brand) => (
              <li key={brand} className="flex items-center gap-5 group border-b border-gray-50 pb-6 md:cursor-none">
                <button onClick={() => onSelectBrand(brand)} className="hover:text-gray-400 transition md:cursor-none text-left outline-none">
                  {brand}
                </button>
                <button onClick={(e) => onToggleFavoriteBrand(e, brand)} className="outline-none md:cursor-none flex items-center justify-center">
                  <Heart strokeWidth={1.5} className="w-6 h-6 fill-black text-black hover:scale-125 transition-transform md:cursor-none" />
                </button>
              </li>
            ))}
          </ul>
          {favoriteBrands.length === 0 && (
            <div className="text-center py-20 md:cursor-none">
              <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4 md:cursor-none" />
              <p className="text-gray-400 font-medium md:cursor-none">좋아요 누른 브랜드가 없습니다.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
