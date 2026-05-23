import { Search, X } from 'lucide-react';
import { categories } from '../../utils/constants';

export function Sidebar({
  currentView,
  currentUser,
  isMobileMenuOpen,
  isProductMenuOpen,
  isSearchOpen,
  selectedCategory,
  searchQuery,
  onCloseMenu,
  onHome,
  onNavigate,
  onToggleProductMenu,
  onSelectCategory,
  onRequireMyPage,
  onOpenLogout,
  onOpenAuth,
  onToggleSearch,
  onSearchChange,
  onSearchSubmit,
}) {
  return (
    <aside className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 p-8 md:p-10 flex flex-col z-[100] transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:cursor-none`}>
      <div className="md:cursor-none shrink-0">
        <div className="flex justify-between items-center mb-12 md:cursor-none">
          <h1 onClick={onHome} className="text-3xl font-bold tracking-tight md:cursor-none hover:text-gray-400 transition outline-none">DE:SELECT</h1>
          <button className="md:hidden outline-none p-2 -mr-2 md:cursor-none" onClick={onCloseMenu}>
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col justify-between pb-4">
        <nav className="flex flex-col gap-5 md:gap-4 font-semibold text-lg tracking-tight md:cursor-none">
          <button onClick={() => onNavigate('brands')} className={`text-left md:cursor-none transition outline-none ${currentView === 'brands' ? 'text-gray-400' : 'text-black hover:text-gray-400'}`}>Brands</button>
          <div className="md:cursor-none">
            <button onClick={onToggleProductMenu} className="flex items-center justify-between w-full transition text-black hover:text-gray-400 outline-none md:cursor-none">
              <span className="md:cursor-none">Product</span>
            </button>
            <div className={`grid transition-all duration-300 ease-in-out md:cursor-none ${isProductMenuOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
              <div className="overflow-hidden flex flex-col gap-4 md:gap-3 ml-4 text-sm md:text-sm font-medium md:cursor-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => onSelectCategory(cat)}
                    className={`text-left md:cursor-none transition outline-none py-1 md:py-0 ${selectedCategory === cat && currentView === 'category' ? 'text-gray-400' : 'text-black hover:text-gray-400'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button onClick={() => onNavigate('about')} className={`text-left md:cursor-none transition outline-none ${currentView === 'about' ? 'text-gray-400' : 'text-black hover:text-gray-400'}`}>About Us</button>
          <button onClick={() => onNavigate('customer')} className={`text-left transition outline-none md:cursor-none ${currentView === 'customer' ? 'text-gray-400' : 'text-black hover:text-gray-400'}`}>Styling Q&A</button>
        </nav>

        <div className="flex flex-col gap-4 mt-8 pt-4 border-t border-gray-100 md:cursor-none shrink-0">
          <button
            onClick={onRequireMyPage}
            className={`font-semibold text-lg tracking-tight text-left md:cursor-none transition outline-none mb-4 ${currentView === 'mypage' ? 'text-gray-400' : 'text-black hover:text-gray-400'}`}
          >
            My Page
          </button>

          <div className="md:hidden mt-2 flex flex-col items-start md:cursor-none">
            {currentUser ? (
              <button
                onClick={onOpenLogout}
                className="font-bold text-xs text-gray-400 border-b border-gray-400 pb-0.5 uppercase tracking-widest outline-none transition-colors md:cursor-none"
              >
                LOGOUT
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="font-bold text-xs text-black border-b border-black pb-0.5 uppercase tracking-widest outline-none transition-colors md:cursor-none"
              >
                LOGIN / JOIN
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3 md:cursor-none shrink-0 pt-8 overflow-hidden">
        <button onClick={onToggleSearch} className="outline-none md:cursor-none">
          <Search className="w-5 h-5 md:cursor-none text-black hover:text-gray-400 transition outline-none" />
        </button>
        <form onSubmit={onSearchSubmit} className={`flex-1 md:cursor-none transition-all duration-300 ease-in-out ${isSearchOpen ? 'w-full opacity-100' : 'w-0 opacity-0'}`}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="w-full border-b border-black outline-none bg-transparent text-sm pb-1 font-medium md:cursor-none focus:outline-none select-text"
            autoFocus={isSearchOpen}
          />
        </form>
      </div>
    </aside>
  );
}
