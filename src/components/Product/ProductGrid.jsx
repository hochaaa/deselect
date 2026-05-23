import { Heart } from 'lucide-react';

export function ProductGrid({
  items,
  likedProductIds,
  onProductClick,
  onToggleLike,
  onSelectBrand,
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mt-12">
      {items.map((item) => (
        <a
          key={item.id}
          href={item.link}
          onClick={(e) => onProductClick(e, item.link)}
          className="group md:cursor-none block outline-none transition-transform duration-500 md:hover:scale-[1.02] hover:-translate-y-1"
        >
          <div className="aspect-[4/5] bg-gray-100 overflow-hidden mb-4 relative rounded-sm md:cursor-none">
            <img src={item.img} alt={item.name} className="w-full h-full object-contain" />

            <button
              onClick={(e) => onToggleLike(e, item.id)}
              className="absolute bottom-3 right-3 p-2 z-10 md:cursor-none outline-none hover:scale-125 transition-transform"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${likedProductIds.includes(item.id) ? 'fill-black text-black' : 'text-black md:hover:text-gray-500'}`}
              />
            </button>
          </div>
          <div className="px-1 flex flex-col items-start md:cursor-none">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelectBrand(item.brand);
              }}
              className="text-xs text-gray-500 mb-1 font-mono uppercase tracking-widest outline-none md:cursor-none hover:scale-[1.1] hover:text-black hover:font-bold transition-all origin-left text-left"
            >
              {item.brand}
            </button>
            <p className="font-medium text-sm mb-1 line-clamp-1 w-full text-left">{item.name}</p>
            <p className="font-bold text-sm w-full text-left">{item.price}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
