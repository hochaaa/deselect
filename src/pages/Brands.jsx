import { BrandSortDropdown } from '../components/Product/SortDropdown';
import { sortBrands } from '../utils/sort';

export function Brands({ availableBrands, brandSortOption, onBrandSortChange, onSelectBrand }) {
  const sortedBrands = sortBrands(availableBrands, brandSortOption);

  return (
    <div className="mt-32 w-full md:cursor-none">
      <div className="flex justify-between items-center mb-5 md:cursor-none">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter md:cursor-none">Brands</h2>
      </div>
      <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-gray-200 pb-4 mb-8 min-h-[2.5rem] md:cursor-none gap-4 md:gap-0">
        <div className="hidden md:block md:cursor-none">
          <p className="text-sm text-transparent select-none md:cursor-none">&nbsp;</p>
        </div>
        <div className="w-full md:w-auto flex justify-start md:justify-end mt-4 md:mt-0">
          <BrandSortDropdown value={brandSortOption} onChange={onBrandSortChange} />
        </div>
      </div>

      <ul className="flex flex-col gap-6 text-4xl font-medium tracking-tighter md:cursor-none">
        {sortedBrands.map((brand) => (
          <li key={brand}>
            <button
              onClick={() => onSelectBrand(brand)}
              className="hover:text-gray-400 transition md:cursor-none text-left outline-none"
            >
              {brand}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
