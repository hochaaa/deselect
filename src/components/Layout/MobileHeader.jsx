import { Menu, Search, X } from 'lucide-react';

export function MobileHeader({
  isSearchOpen,
  searchQuery,
  onOpenMenu,
  onHome,
  onOpenSearch,
  onCloseSearch,
  onSearchChange,
  onSearchSubmit,
}) {
  return (
    <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-white/90 backdrop-blur-md border-b border-gray-100 z-[90] flex items-center justify-between px-6">
      {!isSearchOpen ? (
        <>
          <button onClick={onOpenMenu} className="outline-none p-2 -ml-2">
            <Menu className="w-6 h-6" />
          </button>
          <h1 onClick={onHome} className="text-xl font-bold tracking-tight outline-none">
            DE:SELECT
          </h1>
          <button onClick={onOpenSearch} className="outline-none p-2 -mr-2">
            <Search className="w-5 h-5 text-black" />
          </button>
        </>
      ) : (
        <div className="flex items-center w-full gap-3">
          <form onSubmit={onSearchSubmit} className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              className="w-full border-b border-black outline-none bg-transparent text-sm pb-1 font-medium focus:outline-none select-text"
              autoFocus
            />
          </form>
          <button onClick={onCloseSearch} className="outline-none p-2 -mr-2">
            <X className="w-5 h-5 text-black" />
          </button>
        </div>
      )}
    </div>
  );
}
