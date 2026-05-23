import { useEffect, useRef, useState } from 'react';
import { supabase } from './supabase';
import { AuthModal } from './components/Auth/AuthModal';
import { Cursor } from './components/Layout/Cursor';
import { Footer } from './components/Layout/Footer';
import { MobileHeader } from './components/Layout/MobileHeader';
import { Sidebar } from './components/Layout/Sidebar';
import { UserActions } from './components/Layout/UserActions';
import { ConfirmModal } from './components/Modal/ConfirmModal';
import { About } from './pages/About';
import { Brands } from './pages/Brands';
import { BrandDetail } from './pages/BrandDetail';
import { Category } from './pages/Category';
import { Customer } from './pages/Customer';
import { Home } from './pages/Home';
import { Liked } from './pages/Liked';
import { MyPage } from './pages/MyPage';
import { QnaDetail } from './pages/QnaDetail';
import { QnaWrite } from './pages/QnaWrite';
import { SearchPage } from './pages/Search';
import { fetchUserRole } from './utils/admin';
import { validateSignUpForm } from './utils/validation';

const emptyQnaForm = { productId: '', title: '', content: '' };
const emptyAuthForm = { email: '', password: '', name: '' };

export default function App() {
  const [products, setProducts] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mainRef = useRef(null);

  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || sessionStorage.getItem('currentView') || 'home';
  });
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(() => sessionStorage.getItem('isProductMenuOpen') === 'true');
  const [selectedBrand, setSelectedBrand] = useState(() => sessionStorage.getItem('selectedBrand') || '');
  const [selectedCategory, setSelectedCategory] = useState(() => sessionStorage.getItem('selectedCategory') || 'All');
  const [selectedSubCategory, setSelectedSubCategory] = useState(() => sessionStorage.getItem('selectedSubCategory') || 'All');
  const [searchedProducts, setSearchedProducts] = useState(() => {
    const saved = sessionStorage.getItem('searchedProducts');
    return saved ? JSON.parse(saved) : [];
  });

  const [likedTab, setLikedTab] = useState('products');
  const [likedProductIds, setLikedProductIds] = useState([]);
  const [favoriteBrands, setFavoriteBrands] = useState([]);
  const [qnaList, setQnaList] = useState([]);
  const [sortOption, setSortOption] = useState(() => sessionStorage.getItem('sortOption') || 'newest');
  const [brandSortOption, setBrandSortOption] = useState(() => sessionStorage.getItem('brandSortOption') || 'A-Z');
  const [qnaForm, setQnaForm] = useState(emptyQnaForm);
  const [selectedQna, setSelectedQna] = useState(null);
  const [adminReply, setAdminReply] = useState('');
  const [qnaProductSearch, setQnaProductSearch] = useState('');
  const [isEditingReply, setIsEditingReply] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetLink, setTargetLink] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState(emptyAuthForm);
  const [authError, setAuthError] = useState('');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function syncRole() {
      const role = await fetchUserRole(currentUser);
      if (isMounted) setIsAdmin(role === 'admin');
    }

    syncRole();
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  useEffect(() => {
    let isMounted = true;

    async function fetchUserPrefs() {
      if (currentUser) {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('email', currentUser.email)
          .maybeSingle();

        if (!isMounted) return;

        if (data && !error) {
          setLikedProductIds(data.liked_products || []);
          setFavoriteBrands(data.favorite_brands || []);
        } else {
          setLikedProductIds([]);
          setFavoriteBrands([]);
        }
        return;
      }

      if (!isMounted) return;
      setLikedProductIds([]);
      setFavoriteBrands([]);
    }

    fetchUserPrefs();
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTo(0, 0);
  }, [currentView, selectedBrand, selectedCategory, selectedSubCategory, likedTab, selectedQna]);

  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, '', `#${currentView}`);
    } else if (window.location.hash !== `#${currentView}`) {
      window.history.pushState(null, '', `#${currentView}`);
    }

    sessionStorage.setItem('currentView', currentView);
    sessionStorage.setItem('isProductMenuOpen', isProductMenuOpen);
    sessionStorage.setItem('selectedBrand', selectedBrand);
    sessionStorage.setItem('selectedCategory', selectedCategory);
    sessionStorage.setItem('selectedSubCategory', selectedSubCategory);
    sessionStorage.setItem('searchedProducts', JSON.stringify(searchedProducts));
    sessionStorage.setItem('sortOption', sortOption);
    sessionStorage.setItem('brandSortOption', brandSortOption);
  }, [currentView, isProductMenuOpen, selectedBrand, selectedCategory, selectedSubCategory, searchedProducts, sortOption, brandSortOption]);

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      setCurrentView(hash);
      setIsMobileMenuOpen(false);
      setIsModalOpen(false);
      setIsAuthModalOpen(false);
      setIsLogoutModalOpen(false);
      setIsSearchOpen(false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
    async function fetchData() {
      const [productsRes, qnaRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('qna').select('*').order('created_at', { ascending: false }),
      ]);

      if (!productsRes.error) {
        setProducts(productsRes.data);
        setAvailableBrands([...new Set(productsRes.data.map((p) => p.brand))]);
      }

      if (!qnaRes.error) setQnaList(qnaRes.data);
      setIsLoading(false);
    }

    fetchData();
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => setMousePos({ x: event.clientX, y: event.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const resetToHome = () => {
    setCurrentView('home');
    setIsProductMenuOpen(false);
    setSelectedBrand('');
    setSelectedCategory('All');
    setSelectedSubCategory('All');
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  const selectBrand = (brand) => {
    setSelectedBrand(brand);
    setSelectedCategory('All');
    setCurrentView('brandDetail');
    setIsMobileMenuOpen(false);
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setSelectedSubCategory('All');
    setCurrentView('category');
    setIsMobileMenuOpen(false);
  };

  const savePreferencesToDB = async (newProducts, newBrands) => {
    if (!currentUser) return;

    const { data } = await supabase.from('user_preferences').select('id').eq('email', currentUser.email).maybeSingle();

    if (data) {
      await supabase.from('user_preferences').update({ liked_products: newProducts, favorite_brands: newBrands }).eq('id', data.id);
    } else {
      await supabase.from('user_preferences').insert([{ email: currentUser.email, liked_products: newProducts, favorite_brands: newBrands }]);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (authMode === 'signup') {
      const validationError = validateSignUpForm(authForm);
      if (validationError) {
        setAuthError(validationError);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: authForm.email,
        password: authForm.password,
        options: { data: { name: authForm.name } },
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
        setAuthForm(emptyAuthForm);
      }
    }
  };

  const confirmLogout = async () => {
    await supabase.auth.signOut();
    setIsLogoutModalOpen(false);
    setCurrentView('home');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();
    const matchedBrand = availableBrands.find((b) => b.toLowerCase() === query);
    if (matchedBrand) {
      selectBrand(matchedBrand);
      setIsSearchOpen(false);
      setSearchQuery('');
      return;
    }

    let matchedProducts = products.filter((p) => p.name.toLowerCase() === query);
    if (matchedProducts.length === 0) {
      matchedProducts = products.filter((p) => p.name.toLowerCase().includes(query));
    }

    setSearchedProducts(matchedProducts);
    setCurrentView('search');
    setIsSearchOpen(false);
    setSearchQuery('');
    setIsMobileMenuOpen(false);
  };

  const handleProductClick = (e, link) => {
    e.preventDefault();
    setTargetLink(link);
    setIsModalOpen(true);
  };

  const toggleLike = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      alert('로그인이 필요한 기능입니다.');
      setIsAuthModalOpen(true);
      return;
    }

    const newLikedProducts = likedProductIds.includes(productId)
      ? likedProductIds.filter((id) => id !== productId)
      : [...likedProductIds, productId];

    setLikedProductIds(newLikedProducts);
    await savePreferencesToDB(newLikedProducts, favoriteBrands);
  };

  const toggleFavoriteBrand = async (e, brandName) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      alert('로그인이 필요한 기능입니다.');
      setIsAuthModalOpen(true);
      return;
    }

    const newFavoriteBrands = favoriteBrands.includes(brandName)
      ? favoriteBrands.filter((b) => b !== brandName)
      : [...favoriteBrands, brandName];

    setFavoriteBrands(newFavoriteBrands);
    await savePreferencesToDB(likedProductIds, newFavoriteBrands);
  };

  const handleQnaSubmit = async (e) => {
    e.preventDefault();
    if (!qnaForm.productId) return alert('스타일링이 궁금한 제품을 선택해주세요.');
    if (!qnaForm.title.trim() || !qnaForm.content.trim()) return alert('제목과 내용을 모두 입력해주세요.');

    const newQnaData = {
      author: currentUser.user_metadata?.name || 'Guest',
      email: currentUser.email,
      product_id: qnaForm.productId,
      title: qnaForm.title,
      content: qnaForm.content,
    };

    const { data, error } = await supabase.from('qna').insert([newQnaData]).select();

    if (!error && data) {
      setQnaList([data[0], ...qnaList]);
      setQnaForm(emptyQnaForm);
      setQnaProductSearch('');
      setCurrentView('customer');
    } else {
      alert('문의 등록 중 오류가 발생했습니다.');
    }
  };

  const handleAdminReply = async (e) => {
    e.preventDefault();
    if (!adminReply.trim()) return;

    const { error } = await supabase.from('qna').update({ reply: adminReply }).eq('id', selectedQna.id);

    if (!error) {
      setQnaList(qnaList.map((q) => q.id === selectedQna.id ? { ...q, reply: adminReply } : q));
      setSelectedQna({ ...selectedQna, reply: adminReply });
      setAdminReply('');
      setIsEditingReply(false);
    }
  };

  const handleDeleteQna = async (id) => {
    if (window.confirm('이 문의글을 완전히 삭제하시겠습니까?')) {
      await supabase.from('qna').delete().eq('id', id);
      setQnaList(qnaList.filter((q) => q.id !== id));
      setSelectedQna(null);
      setCurrentView('customer');
    }
  };

  const handleDeleteReply = async (e) => {
    e.preventDefault();
    if (window.confirm('이 답변을 삭제하시겠습니까?')) {
      await supabase.from('qna').update({ reply: null }).eq('id', selectedQna.id);
      setQnaList(qnaList.map((q) => q.id === selectedQna.id ? { ...q, reply: null } : q));
      setSelectedQna({ ...selectedQna, reply: null });
      setIsEditingReply(false);
    }
  };

  const requireMyPage = () => {
    if (!currentUser) {
      alert('로그인이 필요한 기능입니다.');
      setIsAuthModalOpen(true);
      return;
    }
    setCurrentView('mypage');
    setIsProductMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const requireQnaWrite = () => {
    if (!currentUser) {
      alert('로그인이 필요한 기능입니다.');
      setIsAuthModalOpen(true);
      return;
    }
    setCurrentView('qnaWrite');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <Home onExplore={() => { selectCategory('All'); setIsProductMenuOpen(true); }} />;
      case 'about':
        return <About />;
      case 'brands':
        return <Brands availableBrands={availableBrands} brandSortOption={brandSortOption} onBrandSortChange={setBrandSortOption} onSelectBrand={selectBrand} />;
      case 'brandDetail':
        return <BrandDetail products={products} selectedBrand={selectedBrand} selectedCategory={selectedCategory} favoriteBrands={favoriteBrands} likedProductIds={likedProductIds} sortOption={sortOption} onSortChange={setSortOption} onSelectCategory={setSelectedCategory} onToggleFavoriteBrand={toggleFavoriteBrand} onProductClick={handleProductClick} onToggleLike={toggleLike} onSelectBrand={selectBrand} />;
      case 'category':
        return <Category products={products} selectedCategory={selectedCategory} selectedSubCategory={selectedSubCategory} likedProductIds={likedProductIds} sortOption={sortOption} onSelectCategory={selectCategory} onSelectSubCategory={setSelectedSubCategory} onSortChange={setSortOption} onProductClick={handleProductClick} onToggleLike={toggleLike} onSelectBrand={selectBrand} />;
      case 'search':
        return <SearchPage searchedProducts={searchedProducts} likedProductIds={likedProductIds} sortOption={sortOption} onSortChange={setSortOption} onProductClick={handleProductClick} onToggleLike={toggleLike} onSelectBrand={selectBrand} />;
      case 'mypage':
        return <MyPage currentUser={currentUser} onLiked={() => { setCurrentView('liked'); setLikedTab('products'); }} />;
      case 'liked':
        return <Liked products={products} likedProductIds={likedProductIds} favoriteBrands={favoriteBrands} likedTab={likedTab} sortOption={sortOption} onTabChange={setLikedTab} onSortChange={setSortOption} onProductClick={handleProductClick} onToggleLike={toggleLike} onToggleFavoriteBrand={toggleFavoriteBrand} onSelectBrand={selectBrand} />;
      case 'customer':
        return <Customer qnaList={qnaList} products={products} currentUser={currentUser} onRequireWrite={requireQnaWrite} onSelectQna={(qna) => { setSelectedQna(qna); setIsEditingReply(false); setCurrentView('qnaDetail'); }} />;
      case 'qnaWrite':
        return <QnaWrite products={products} qnaForm={qnaForm} qnaProductSearch={qnaProductSearch} onSubmit={handleQnaSubmit} onCancel={() => { setCurrentView('customer'); setQnaForm(emptyQnaForm); setQnaProductSearch(''); }} onFormChange={setQnaForm} onProductSearchChange={setQnaProductSearch} />;
      case 'qnaDetail':
        return <QnaDetail selectedQna={selectedQna} products={products} isAdmin={isAdmin} adminReply={adminReply} isEditingReply={isEditingReply} onBack={() => { setCurrentView('customer'); setSelectedQna(null); setIsEditingReply(false); setAdminReply(''); }} onDeleteQna={handleDeleteQna} onSelectProductBrand={selectBrand} onEditReply={(reply) => { setAdminReply(reply); setIsEditingReply(true); }} onDeleteReply={handleDeleteReply} onAdminReplyChange={setAdminReply} onAdminReplySubmit={handleAdminReply} onCancelEditReply={() => { setIsEditingReply(false); setAdminReply(''); }} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-white flex items-center justify-center font-bold text-2xl outline-none md:cursor-none">LOADING DE:SELECT...</div>;
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans flex select-none overflow-hidden md:cursor-none">
      <MobileHeader
        isSearchOpen={isSearchOpen}
        searchQuery={searchQuery}
        onOpenMenu={() => setIsMobileMenuOpen(true)}
        onHome={resetToHome}
        onOpenSearch={() => setIsSearchOpen(true)}
        onCloseSearch={() => setIsSearchOpen(false)}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearch}
      />

      {isAuthModalOpen && (
        <AuthModal
          authMode={authMode}
          authForm={authForm}
          authError={authError}
          showPassword={showPassword}
          onClose={() => setIsAuthModalOpen(false)}
          onSubmit={handleAuthSubmit}
          onAuthFormChange={setAuthForm}
          onToggleMode={() => {
            setAuthMode(authMode === 'login' ? 'signup' : 'login');
            setAuthError('');
            setAuthForm(emptyAuthForm);
            setShowPassword(false);
          }}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />
      )}

      {isLogoutModalOpen && (
        <ConfirmModal title={<>Do you want <br /> to logout?</>} onConfirm={confirmLogout} onClose={() => setIsLogoutModalOpen(false)} />
      )}

      {isModalOpen && (
        <ConfirmModal
          title={<>Redirecting to the <br /> official brand store.</>}
          description="Opens in a new tab."
          onConfirm={() => {
            window.open(targetLink, '_blank', 'noopener,noreferrer');
            setIsModalOpen(false);
          }}
          onClose={() => setIsModalOpen(false)}
          zIndex="z-[1000]"
          showArrow
        />
      )}

      <Cursor mousePos={mousePos} />

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/20 z-[95] backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <Sidebar
        currentView={currentView}
        currentUser={currentUser}
        isMobileMenuOpen={isMobileMenuOpen}
        isProductMenuOpen={isProductMenuOpen}
        isSearchOpen={isSearchOpen}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onCloseMenu={() => setIsMobileMenuOpen(false)}
        onHome={resetToHome}
        onNavigate={(view) => { setCurrentView(view); setIsProductMenuOpen(false); setIsMobileMenuOpen(false); }}
        onToggleProductMenu={() => setIsProductMenuOpen(!isProductMenuOpen)}
        onSelectCategory={selectCategory}
        onRequireMyPage={requireMyPage}
        onOpenLogout={() => { setIsLogoutModalOpen(true); setIsMobileMenuOpen(false); }}
        onOpenAuth={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
        onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearch}
      />

      <main ref={mainRef} className="md:ml-64 w-full h-screen overflow-y-auto flex flex-col p-6 pt-24 md:p-10 relative scroll-smooth md:cursor-none">
        <UserActions currentUser={currentUser} onOpenAuth={() => setIsAuthModalOpen(true)} onOpenLogout={() => setIsLogoutModalOpen(true)} />
        <div className="flex-1 md:cursor-none">{renderContent()}</div>
        <Footer />
      </main>
    </div>
  );
}
