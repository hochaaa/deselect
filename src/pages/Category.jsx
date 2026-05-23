import { ProductGrid } from '../components/Product/ProductGrid';
import { SortDropdown } from '../components/Product/SortDropdown';
import { categories, subCategoriesMap } from '../utils/constants';
import { sortProducts } from '../utils/sort';

export function Category({
  products,
  selectedCategory,
  selectedSubCategory,
  likedProductIds,
  sortOption,
  onSelectCategory,
  onSelectSubCategory,
  onSortChange,
  onProductClick,
  onToggleLike,
  onSelectBrand,
}) {
  let filteredByCategory = selectedCategory === 'All' ? products : products.filter((p) => p.category === selectedCategory);
  if (selectedCategory !== 'All' && selectedSubCategory !== 'All') {
    filteredByCategory = filteredByCategory.filter((p) => p.subcategory === selectedSubCategory);
  }
  const currentSubCats = subCategoriesMap[selectedCategory] || [];
  const sortedCategoryProducts = sortProducts(filteredByCategory, sortOption);

  return (
    <div className="mt-32 w-full md:cursor-none">
      <div className="flex justify-between items-center mb-5 md:cursor-none">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter md:cursor-none">{selectedCategory}</h2>
      </div>
      <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-gray-200 pb-4 mb-8 min-h-[2.5rem] md:cursor-none gap-4 md:gap-0">
        <div className="flex flex-wrap gap-4 md:gap-6 text-sm font-semibold text-gray-400 md:cursor-none">
          {selectedCategory === 'All' ? (
            <>
              <button onClick={() => onSelectCategory('All')} className="text-black transition md:cursor-none outline-none">All</button>
              {categories.slice(1).map((cat) => (
                <button key={cat} onClick={() => onSelectCategory(cat)} className="hover:text-black transition md:cursor-none outline-none">
                  {cat}
                </button>
              ))}
            </>
          ) : (
            currentSubCats.length > 0 && currentSubCats.map((sub) => (
              <button key={sub} onClick={() => onSelectSubCategory(sub)} className={`${selectedSubCategory === sub ? 'text-black' : 'hover:text-black'} transition md:cursor-none outline-none`}>
                {sub}
              </button>
            ))
          )}
        </div>
        <div className="w-full md:w-auto flex justify-start md:justify-end mt-4 md:mt-0">
          <SortDropdown value={sortOption} onChange={onSortChange} />
        </div>
      </div>
      <ProductGrid items={sortedCategoryProducts} likedProductIds={likedProductIds} onProductClick={onProductClick} onToggleLike={onToggleLike} onSelectBrand={onSelectBrand} />
      {sortedCategoryProducts.length === 0 && <p className="text-gray-400 mt-10 md:cursor-none">해당 카테고리에 등록된 상품이 없습니다.</p>}
    </div>
  );
}
