import React, { useState, useEffect } from 'react';
import { ContentCard } from '../components/ContentCard';
import { getFavorites } from '../services/localStorage';
import { ContentItem } from '../types';
import { Icons } from '../components/Icon';
import { Link } from 'react-router-dom';

export const Favorites = () => {
    const [items, setItems] = useState<ContentItem[]>([]);

    useEffect(() => {
        setItems(getFavorites());
    }, []);

    return (
        <div className="p-4 md:p-8 min-h-screen">
             <div className="flex items-center gap-3 mb-8">
                <span className="w-1.5 h-8 bg-pink-600 rounded-full"></span>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Danh Sách Yêu Thích</h1>
            </div>

            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Icons.Heart size={40} className="opacity-50" />
                    </div>
                    <p className="text-lg font-medium text-slate-400">Chưa có nội dung yêu thích</p>
                    <p className="text-sm mt-2">Hãy thêm phim hoặc truyện vào danh sách của bạn.</p>
                    <Link to="/" className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        Khám phá ngay
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
                    {items.map((item) => (
                        <div key={item.id}>
                            <ContentCard item={item} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};