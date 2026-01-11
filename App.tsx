import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Details } from './pages/Details';
import { WatchRead } from './pages/WatchRead';
import { Search } from './pages/Search';
import { CategoryPage } from './pages/CategoryPage';
import { CountryPage } from './pages/CountryPage';
import { YearPage } from './pages/YearPage';
import { Favorites } from './pages/Favorites';

const Layout = ({ children }: { children?: React.ReactNode }) => {
    const location = useLocation();
    const isImmersive = location.pathname.includes('/watch');

    return (
        <div className="flex min-h-screen bg-[#0b0a15] text-slate-100 font-sans selection:bg-purple-500/30 overflow-x-hidden">
            {!isImmersive && <Sidebar />}
            
            <main className={`flex-1 transition-all duration-300 w-full min-w-0 ${!isImmersive ? 'md:ml-64 pb-24 md:pb-0' : ''}`}>
                {children}
            </main>

            {!isImmersive && <MobileNav />}
        </div>
    );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          
          <Route path="/movies" element={<Catalog type="phim-le" title="Phim Lẻ" />} />
          <Route path="/series" element={<Catalog type="phim-bo" title="Phim Bộ" />} />
          <Route path="/cartoons" element={<Catalog type="hoat-hinh" title="Phim Hoạt Hình" />} />
          
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/country/:slug" element={<CountryPage />} />
          <Route path="/year/:year" element={<YearPage />} />
          
          <Route path="/comics" element={<Catalog type="truyen-tranh" title="Truyện Tranh" />} />
          <Route path="/comic-category/:slug" element={<CategoryPage isComic={true} />} />
          
          <Route path="/details/:id" element={<Details />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/watch/:id" element={<WatchRead />} />
          
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;