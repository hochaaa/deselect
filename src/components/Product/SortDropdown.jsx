export function SortDropdown({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-[11px] font-mono uppercase tracking-widest bg-transparent md:cursor-none outline-none text-black transition-colors pb-1"
    >
      <option value="newest">Sort by: Newest</option>
      <option value="price_high">Price: High to Low</option>
      <option value="price_low">Price: Low to High</option>
    </select>
  );
}

export function BrandSortDropdown({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-[11px] font-mono uppercase tracking-widest bg-transparent md:cursor-none outline-none text-black transition-colors pb-1"
    >
      <option value="A-Z">Sort by: A-Z</option>
      <option value="Z-A">Sort by: Z-A</option>
    </select>
  );
}
