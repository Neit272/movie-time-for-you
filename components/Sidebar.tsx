import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icons } from './Icon';
import { getCategories } from '../services/api';
import { Category } from '../types';

const NavLink = ({ to, label, icon: Icon, active }: { to: string, label: string, icon?: any, active?: boolean }) => (
    <Link 
        to={to} 
        className={`flex items-center gap-2 py-2 px-3 rounded-lg text-sm transition-colors ${
            active 
            ? 'bg-purple-600/20 text-purple-300 font-medium' 
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        }`}
    >
        {Icon && <Icon size={16} />}
        <span>{label}</span>
    </Link>
);

export const Sidebar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  const [expandedSection, setExpandedSection] = useState<'movies' | 'comics' | null>('movies');
  
  const [comicGenres, setComicGenres] = useState<Category[]>([]);

  useEffect(() => {
      const fetchComicGenres = async () => {
          const cats = await getCategories(true);
          if (cats.length > 0) {
              const shuffled = [...cats].sort(() => 0.5 - Math.random());
              setComicGenres(shuffled.slice(0, 3));
          }
      };
      fetchComicGenres();
  }, []);

  const toggleSection = (section: 'movies' | 'comics') => {
      setExpandedSection(prev => prev === section ? null : section);
  };

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-[#0f0e17] border-r border-white/5 fixed left-0 top-0 z-50 p-6 overflow-y-auto">
      <Link 
        to="/" 
        className={`flex items-center justify-center gap-3 mb-8 px-2 py-3 rounded-xl transition-all duration-200 group ${
            isHome ? 'bg-purple-600/10' : ''
        }`}
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors bg-gradient-to-tr from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-900/20`}>
            <Icons.Play size={16} className="fill-current" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
          Movie Time
        </h1>
      </Link>

      <nav className="flex-1 space-y-6">
        
        <div>
            <button 
                onClick={() => toggleSection('movies')}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors mb-2 ${
                    expandedSection === 'movies' ? 'text-white' : 'text-slate-400 hover:text-white'
                }`}
            >
                <div className="flex items-center gap-3">
                    <Icons.Film size={20} className={expandedSection === 'movies' ? 'text-purple-400' : ''}/>
                    <span className="font-semibold text-sm uppercase tracking-wide">Kho Phim</span>
                </div>
                {expandedSection === 'movies' ? <Icons.ChevronLeft size={16} className="-rotate-90" /> : <Icons.ChevronLeft size={16} />}
            </button>

            <div className={`space-y-1 pl-4 border-l border-white/5 ml-3 transition-all duration-300 overflow-hidden ${
                expandedSection === 'movies' ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'
            }`}>
                <NavLink to="/movies" label="Phim Lẻ" icon={Icons.Film} active={location.pathname === '/movies'} />
                <NavLink to="/series" label="Phim Bộ" icon={Icons.Menu} active={location.pathname === '/series'} />
                <NavLink to="/cartoons" label="Hoạt Hình" icon={Icons.Sparkles} active={location.pathname === '/cartoons'} />
                <NavLink to="/search?scope=movie" label="Tìm Phim" icon={Icons.Search} active={location.search.includes('scope=movie')} />
            </div>
        </div>

        <div>
            <button 
                onClick={() => toggleSection('comics')}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors mb-2 ${
                    expandedSection === 'comics' ? 'text-white' : 'text-slate-400 hover:text-white'
                }`}
            >
                <div className="flex items-center gap-3">
                    <Icons.BookOpen size={20} className={expandedSection === 'comics' ? 'text-purple-400' : ''}/>
                    <span className="font-semibold text-sm uppercase tracking-wide">Truyện Tranh</span>
                </div>
                {expandedSection === 'comics' ? <Icons.ChevronLeft size={16} className="-rotate-90" /> : <Icons.ChevronLeft size={16} />}
            </button>

            <div className={`space-y-1 pl-4 border-l border-white/5 ml-3 transition-all duration-300 overflow-hidden ${
                expandedSection === 'comics' ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'
            }`}>
                {comicGenres.map(genre => (
                    <NavLink 
                        key={genre.id} 
                        to={`/comic-category/${genre.slug}`} 
                        label={genre.name} 
                        active={location.pathname === `/comic-category/${genre.slug}`}
                    />
                ))}
                <div className="my-2 border-t border-white/5 mx-2"></div>
                <NavLink to="/comics" label="Khám Phá Thêm" icon={Icons.BookOpen} active={location.pathname === '/comics'} />
                <NavLink to="/search?scope=comic" label="Tìm Truyện" icon={Icons.Search} active={location.search.includes('scope=comic')} />
            </div>
        </div>

        <div className="border-t border-white/5 pt-6 mt-6">
            <h3 className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cá Nhân</h3>
            <NavLink to="/favorites" label="Yêu Thích" icon={Icons.Heart} active={location.pathname === '/favorites'} />
        </div>

      </nav>
    </aside>
  );
};