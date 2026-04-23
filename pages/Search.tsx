import React, { useState, useEffect, useCallback, useRef } from 'react';
import { searchContent, getCategories, getCountries } from '../services/api';
import { ContentItem, Category, Country } from '../types';
import { ContentCard } from '../components/ContentCard';
import { Icons } from '../components/Icon';
import { useSearchParams } from 'react-router-dom';
import { CustomSelect } from '../components/CustomSelect';
import { YEARS } from '../constants';

export const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const scopeParam = searchParams.get('scope');

    const [keyword, setKeyword] = useState('');
    const [debouncedKeyword, setDebouncedKeyword] = useState('');
    const [items, setItems] = useState<ContentItem[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    
    const [scope, setScope] = useState<'all' | 'movie' | 'comic'>('all');
    const [categories, setCategories] = useState<Category[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [category, setCategory] = useState('');
    const [country, setCountry] = useState('');
    const [year, setYear] = useState('');

    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (scopeParam === 'movie') setScope('movie');
        else if (scopeParam === 'comic') setScope('comic');
        else setScope('all');
    }, [scopeParam]);

    const handleScopeChange = (newScope: 'all' | 'movie' | 'comic') => {
        setScope(newScope);
        setSearchParams({ scope: newScope });
    };

    useEffect(() => {
        getCategories().then(setCategories);
        getCountries().then(setCountries);
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedKeyword(keyword);
        }, 600);
        return () => clearTimeout(handler);
    }, [keyword]);

    useEffect(() => {
        setItems([]);
        setPage(1);
        setHasMore(true);
        
        if (!debouncedKeyword && !category && !country && !year) {
            return;
        }
        
        loadData(1, true);
    }, [debouncedKeyword, category, country, year, scope]);

    const loadData = async (pageNum: number, isNew: boolean) => {
        setLoading(true);
        const searchKeyword = debouncedKeyword || ''; 

        const newItems = await searchContent(searchKeyword, pageNum, {
            category,
            country,
            year,
            scope 
        });

        if (newItems.length === 0) {
            setHasMore(false);
        } else {
            setItems(prev => isNew ? newItems : [...prev, ...newItems]);
        }
        setLoading(false);
    };

    const lastElementRef = useCallback((node: HTMLDivElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => {
                    const nextPage = prev + 1;
                    loadData(nextPage, false);
                    return nextPage;
                });
            }
        });
        
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const categoryOptions = categories.map(c => ({ value: c.slug, label: c.name }));
    const countryOptions = countries.map(c => ({ value: c.slug, label: c.name }));
    const activeFiltersCount = [category, country, year].filter(Boolean).length;

    return (
        <div className="p-4 md:p-8 min-h-screen">
            <div className="flex flex-col gap-6 mb-8 max-w-5xl mx-auto">
                 <div className="flex justify-center mb-2">
                    <div className="bg-[#1a1825] p-1 rounded-xl flex">
                        <button 
                            onClick={() => handleScopeChange('all')}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${scope === 'all' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            Tất cả
                        </button>
                        <button 
                            onClick={() => handleScopeChange('movie')}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${scope === 'movie' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            Phim
                        </button>
                        <button 
                            onClick={() => handleScopeChange('comic')}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${scope === 'comic' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            Truyện
                        </button>
                    </div>
                 </div>

                 <div className="relative w-full flex gap-2">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Icons.Search className="h-6 w-6 text-slate-400" />
                        </div>
                        <input 
                            type="text"
                            placeholder={scope === 'movie' ? "Tìm kiếm phim..." : scope === 'comic' ? "Tìm kiếm truyện..." : "Nhập tên nội dung..."}
                            className="w-full pl-12 pr-4 py-3 bg-[#1a1825] border border-white/10 rounded-xl text-white text-lg placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-lg"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            autoFocus
                        />
                    </div>
                    
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center justify-center w-12 rounded-xl border transition-all flex-shrink-0 ${
                            showFilters || activeFiltersCount > 0
                                ? 'bg-purple-600 border-purple-500 text-white' 
                                : 'bg-[#1a1825] border-white/10 text-slate-400 hover:text-white'
                        }`}
                    >
                        <Icons.Settings size={22} />
                    </button>
                 </div>

                 <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-[#1a1825] border border-white/10 rounded-xl p-4 shadow-xl">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <CustomSelect 
                                value={category}
                                onChange={setCategory}
                                options={categoryOptions}
                                placeholder="Thể loại"
                                className="w-full"
                            />

                            {scope !== 'comic' && (
                                <>
                                    <CustomSelect 
                                        value={country}
                                        onChange={setCountry}
                                        options={countryOptions}
                                        placeholder="Quốc gia"
                                        className="w-full"
                                    />

                                    <CustomSelect 
                                        value={year}
                                        onChange={setYear}
                                        options={YEARS}
                                        placeholder="Năm"
                                        className="w-full"
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
                {items.map((item, index) => {
                    if (items.length === index + 1) {
                        return (
                            <div ref={lastElementRef} key={`${item.id}-${index}`}>
                                <ContentCard item={item} />
                            </div>
                        );
                    } else {
                        return (
                            <div key={`${item.id}-${index}`}>
                                <ContentCard item={item} />
                            </div>
                        );
                    }
                })}
            </div>

            {loading && (
                <div className="flex items-center justify-center py-12">
                     <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {!debouncedKeyword && !category && !country && !year && (
                <div className="flex flex-col items-center justify-center h-[40vh] text-slate-600">
                    <Icons.Search size={64} className="mb-4 opacity-20" />
                    <p>Nhập từ khóa để bắt đầu tìm kiếm</p>
                </div>
            )}
        </div>
    );
};