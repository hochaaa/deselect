import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Heart, Star, X, Eye, EyeOff, MessageSquare } from 'lucide-react';
import { supabase } from './supabase';

const categories = ['All', 'Outer', 'Top', 'Bottom', 'Accessary', 'Shoes'];

const subCategoriesMap = {
  Outer: ['All', 'Jacket', 'Coat', 'Cardigan', 'Zip-up'],
  Top: ['All', 'T-shirt', 'Shirt', 'Knit', 'Hoodie', 'Sweatshirt'],
  Bottom: ['All', 'Jeans', 'Trousers', 'Sweatpants', 'Shorts'],
  Accessary: ['All', 'Hat', 'Bag', 'Ring', 'Bracelet', 'Necklace'],
  Shoes: ['All', 'Sneakers', 'Boots', 'Derby', 'Sandals']
};

export default function App() {
  const [products, setProducts] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mainRef = useRef(null);

  const [currentView, setCurrentView] = useState(() => sessionStorage.getItem('currentView') || 'home');
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(() => sessionStorage.getItem('isProductMenuOpen') === 'true');
  const [selectedBrand, setSelectedBrand] = useState(() => sessionStorage.getItem('selectedBrand') || '');
  const [selectedCategory, setSelectedCategory] = useState(() => sessionStorage.getItem('selectedCategory') || 'All');
  const [selectedSubCategory, setSelectedSubCategory] = useState(() => sessionStorage.getItem('selectedSubCategory') || 'All');

  const [likedTab, setLikedTab] = useState('products');

  const [searchedProducts, setSearchedProducts] = useState(() => {
    const saved = sessionStorage.getItem('searchedProducts');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [likedProductIds, setLikedProductIds] = useState(() => {
    const saved = sessionStorage.getItem('likedProductIds');
    return saved ? JSON.parse(saved) : [];
  });

  const [favoriteBrands, setFavoriteBrands] = useState(() => {
    const saved = sessionStorage.getItem('favoriteBrands');
    return saved ? JSON.parse(saved) : [];
  });

  const [sortOption, setSortOption] = useState(() => sessionStorage.getItem('sortOption') || 'newest');

  const [qnaList, setQnaList] = useState(() => {
    const saved = sessionStorage.getItem('qnaList');
    return saved ? JSON.parse(saved) : [];
  });
  const [qnaForm, setQnaForm] = useState({ productId: '', title: '', content: '' });
  const [selectedQna, setSelectedQna] = useState(null);
  const [adminReply, setAdminReply] = useState('');

  const [qnaProductSearch, setQnaProductSearch] = useState('');
  const [isEditingReply, setIsEditingReply] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetLink, setTargetLink] = useState('');

  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });
  const [authError, setAuthError] = useState('');
  
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isAdmin = currentUser?.email === 'hochan228@naver.com';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      if (!session?.user) {
        setLikedProductIds([]); 
        setFavoriteBrands([]); 
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
      if (!session?.user) {
        setLikedProductIds([]); 
        setFavoriteBrands([]); 
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [currentView, selectedBrand, selectedCategory, selectedSubCategory, likedTab, selectedQna]);

  useEffect(() => {
    sessionStorage.setItem('currentView', currentView);
    sessionStorage.setItem('isProductMenuOpen', isProductMenuOpen);
    sessionStorage.setItem('selectedBrand', selectedBrand);
    sessionStorage.setItem('selectedCategory', selectedCategory);
    sessionStorage.setItem('selectedSubCategory', selectedSubCategory);
    sessionStorage.setItem('searchedProducts', JSON.stringify(searchedProducts));
    sessionStorage.setItem('likedProductIds', JSON.stringify(likedProductIds));
    sessionStorage.setItem('favoriteBrands', JSON.stringify(favoriteBrands)); 
    sessionStorage.setItem('sortOption', sortOption);
    sessionStorage.setItem('qnaList', JSON.stringify(qnaList)); 
  }, [currentView, isProductMenuOpen, selectedBrand, selectedCategory, selectedSubCategory, searchedProducts, likedProductIds, favoriteBrands, sortOption, qnaList]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) setIsModalOpen(false);
      if (e.key === 'Escape' && isAuthModalOpen) setIsAuthModalOpen(false);
      if (e.key === 'Escape' && isLogoutModalOpen) setIsLogoutModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, isAuthModalOpen, isLogoutModalOpen]);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("데이터를 가져오는 중 에러 발생:", error);
      } else {
        setProducts(data);
        
        const brands = [...new Set(data.map(p => p.brand))].sort((a, b) => {
          const isANumber = /^[0-9]/.test(a);
          const isBNumber = /^[0-9]/.test(b);
          if (isANumber && !isBNumber) return 1;
          if (!isANumber && isBNumber) return -1;
          return a.localeCompare(b);
        });
        
        setAvailableBrands(brands);
      }
      setIsLoading(false);
    }
    
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => setMousePos({ x: event.clientX, y: event.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (authMode === 'signup') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const pwRegex = /^[a-zA-Z0-9!@#$%^&*()_+~\-={}[\]:;"'<>,.?/\\|]+$/;
      const nameRegex = /^[a-zA-Z가-힣]+$/;

      if (!emailRegex.test(authForm.email)) return setAuthError('유효한 이메일 주소를 입력해주세요.');
      
      if (!nameRegex.test(authForm.name) && authForm.name !== 'DE:SELECT') {
        return setAuthError('이름은 한글과 영어만 사용 가능합니다.');
      }
      
      if (!pwRegex.test(authForm.password) || authForm.password.length < 6) {
        return setAuthError('비밀번호는 영어, 숫자, 특수문자만 포함하여 6자리 이상이어야 합니다.');
      }

      const { error } = await supabase.auth.signUp({
        email: authForm.email,
        password: authForm.password,
        options: {
          data: { name: authForm.name }
        }
      });

      if (error) {
        setAuthError(error.message.includes('already registered') ? 'This email is already in use.' : error.message);
      } else {
        alert('DE:SELECT의 멤버가 되신 것을 환영합니다.');
        setAuthMode('login');
        setAuthForm({ ...authForm, password: '' });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: authForm.email,
        password: authForm.password,
      });

      if (error) {
        setAuthError('이메일 또는 비밀번호가 일치하지 않습니다.');
      } else {
        setIsAuthModalOpen(false);
        setAuthForm({ email: '', password: '', name: '' });
      }
    }
  };

  const confirmLogout = async () => {
    await supabase.auth.signOut();
    setLikedProductIds([]); 
    setFavoriteBrands([]); 
    sessionStorage.removeItem('likedProductIds'); 
    sessionStorage.removeItem('favoriteBrands');
    setIsLogoutModalOpen(false); 
    setCurrentView('home');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();
    const matchedBrand = availableBrands.find(b => b.toLowerCase() === query);
    if (matchedBrand) {
      setSelectedBrand(matchedBrand);
      setSelectedCategory('All');
      setCurrentView('brandDetail');
      setIsSearchOpen(false);
      setSearchQuery('');
      return;
    }

    let matchedProducts = products.filter(p => p.name.toLowerCase() === query);
    if (matchedProducts.length === 0) {
      matchedProducts = products.filter(p => p.name.toLowerCase().includes(query));
    }
    
    setSearchedProducts(matchedProducts);
    setCurrentView('search');
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleProductClick = (e, link) => {
    e.preventDefault();
    setTargetLink(link);
    setIsModalOpen(true);
  };

  const toggleLike = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      alert("로그인이 필요한 기능입니다.");
      setIsAuthModalOpen(true);
      return;
    }
    
    setLikedProductIds(prev => {
      if (prev.includes(productId)) return prev.filter(id => id !== productId);
      else return [...prev, productId];
    });
  };

  const toggleFavoriteBrand = (e, brandName) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      alert("로그인이 필요한 기능입니다.");
      setIsAuthModalOpen(true);
      return;
    }

    setFavoriteBrands(prev => {
      if (prev.includes(brandName)) return prev.filter(b => b !== brandName);
      else return [...prev, brandName];
    });
  };

  const handleQnaSubmit = (e) => {
    e.preventDefault();
    if (!qnaForm.productId) return alert("스타일링이 궁금한 제품을 선택해주세요.");
    if (!qnaForm.title.trim() || !qnaForm.content.trim()) return alert("제목과 내용을 모두 입력해주세요.");

    const newQna = {
      id: Date.now(),
      author: currentUser.user_metadata?.name || 'Guest',
      email: currentUser.email,
      productId: qnaForm.productId,
      title: qnaForm.title,
      content: qnaForm.content,
      reply: null,
      createdAt: new Date().toLocaleDateString()
    };

    setQnaList([newQna, ...qnaList]);
    setQnaForm({ productId: '', title: '', content: '' });
    setQnaProductSearch('');
    setCurrentView('customer');
  };

  const handleAdminReply = (e) => {
    e.preventDefault();
    if (!adminReply.trim()) return;

    setQnaList(qnaList.map(q => q.id === selectedQna.id ? { ...q, reply: adminReply } : q));
    setSelectedQna({ ...selectedQna, reply: adminReply });
    setAdminReply('');
    setIsEditingReply(false); 
  };

  const handleDeleteQna = (id) => {
    if(window.confirm("이 문의글을 완전히 삭제하시겠습니까?")) {
      const newList = qnaList.filter(q => q.id !== id);
      setQnaList(newList);
      setSelectedQna(null);
      setCurrentView('customer');
    }
  };

  const handleDeleteReply = (e) => {
    e.preventDefault();
    if(window.confirm("이 답변을 삭제하시겠습니까?")) {
      setQnaList(qnaList.map(q => q.id === selectedQna.id ? { ...q, reply: null } : q));
      setSelectedQna({ ...selectedQna, reply: null });
      setIsEditingReply(false);
    }
  };

  const getSortedProducts = (items) => {
    if (sortOption === 'newest') return items;
    return [...items].sort((a, b) => {
      const priceA = parseInt(a.price?.toString().replace(/[^0-9]/g, '') || '0', 10);
      const priceB = parseInt(b.price?.toString().replace(/[^0-9]/g, '') || '0', 10);
      if (sortOption === 'price_high') return priceB - priceA;
      if (sortOption === 'price_low') return priceA - priceB;
      return 0;
    });
  };

  const renderSortDropdown = () => (
    <select
      value={sortOption}
      onChange={(e) => setSortOption(e.target.value)}
      className="text-[11px] font-mono uppercase tracking-widest bg-transparent cursor-none outline-none text-black transition-colors pb-1"
    >
      <option value="newest">Sort by: Newest</option>
      <option value="price_high">Price: High to Low</option>
      <option value="price_low">Price: Low to High</option>
    </select>
  );

  const renderProductGrid = (items) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
      {items.map((item) => (
        <a 
          key={item.id} 
          href={item.link} 
          onClick={(e) => handleProductClick(e, item.link)} 
          className="group cursor-none block outline-none transition-transform duration-500 hover:scale-[1.02] hover:-translate-y-1"
        >
          <div className="aspect-[4/5] bg-gray-100 overflow-hidden mb-4 relative rounded-sm cursor-none">
            <img src={item.img} alt={item.name} className="w-full h-full object-contain" />
            
            <button 
              onClick={(e) => toggleLike(e, item.id)}
              className="absolute bottom-3 right-3 p-2 z-10 cursor-none outline-none hover:scale-125 transition-transform"
            >
              <Heart 
                className={`w-5 h-5 transition-colors ${likedProductIds.includes(item.id) ? 'fill-black text-black' : 'text-black hover:text-gray-500'}`} 
              />
            </button>
          </div>
          <div className="px-1 flex flex-col items-start cursor-none">
            <button
              onClick={(e) => {
                e.preventDefault(); 
                e.stopPropagation(); 
                setSelectedBrand(item.brand);
                setSelectedCategory('All');
                setCurrentView('brandDetail');
              }}
              className="text-xs text-gray-500 mb-1 font-mono uppercase tracking-widest outline-none cursor-none hover:scale-[1.1] hover:text-black hover:font-bold transition-all origin-left text-left"
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

  if (isLoading) {
    return <div className="min-h-screen bg-white flex items-center justify-center font-bold text-2xl outline-none cursor-none">LOADING DE:SELECT...</div>;
  }

  const renderContent = () => {
    switch (currentView) {
      
      case 'home':
        return (
          <div className="h-full min-h-[75vh] flex flex-col justify-center cursor-none">
            <div className="flex flex-col gap-2 mb-12">
              <h2 className="text-5xl md:text-7xl lg:text-[7rem] font-bold tracking-tighter leading-[0.9] text-black cursor-none">
                WE SELECT,
              </h2>
              <h2 className="text-5xl md:text-7xl lg:text-[7rem] font-bold tracking-tighter leading-[0.9] text-gray-300 cursor-none">
                YOU EXPERIENCE.
              </h2>
            </div>
            <p className="text-lg md:text-xl font-medium text-gray-500 max-w-2xl mb-16 leading-relaxed tracking-tight break-keep cursor-none">
              수많은 브랜드와 넘쳐나는 정보 속, 우리는 오직 제품에만 집중합니다. DE:SELECT의 시선으로 바라본 큐레이션을 경험해보세요.
            </p>
            <div>
              <button 
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedSubCategory('All');
                  setCurrentView('category');
                  setIsProductMenuOpen(true);
                }}
                className="group flex items-center gap-4 text-sm font-bold uppercase tracking-[0.2em] outline-none cursor-none text-black hover:text-gray-500 transition-colors"
              >
                <span>Explore the curation</span>
                <span className="transition-transform duration-500 group-hover:translate-x-4">→</span>
              </button>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="max-w-2xl mt-32 cursor-none">
            <h2 className="text-4xl font-bold tracking-tight mb-8 cursor-none">About Us</h2>
            
            <p className="text-lg leading-relaxed text-gray-600 mb-6 cursor-none">
              넘쳐나는 정보와 빠르게 변화하는 트렌드 속에서, 우리는 아직 온전한 취향을 발견하지 못한 이들을 위해 존재합니다. 가격이나 불필요한 이슈 등 편견에 구애받지 않고 오직 제품만을 통해 우리의 시각을 제안하는 <strong>큐레이션 플랫폼</strong>입니다.
            </p>
            
            <p className="text-lg leading-relaxed text-gray-600 mb-6 cursor-none">
              취향이라는 것은 오직 한가지 스타일에만 매몰되지 않아도 된다고 생각합니다.<br />
              한 사람을 한가지 단어로 정의할 수 없듯이, 우리는 패션에 있어서도 하나의 스타일만을 고집하지 않고 다양한 시도를 해보는 것을 제안합니다.
            </p>
            
            <p className="text-lg leading-relaxed text-gray-600 cursor-none">
              <strong>개인의 짙은 취향이, 타인의 새로운 경험이 되기까지의 여정을 함께합니다.</strong>
            </p>
          </div>
        );

      case 'brands':
        return (
          <div className="mt-32 cursor-none">
            <h2 className="text-3xl font-bold tracking-tight mb-12">Brands</h2>
            <ul className="flex flex-col gap-6 text-4xl font-medium tracking-tighter cursor-none">
              {availableBrands.map(brand => (
                <li key={brand}>
                  <button 
                    onClick={() => { setSelectedBrand(brand); setSelectedCategory('All'); setCurrentView('brandDetail'); }} 
                    className="hover:text-gray-400 transition cursor-none text-left outline-none"
                  >
                    {brand}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );

      case 'brandDetail':
        const filteredByBrand = products.filter(p => p.brand === selectedBrand);
        const finallyFiltered = selectedCategory === 'All' ? filteredByBrand : filteredByBrand.filter(p => p.category === selectedCategory);
        const sortedBrandProducts = getSortedProducts(finallyFiltered);
        return (
          <div className="mt-32 w-full cursor-none">
            <div className="flex justify-between items-center mb-8 cursor-none">
              <h2 className="text-5xl font-bold tracking-tighter cursor-none">{selectedBrand}</h2>
              <button 
                onClick={(e) => toggleFavoriteBrand(e, selectedBrand)}
                className="outline-none cursor-none flex items-center justify-center"
              >
                <Heart strokeWidth={1.5} className={`w-7 h-7 transition-transform hover:scale-125 cursor-none ${favoriteBrands.includes(selectedBrand) ? 'fill-black text-black' : 'text-gray-300 hover:text-black'}`} />
              </button>
            </div>
            
            <div className="flex justify-between items-end border-b border-gray-200 pb-4 mb-8 cursor-none">
              <div className="flex gap-6 text-sm font-semibold text-gray-400 cursor-none">
                <button onClick={() => setSelectedCategory('All')} className={`${selectedCategory === 'All' ? 'text-black' : 'hover:text-black'} transition cursor-none outline-none`}>All</button>
                {categories.slice(1).map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={`${selectedCategory === cat ? 'text-black' : 'hover:text-black'} transition cursor-none outline-none`}>{cat}</button>
                ))}
              </div>
              
              <div className="flex flex-col items-end gap-3 cursor-none">
                {renderSortDropdown()}
              </div>
            </div>
            {renderProductGrid(sortedBrandProducts)}
            {sortedBrandProducts.length === 0 && <p className="text-gray-400 mt-10 cursor-none">해당 카테고리에 등록된 상품이 없습니다.</p>}
          </div>
        );
      
      case 'category':
        let filteredByCategory = selectedCategory === 'All' ? products : products.filter(p => p.category === selectedCategory);
        if (selectedCategory !== 'All' && selectedSubCategory !== 'All') {
          filteredByCategory = filteredByCategory.filter(p => p.subcategory === selectedSubCategory);
        }
        const currentSubCats = subCategoriesMap[selectedCategory] || [];
        const sortedCategoryProducts = getSortedProducts(filteredByCategory);

        return (
          <div className="mt-32 w-full cursor-none">
            <h2 className="text-5xl font-bold tracking-tighter mb-8 cursor-none">{selectedCategory}</h2>
            <div className="flex justify-between items-end border-b border-gray-200 pb-4 mb-8 min-h-[2.5rem] cursor-none">
              <div className="flex gap-6 text-sm font-semibold text-gray-400 cursor-none">
                {selectedCategory === 'All' ? (
                  <>
                    <button onClick={() => setSelectedCategory('All')} className="text-black transition cursor-none outline-none">All</button>
                    {categories.slice(1).map(cat => (
                      <button 
                        key={cat} 
                        onClick={() => { setSelectedCategory(cat); setSelectedSubCategory('All'); }} 
                        className="hover:text-black transition cursor-none outline-none"
                      >
                        {cat}
                      </button>
                    ))}
                  </>
                ) : (
                  currentSubCats.length > 0 && currentSubCats.map(sub => (
                    <button 
                      key={sub} 
                      onClick={() => setSelectedSubCategory(sub)} 
                      className={`${selectedSubCategory === sub ? 'text-black' : 'hover:text-black'} transition cursor-none outline-none`}
                    >
                      {sub}
                    </button>
                  ))
                )}
              </div>
              {renderSortDropdown()}
            </div>
            {renderProductGrid(sortedCategoryProducts)}
            {sortedCategoryProducts.length === 0 && <p className="text-gray-400 mt-10 cursor-none">해당 카테고리에 등록된 상품이 없습니다.</p>}
          </div>
        );

      case 'search':
        const sortedSearchProducts = getSortedProducts(searchedProducts);
        return (
          <div className="mt-32 w-full cursor-none">
            <div className="flex justify-between items-end border-b border-gray-200 pb-4 mb-8 cursor-none">
              <h2 className="text-5xl font-bold tracking-tighter cursor-none">SEARCH</h2>
              {renderSortDropdown()}
            </div>
            {renderProductGrid(sortedSearchProducts)}
            {sortedSearchProducts.length === 0 && <p className="text-gray-400 mt-10 cursor-none">검색 결과가 없습니다.</p>}
          </div>
        );

      case 'mypage':
        return (
          <div className="mt-32 w-full max-w-4xl cursor-none">
            <h2 className="text-3xl font-bold tracking-tight mb-12 cursor-none">My Page</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 cursor-none">
              
              <div className="border p-6 flex flex-col items-center justify-center text-center h-full min-h-[200px] cursor-none">
                <div className="w-20 h-20 bg-gray-200 rounded-full mb-4 flex items-center justify-center cursor-none"><User className="text-gray-500 w-8 h-8 cursor-none"/></div>
                <h3 className="font-bold text-lg mb-1 cursor-none">{currentUser ? currentUser.user_metadata?.name : 'Guest'} 님</h3>
                <p className="text-xs text-gray-500 cursor-none">{currentUser ? currentUser.email : '로그인이 필요합니다.'}</p>
              </div>
              
              <button 
                onClick={() => { setCurrentView('liked'); setLikedTab('products'); }} 
                className="border p-6 hover:bg-gray-50 transition cursor-none outline-none flex flex-col justify-center items-center text-center h-full min-h-[200px]"
              >
                <Heart className="mb-4 text-black w-8 h-8 fill-black cursor-none" />
                <div className="cursor-none">
                  <h4 className="font-bold text-lg cursor-none">Liked</h4>
                  <p className="text-sm text-gray-500 mt-2 cursor-none">Product / Brands </p>
                </div>
              </button>

            </div>
          </div>
        );

      case 'liked':
        const wishlistProds = products.filter(p => likedProductIds.includes(p.id));
        const sortedWishlistProds = getSortedProducts(wishlistProds);
        
        return (
          <div className="mt-32 w-full cursor-none">
            <h2 className="text-5xl font-bold tracking-tighter mb-12 cursor-none">LIKED</h2>
            
            <div className="flex gap-8 text-2xl font-bold tracking-tighter mb-8 border-b border-gray-200 pb-4 cursor-none">
              <button 
                onClick={() => setLikedTab('products')} 
                className={`flex gap-2 items-center transition cursor-none outline-none ${likedTab === 'products' ? 'text-black' : 'text-gray-300 hover:text-black'}`}
              >
                <span className="cursor-none">Product</span>
              </button>
              <button 
                onClick={() => setLikedTab('brands')} 
                className={`flex gap-2 items-center transition cursor-none outline-none ${likedTab === 'brands' ? 'text-black' : 'text-gray-300 hover:text-black'}`}
              >
                <span className="cursor-none">Brand</span>
              </button>
            </div>

            {likedTab === 'products' && (
              <>
                <div className="flex justify-end mb-8 cursor-none">
                  {renderSortDropdown()}
                </div>
                {renderProductGrid(sortedWishlistProds)}
                {sortedWishlistProds.length === 0 && (
                  <div className="text-center py-20 cursor-none">
                    <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4 cursor-none" />
                    <p className="text-gray-400 font-medium cursor-none">좋아요 누른 상품이 없습니다.</p>
                  </div>
                )}
              </>
            )}

            {likedTab === 'brands' && (
              <>
                <ul className="flex flex-col gap-6 text-4xl font-medium tracking-tighter mt-8 cursor-none">
                  {favoriteBrands.map(brand => (
                    <li key={brand} className="flex items-center justify-between group border-b border-gray-50 pb-6 cursor-none">
                      <button 
                        onClick={() => { setSelectedBrand(brand); setSelectedCategory('All'); setCurrentView('brandDetail'); }} 
                        className="hover:text-gray-400 transition cursor-none text-left outline-none"
                      >
                        {brand}
                      </button>
                      <button 
                        onClick={(e) => toggleFavoriteBrand(e, brand)}
                        className="outline-none cursor-none"
                      >
                        <Heart strokeWidth={1.5} className="w-6 h-6 fill-black text-black hover:scale-125 transition-transform cursor-none" />
                      </button>
                    </li>
                  ))}
                </ul>
                {favoriteBrands.length === 0 && (
                  <div className="text-center py-20 cursor-none">
                    <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4 cursor-none" />
                    <p className="text-gray-400 font-medium cursor-none">좋아요 누른 브랜드가 없습니다.</p>
                  </div>
                )}
              </>
            )}
          </div>
        );

      case 'customer':
        return (
          <div className="mt-32 w-full cursor-none">
            {/* mb-8을 mb-4로 줄여 제목과 설명글 사이 간격을 ASP 화면과 동일하게 맞춤 */}
            <h2 className="text-5xl font-bold tracking-tighter mb-4 cursor-none">STYLING Q&A</h2>
            <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-8 cursor-none">
              <div className="cursor-none">
                <p className="text-sm text-gray-500 font-medium cursor-none">DE:SELECT 큐레이션 제품에 대한 스타일링 팁을 제안해 드립니다.</p>
              </div>
              <button 
                onClick={() => {
                  if (!currentUser) {
                    alert("로그인이 필요한 기능입니다.");
                    setIsAuthModalOpen(true);
                    return;
                  }
                  setCurrentView('qnaWrite');
                }}
                className="px-6 py-2 bg-black text-white text-xs font-bold tracking-widest hover:scale-105 transition-transform cursor-none outline-none"
              >
                WRITE
              </button>
            </div>

            <div className="flex flex-col cursor-none">
              {qnaList.map(qna => {
                const product = products.find(p => p.id === qna.productId);
                return (
                  <button 
                    key={qna.id} 
                    onClick={() => { 
                      setSelectedQna(qna); 
                      setIsEditingReply(false);
                      setCurrentView('qnaDetail'); 
                    }}
                    className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-gray-100 hover:bg-gray-50 transition cursor-none outline-none text-left gap-4"
                  >
                    <div className="flex items-center gap-6 flex-1 cursor-none">
                      <span className={`min-w-[80px] text-center text-[10px] font-bold tracking-widest px-2 py-1 cursor-none ${qna.reply ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {qna.reply ? '답변완료' : '답변대기'}
                      </span>
                      <div className="flex flex-col cursor-none">
                        <span className="text-xs text-gray-400 font-mono uppercase mb-1 cursor-none">{product?.brand}</span>
                        <h4 className="font-bold text-lg cursor-none">{qna.title}</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-400 font-medium min-w-fit cursor-none">
                      <span className="cursor-none">{qna.author}</span>
                      <span className="cursor-none">{qna.createdAt}</span>
                    </div>
                  </button>
                );
              })}

              {qnaList.length === 0 && (
                <div className="text-center py-32 cursor-none">
                  <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4 cursor-none" />
                  <p className="text-gray-400 font-medium cursor-none">등록된 문의가 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'qnaWrite':
        return (
          <div className="mt-32 w-full max-w-4xl mx-auto cursor-none">
            <h2 className="text-4xl font-bold tracking-tighter mb-8 border-b border-gray-200 pb-4 cursor-none">ASK STYLING</h2>
            
            <form onSubmit={handleQnaSubmit} className="flex flex-col gap-10 cursor-none">
              
              <div className="flex flex-col gap-4 cursor-none">
                <label className="font-bold text-sm tracking-widest cursor-none">1. 스타일링이 궁금한 제품을 선택해주세요.</label>
                
                <input 
                  type="text"
                  placeholder="브랜드명 또는 제품명으로 검색"
                  value={qnaProductSearch}
                  onChange={(e) => setQnaProductSearch(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 p-3 text-sm focus:border-black outline-none transition-colors cursor-none mb-2 rounded-sm"
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-64 overflow-y-auto p-4 border border-gray-200 bg-gray-50 rounded-sm cursor-none">
                  {products
                    .filter(p => 
                      p.name.toLowerCase().includes(qnaProductSearch.toLowerCase()) || 
                      p.brand.toLowerCase().includes(qnaProductSearch.toLowerCase())
                    )
                    .map(product => (
                    <button
                      type="button"
                      key={product.id}
                      onClick={() => setQnaForm({...qnaForm, productId: product.id})}
                      className={`flex flex-col p-2 bg-white border transition-all cursor-none outline-none ${qnaForm.productId === product.id ? 'border-black shadow-md scale-[1.02]' : 'border-gray-100 hover:border-gray-300'}`}
                    >
                      <div className="aspect-[4/5] w-full bg-gray-100 mb-2 cursor-none">
                        <img src={product.img} alt={product.name} className="w-full h-full object-contain cursor-none" />
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono uppercase line-clamp-1 text-left w-full cursor-none">{product.brand}</span>
                      <span className="text-xs font-bold line-clamp-1 text-left w-full mt-1 cursor-none">{product.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 cursor-none">
                <label className="font-bold text-sm tracking-widest cursor-none">2. 제목</label>
                <input 
                  type="text" 
                  placeholder="제목을 입력해주세요."
                  value={qnaForm.title}
                  onChange={(e) => setQnaForm({...qnaForm, title: e.target.value})}
                  className="w-full border-b border-gray-300 focus:border-black outline-none pb-2 text-sm transition-colors bg-transparent placeholder-gray-400 cursor-none"
                />
              </div>

              <div className="flex flex-col gap-4 cursor-none">
                <label className="font-bold text-sm tracking-widest cursor-none">3. 문의 내용</label>
                <textarea 
                  placeholder="키, 체형, 평소 즐겨입는 스타일 등을 적어주시면 더욱 디테일한 스타일링 팁을 제안해 드립니다."
                  value={qnaForm.content}
                  onChange={(e) => setQnaForm({...qnaForm, content: e.target.value})}
                  rows={6}
                  className="w-full border border-gray-300 focus:border-black outline-none p-4 text-sm transition-colors bg-transparent placeholder-gray-400 cursor-none resize-none rounded-sm"
                />
              </div>

              <div className="flex gap-4 justify-end mt-4 cursor-none">
                <button 
                  type="button" 
                  onClick={() => { 
                    setCurrentView('customer'); 
                    setQnaForm({ productId: '', title: '', content: '' }); 
                    setQnaProductSearch(''); 
                  }}
                  className="px-8 py-4 bg-white text-gray-500 border border-gray-200 text-sm font-bold tracking-widest hover:bg-gray-50 transition-colors cursor-none outline-none"
                >
                  CANCEL
                </button>
                <button 
                  type="submit" 
                  className="px-8 py-4 bg-black text-white text-sm font-bold tracking-widest hover:scale-105 transition-transform cursor-none outline-none"
                >
                  SUBMIT
                </button>
              </div>
            </form>
          </div>
        );

      case 'qnaDetail':
        if (!selectedQna) return null;
        const qnaProduct = products.find(p => p.id === selectedQna.productId);

        return (
          <div className="mt-32 w-full max-w-4xl mx-auto cursor-none">
            <div className="flex justify-between items-center mb-8 cursor-none">
              <button 
                onClick={() => { 
                  setCurrentView('customer'); 
                  setSelectedQna(null); 
                  setIsEditingReply(false);
                  setAdminReply('');
                }}
                className="text-sm font-bold text-gray-400 hover:text-black transition-colors cursor-none outline-none tracking-widest uppercase"
              >
                ← Back to List
              </button>

              {isAdmin && (
                <button 
                  onClick={() => handleDeleteQna(selectedQna.id)}
                  className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors cursor-none outline-none tracking-widest uppercase"
                >
                  DELETE POST
                </button>
              )}
            </div>
            
            <h2 className="text-3xl font-bold tracking-tight mb-8 cursor-none">{selectedQna.title}</h2>
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-8 cursor-none">
              <div className="flex gap-6 text-sm font-medium text-gray-500 cursor-none">
                <span className="cursor-none">{selectedQna.author}</span>
                <span className="cursor-none">{selectedQna.createdAt}</span>
              </div>
            </div>

            {qnaProduct && (
              <div className="flex items-center gap-6 p-6 bg-gray-50 border border-gray-100 mb-12 rounded-sm cursor-none hover:border-gray-300 transition-colors" onClick={() => { setSelectedBrand(qnaProduct.brand); setSelectedCategory('All'); setCurrentView('brandDetail'); }}>
                <div className="w-24 h-32 bg-white cursor-none">
                  <img src={qnaProduct.img} alt={qnaProduct.name} className="w-full h-full object-contain cursor-none" />
                </div>
                <div className="flex flex-col cursor-none">
                  <span className="text-xs text-gray-500 font-mono uppercase mb-2 cursor-none">{qnaProduct.brand}</span>
                  <span className="text-lg font-bold mb-1 cursor-none">{qnaProduct.name}</span>
                  <span className="text-sm font-bold text-gray-600 cursor-none">{qnaProduct.price}</span>
                </div>
              </div>
            )}

            <div className="min-h-[150px] text-lg leading-relaxed text-gray-800 whitespace-pre-wrap mb-16 cursor-none">
              {selectedQna.content}
            </div>

            <div className="bg-gray-50 p-8 rounded-sm border border-gray-100 mb-12 cursor-none">
              <h4 className="text-sm font-bold tracking-widest mb-6 flex items-center gap-2 cursor-none">
                <MessageSquare className="w-4 h-4 cursor-none" /> 
                DE:SELECT STYLING TIP
              </h4>
              
              {selectedQna.reply && !isEditingReply ? (
                <div className="cursor-none">
                  <p className="text-base leading-relaxed text-gray-700 whitespace-pre-wrap cursor-none">{selectedQna.reply}</p>
                  
                  {isAdmin && (
                    <div className="flex gap-4 justify-end mt-6 border-t border-gray-100 pt-4 cursor-none">
                      <button 
                        onClick={() => { setAdminReply(selectedQna.reply); setIsEditingReply(true); }} 
                        className="text-xs font-bold text-gray-400 hover:text-black transition-colors cursor-none outline-none tracking-widest uppercase"
                      >
                        EDIT REPLY
                      </button>
                      <button 
                        onClick={handleDeleteReply} 
                        className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors cursor-none outline-none tracking-widest uppercase"
                      >
                        DELETE REPLY
                      </button>
                    </div>
                  )}
                </div>
              ) : isAdmin ? (
                <form onSubmit={handleAdminReply} className="flex flex-col gap-4 cursor-none">
                  <textarea 
                    placeholder="운영자님, 이 제품에 대한 스타일링 팁을 작성해주세요."
                    value={adminReply}
                    onChange={(e) => setAdminReply(e.target.value)}
                    rows={5}
                    className="w-full border border-gray-300 focus:border-black outline-none p-4 text-sm transition-colors bg-white cursor-none resize-none rounded-sm"
                  />
                  <div className="flex justify-end gap-4 cursor-none">
                    {isEditingReply && (
                      <button 
                        type="button" 
                        onClick={() => { setIsEditingReply(false); setAdminReply(''); }} 
                        className="px-6 py-3 bg-white text-gray-500 border border-gray-200 text-xs font-bold tracking-widest hover:bg-gray-50 transition-colors cursor-none outline-none"
                      >
                        취소
                      </button>
                    )}
                    <button type="submit" className="px-6 py-3 bg-black text-white text-xs font-bold tracking-widest hover:scale-105 transition-transform cursor-none outline-none">
                      {isEditingReply ? '수정 완료' : '답변 등록'}
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-gray-400 text-sm font-medium cursor-none">DE:SELECT의 스타일링 팁이 준비 중입니다.</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex cursor-none selection:bg-black selection:text-white overflow-hidden">
      
      {isAuthModalOpen && (
        <div 
          className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity cursor-none"
          onClick={() => setIsAuthModalOpen(false)} 
        >
          <div 
            className="bg-white p-10 w-full max-w-sm relative shadow-2xl border border-gray-200 cursor-none"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsAuthModalOpen(false)} 
              className="absolute top-5 right-5 text-gray-400 hover:text-black transition cursor-none outline-none"
            >
              <X className="w-5 h-5 cursor-none" />
            </button>
            
            <div className="mb-10 text-left cursor-none">
              <h3 className="text-3xl font-bold tracking-tighter leading-snug cursor-none">
                {authMode === 'login' ? 'LOGIN' : 'JOIN US'}
              </h3>
            </div>

            {authError && (
              <p className="text-red-500 text-xs font-bold mb-6 bg-red-50 p-3 rounded-sm cursor-none">{authError}</p>
            )}
            
            <form onSubmit={handleAuthSubmit} className="flex flex-col gap-6 cursor-none">
              <input 
                type="email" 
                placeholder="Email" 
                value={authForm.email}
                onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                className="w-full border-b border-gray-300 focus:border-black outline-none pb-2 text-sm transition-colors bg-transparent placeholder-gray-400 cursor-none"
              />
              
              {authMode === 'signup' && (
                <input 
                  type="text" 
                  placeholder="Name" 
                  value={authForm.name}
                  onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                  className="w-full border-b border-gray-300 focus:border-black outline-none pb-2 text-sm transition-colors bg-transparent placeholder-gray-400 cursor-none"
                />
              )}

              <div className="relative w-full cursor-none">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  value={authForm.password}
                  onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                  className="w-full border-b border-gray-300 focus:border-black none pb-2 text-sm transition-colors bg-transparent placeholder-gray-400 cursor-none pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-2 text-gray-400 hover:text-black transition-colors cursor-none outline-none"
                >
                  {showPassword ? <Eye className="w-4 h-4 cursor-none" /> : <EyeOff className="w-4 h-4 cursor-none" />}
                </button>
              </div>

              <button 
                type="submit" 
                className="w-full py-4 mt-4 bg-black text-white text-sm font-bold tracking-widest hover:scale-[1.02] hover:shadow-lg transition-all duration-300 cursor-none outline-none"
              >
                {authMode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
              </button>
            </form>

            <div className="mt-8 text-center text-xs font-bold tracking-widest text-gray-400 cursor-none">
              <button 
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'signup' : 'login');
                  setAuthError('');
                  setAuthForm({ email: '', password: '', name: '' });
                  setShowPassword(false);
                }}
                className="hover:text-black transition cursor-none outline-none uppercase"
              >
                {authMode === 'login' ? 'Create an account' : 'Already have an account?'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isLogoutModalOpen && (
        <div 
          className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity cursor-none"
          onClick={() => setIsLogoutModalOpen(false)} 
        >
          <div 
            className="bg-white p-8 w-full max-w-xs relative shadow-2xl border border-gray-200 cursor-none"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsLogoutModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition cursor-none outline-none"
            >
              <X className="w-5 h-5 cursor-none" />
            </button>
            
            <div className="mb-8 text-left cursor-none">
              <h3 className="text-2xl font-bold tracking-tighter leading-snug cursor-none">
                Do you want <br /> to logout?
              </h3>
            </div>
            
            <div className="flex flex-col gap-3 cursor-none">
              <button 
                onClick={confirmLogout} 
                className="w-full py-4 bg-black text-white text-sm font-bold tracking-widest hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-none outline-none"
              >
                CONTINUE
              </button>
              
              <button 
                onClick={() => setIsLogoutModalOpen(false)} 
                className="w-full py-4 bg-white text-gray-500 text-sm font-bold tracking-widest border border-gray-200 hover:bg-gray-50 hover:text-black transition-all duration-300 cursor-none outline-none"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity cursor-none"
          onClick={() => setIsModalOpen(false)} 
        >
          <div 
            className="bg-white p-8 w-full max-w-xs relative shadow-2xl border border-gray-200 cursor-none"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition cursor-none outline-none"
            >
              <X className="w-5 h-5 cursor-none" />
            </button>
            
            <div className="mb-8 text-left cursor-none">
              <h3 className="text-2xl font-bold tracking-tighter leading-snug cursor-none">
                Redirecting to the <br /> official brand store.
              </h3>
              <p className="text-sm text-gray-500 mt-3 cursor-none">Opens in a new tab.</p>
            </div>
            
            <div className="flex flex-col gap-3 cursor-none">
              <button 
                onClick={() => {
                  window.open(targetLink, '_blank', 'noopener,noreferrer');
                  setIsModalOpen(false);
                }} 
                className="w-full py-4 bg-black text-white text-sm font-bold tracking-widest hover:scale-105 hover:shadow-lg transition-all duration-300 flex justify-between items-center px-6 cursor-none outline-none"
              >
                <span className="cursor-none">CONTINUE</span>
                <span className="cursor-none">→</span>
              </button>
              
              <button 
                onClick={() => {
                  window.open(targetLink, '_blank', 'noopener,noreferrer');
                  setIsModalOpen(false);
                }} 
                className="w-full py-4 bg-black text-white text-sm font-bold tracking-widest hover:scale-105 hover:shadow-lg transition-all duration-300 flex justify-between items-center px-6 cursor-none outline-none"
              >
                <span className="cursor-none">CONTINUE</span>
                <span className="cursor-none">→</span>
              </button>
              
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-full py-4 bg-white text-gray-500 text-sm font-bold tracking-widest border border-gray-200 hover:bg-gray-50 hover:text-black transition-all duration-300 cursor-none outline-none"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full z-[9999] pointer-events-none mix-blend-difference cursor-none" style={{ transform: `translate(${mousePos.x - 4}px, ${mousePos.y - 4}px)` }} />
      <div className="fixed top-0 left-0 w-8 h-8 bg-white rounded-full z-[9998] pointer-events-none mix-blend-difference transition-transform duration-150 ease-out cursor-none" style={{ transform: `translate(${mousePos.x - 16}px, ${mousePos.y - 16}px)` }} />

      <aside className="hidden md:flex w-64 fixed h-screen p-10 flex-col justify-between z-50 border-r border-gray-100 bg-white cursor-none">
        <div className="cursor-none">
          <h1 onClick={() => { setCurrentView('home'); setIsProductMenuOpen(false); setSelectedBrand(''); setSelectedCategory('All'); setSelectedSubCategory('All'); setIsSearchOpen(false); }} className="text-3xl font-bold mb-16 tracking-tight cursor-none hover:text-gray-400 transition outline-none">DE:SELECT</h1>
          <nav className="flex flex-col gap-4 font-semibold text-lg tracking-tight cursor-none">
            <button onClick={() => { setCurrentView('brands'); setIsProductMenuOpen(false); }} className={`text-left cursor-none transition outline-none ${currentView === 'brands' ? 'text-gray-400' : 'text-black hover:text-gray-400'}`}>Brands</button>
            <div className="cursor-none">
              <button onClick={() => setIsProductMenuOpen(!isProductMenuOpen)} className="flex items-center justify-between w-full cursor-none transition text-black hover:text-gray-400 outline-none"><span className="cursor-none">Product</span></button>
              <div className={`grid transition-all duration-300 ease-in-out cursor-none ${isProductMenuOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                <div className="overflow-hidden flex flex-col gap-3 ml-4 text-sm font-medium cursor-none">
                  {categories.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => { 
                        setSelectedCategory(cat); 
                        setSelectedSubCategory('All'); 
                        setCurrentView('category'); 
                      }} 
                      className={`text-left cursor-none transition outline-none ${selectedCategory === cat && currentView === 'category' ? 'text-gray-400' : 'text-black hover:text-gray-400'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => { setCurrentView('about'); setIsProductMenuOpen(false); }} className={`text-left cursor-none transition outline-none ${currentView === 'about' ? 'text-gray-400' : 'text-black hover:text-gray-400'}`}>About Us</button>
            <button onClick={() => { setCurrentView('customer'); setIsProductMenuOpen(false); }} className={`text-left transition outline-none ${currentView === 'customer' ? 'text-gray-400' : 'text-black hover:text-gray-400'}`}>STYLING Q&A</button>
            
            <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-gray-100 cursor-none">
              <button 
                onClick={() => { 
                  if (!currentUser) {
                    alert("로그인이 필요한 기능입니다.");
                    setIsAuthModalOpen(true);
                    return;
                  }
                  setCurrentView('mypage'); 
                  setIsProductMenuOpen(false); 
                }} 
                className={`text-left cursor-none transition outline-none ${currentView === 'mypage' ? 'text-gray-400' : 'text-black hover:text-gray-400'}`}
              >
                My Page
              </button>
            </div>
          </nav>
        </div>
        
        <div className="flex items-center gap-3 cursor-none">
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="outline-none cursor-none">
            <Search className="w-5 h-5 cursor-none text-black hover:text-gray-400 transition outline-none" />
          </button>
          {isSearchOpen && (
            <form onSubmit={handleSearch} className="flex-1 cursor-none">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full border-b border-black outline-none bg-transparent text-sm pb-1 font-medium cursor-none focus:outline-none"
                autoFocus
              />
            </form>
          )}
        </div>
      </aside>

      <main ref={mainRef} className="md:ml-64 w-full h-screen overflow-y-auto flex flex-col p-10 relative scroll-smooth cursor-none">
        
        {currentUser ? (
          <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className="absolute top-10 right-10 font-bold text-sm z-50 tracking-tight cursor-none text-black hover:text-gray-400 transition border-b border-black hover:border-gray-400 pb-1 outline-none uppercase"
          >
            LOGOUT
          </button>
        ) : (
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="absolute top-10 right-10 font-bold text-sm z-50 tracking-tight cursor-none text-black hover:text-gray-400 transition border-b border-black hover:border-gray-400 pb-1 outline-none uppercase"
          >
            LOGIN / JOIN
          </button>
        )}
        
        <div className="flex-1 cursor-none">{renderContent()}</div>
        
        <footer className="mt-32 pt-8 border-t border-black flex flex-col md:flex-row justify-between items-end pb-12 cursor-none">
          <div className="mb-6 md:mb-0 cursor-none">
            <p className="text-xl font-bold tracking-tighter text-black mb-1 cursor-none">DE:SELECT</p>
            <p className="text-xs text-gray-500 font-medium tracking-tight cursor-none">The New Standard of Curation.</p>
          </div>
          
          <div className="flex items-center gap-6 text-xs font-mono uppercase tracking-widest text-gray-400 cursor-none">
            <button className="hover:text-black transition cursor-none outline-none">INSTAGRAM</button>
            <span className="cursor-none">/</span>
            <button className="hover:text-black transition cursor-none outline-none">TERMS</button>
            <span className="cursor-none">/</span>
            <span className="cursor-none">© 2026</span>
          </div>
        </footer>
      </main>
    </div>
  );
}