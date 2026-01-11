import React from 'react';
import { Link } from 'react-router-dom';

export const History = () => {
    return (
        <div className="flex h-screen items-center justify-center text-slate-500 flex-col">
            <h1 className="text-2xl font-bold mb-2">Trang không tồn tại</h1>
            <Link to="/" className="text-purple-400 hover:text-purple-300">Quay về trang chủ</Link>
        </div>
    );
};