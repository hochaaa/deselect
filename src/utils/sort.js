export function sortProducts(items, sortOption) {
  if (sortOption === 'newest') return items;

  return [...items].sort((a, b) => {
    const priceA = parseInt(a.price?.toString().replace(/[^0-9]/g, '') || '0', 10);
    const priceB = parseInt(b.price?.toString().replace(/[^0-9]/g, '') || '0', 10);

    if (sortOption === 'price_high') return priceB - priceA;
    if (sortOption === 'price_low') return priceA - priceB;
    return 0;
  });
}

export function sortBrands(items, brandSortOption) {
  return [...items].sort((a, b) => {
    const isANumber = /^[0-9]/.test(a);
    const isBNumber = /^[0-9]/.test(b);

    if (brandSortOption === 'A-Z') {
      if (isANumber && !isBNumber) return 1;
      if (!isANumber && isBNumber) return -1;
      return a.localeCompare(b);
    }

    if (brandSortOption === 'Z-A') {
      if (isANumber && !isBNumber) return -1;
      if (!isANumber && isBNumber) return 1;
      return b.localeCompare(a);
    }

    return 0;
  });
}
