import React from 'react';
import { Icons } from './Icon';

export const ContentCardSkeleton = () => {
    return (
        <div className="block w-full h-full">
            <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-[#1a1825] shadow-lg border border-white/5">
                <div className="absolute inset-0 flex items-center justify-center bg-[#1e1b2e] animate-pulse">
                    <Icons.Film className="text-slate-700 opacity-20" size={24} />
                </div>
            </div>
            <div className="mt-3 space-y-2">
                <div className="h-4 bg-[#1a1825] rounded animate-pulse w-3/4" />
                <div className="h-3 bg-[#1a1825] rounded animate-pulse w-1/2" />
            </div>
        </div>
    );
};
