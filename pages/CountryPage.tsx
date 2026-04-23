import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getContentByCountry, getCountries, getCategories } from '../services/api';
import { ContentItem, Category } from '../types';
import { ContentCard } from '../components/ContentCard';
import { Icons } from '../components/Icon';
import { CustomSelect } from '../components/CustomSelect';
import { YEARS } from '../constants';
import { useSessionStorage } from '../hooks/useSessionStorage';

export const CountryPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const [title, setTitle] = useState('');
    const [items, setItems] = useState<ContentItem[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [showFilters, setShowFilters] = useSessionStorage(`country_${slug}_show_filters`, false);
    
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useSessionStorage(`country_${slug}_category`, '');
    const [year, setYear] = useSessionStorage(`country_${slug}_year`, '');

    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const fetchMeta = async () => {
            const [allCountries, allCats] = await Promise.all([getCountries(), getCategories()]);
            setCategories(allCats);
            
            const currentCountry = allCountries.find(c => c.slug === slug);
            if (currentCountry) {
                setTitle(currentCountry.name);
            } else {
                setTitle(slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Quốc Gia');
            }
        };
        fetchMeta();
    }, [slug]);

    useEffect(() => {
        setItems([]);
        setPage(1);
        setHasMore(true);
        loadData(1, true);
    }, [slug, category, year]);

    const loadData = async (pageNum: number, isNew: boolean) => {
        if (!slug) return;
        setLoading(true);
        
        const newItems = await getContentByCountry(slug, pageNum, {
            category,
            year
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
    const activeFiltersCount = [category, year].filter(Boolean).length;

    return (
        <div className="p-4 md:p-8 min-h-screen">
            <div className="flex flex-col mb-8 sticky top-0 bg-[#0b0a15]/95 backdrop-blur-md z-30 py-4 border-b border-white/5 -mx-4 px-4 md:-mx-8 md:px-8">
                 <div className="flex items-center justify-between">
                    <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                        <span className="w-1.5 h-8 bg-purple-600 rounded-full"></span>
                        Phim {title}
                    </h1>

                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                            showFilters || activeFiltersCount > 0
                                ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/20' 
                                : 'bg-[#1a1825] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                        }`}
                    >
                        <Icons.Settings size={18} />
                        <span className="text-sm font-medium">Bộ lọc</span>
                        {activeFiltersCount > 0 && (
                            <span className="ml-1 w-5 h-5 flex items-center justify-center bg-white text-purple-600 rounded-full text-[10px] font-bold">
                                {activeFiltersCount}
                            </span>
                        )}
                        <Icons.ChevronLeft size={16} className={`transition-transform duration-200 ${showFilters ? 'rotate-90' : '-rotate-90'}`} />
                    </button>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-[300px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-[#1a1825] border border-white/10 rounded-xl p-4 shadow-xl">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <CustomSelect 
                                value={category}
                                onChange={setCategory}
                                options={categoryOptions}
                                placeholder="Thể loại"
                                className="w-full"
                            />

                            <CustomSelect 
                                value={year}
                                onChange={setYear}
                                options={YEARS}
                                placeholder="Năm"
                                className="w-full"
                            />
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

            {!loading && items.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
                    <Icons.Film size={48} className="mb-4 opacity-50" />
                    <p>Chưa có phim của quốc gia này.</p>
                </div>
            )}
        </div>
    );
};