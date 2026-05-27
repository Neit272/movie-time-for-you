import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../components/Icon';

export const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 rounded-2xl bg-[#1a1825] border border-white/10 flex items-center justify-center mb-6">
        <Icons.Search size={36} className="text-slate-500" />
      </div>
      <h1 className="text-6xl font-bold text-white mb-2">404</h1>
      <p className="text-slate-400 text-lg mb-8">Trang bạn tìm không tồn tại.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-all flex items-center gap-2"
      >
        <Icons.ChevronLeft size={18} />
        Về trang chủ
      </Link>
    </div>
  );
};
