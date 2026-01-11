import React, { useState, useEffect } from 'react';
import { Icons } from './Icon';
import { Chapter, ReaderMode, ContentType } from '../types';
import { getChapterPages } from '../services/api';
import { addToHistory } from '../services/localStorage';

interface ComicReaderProps {
  chapter: Chapter;
  onClose: () => void;
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
  contentId: string;
  contentTitle: string;
  contentImage: string;
}

export const ComicReader: React.FC<ComicReaderProps> = ({ 
    chapter, onClose, onNextChapter, onPrevChapter,
    contentId, contentTitle, contentImage
}) => {
  const [mode, setMode] = useState<ReaderMode>(ReaderMode.VERTICAL);
  const [zoom, setZoom] = useState(100);
  const [uiVisible, setUiVisible] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      addToHistory({
          id: contentId,
          title: contentTitle,
          type: ContentType.COMIC,
          coverImage: contentImage,
          backdropImage: contentImage,
          description: '',
          rating: 0,
          year: new Date().getFullYear(),
          tags: []
      }, {
          chapterName: chapter.title || `Chapter ${chapter.number}`,
          chapterId: chapter.id,
          episodeNumber: chapter.number
      });
  }, [contentId, chapter.id]);

  useEffect(() => {
    const loadPages = async () => {
        setLoading(true);
        const apiUrl = chapter.apiUrl || `https://otruyenapi.com/v1/api/chapter/${chapter.id}`;
        const imgs = await getChapterPages(apiUrl);
        setPages(imgs);
        setLoading(false);
    };
    loadPages();
  }, [chapter.id, chapter.apiUrl]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (Math.abs(window.scrollY - lastScrollY) > 50) {
        setUiVisible(false);
        lastScrollY = window.scrollY;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleZoneClick = (e: React.MouseEvent) => {
    const width = window.innerWidth;
    const clickX = e.clientX;
    
    if (clickX > width * 0.35 && clickX < width * 0.65) {
        setUiVisible(!uiVisible);
    }
  };

  if (loading) {
      return (
        <div className="min-h-screen bg-[#0b0a15] flex items-center justify-center text-white gap-2">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Đang tải chương...</span>
        </div>
      );
  }

  return (
    <div className="relative min-h-screen bg-[#0b0a15]" onClick={handleZoneClick}>
      <div className={`fixed top-0 left-0 right-0 bg-[#0b0a15]/90 backdrop-blur-md border-b border-white/10 p-4 z-50 flex items-center justify-between transition-transform duration-300 ${uiVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex items-center gap-4">
             <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-slate-300 hover:text-white">
                <Icons.ChevronLeft size={24} />
             </button>
             <div>
                 <h2 className="text-white font-medium text-sm md:text-base">{chapter.title}</h2>
                 <p className="text-xs text-slate-400">Page {mode === ReaderMode.VERTICAL ? 'Scroll' : `${currentPage + 1}/${pages.length}`}</p>
             </div>
        </div>
        
        <div className="flex items-center gap-3">
             <button 
                onClick={(e) => { e.stopPropagation(); setMode(mode === ReaderMode.VERTICAL ? ReaderMode.PAGINATED : ReaderMode.VERTICAL); }}
                className="p-2 rounded-full hover:bg-white/10 text-slate-300"
                title="Switch Mode"
             >
                {mode === ReaderMode.VERTICAL ? <Icons.Minimize size={20} /> : <Icons.BookOpen size={20} />}
             </button>
             <button 
                onClick={(e) => { e.stopPropagation(); setZoom(Math.max(50, zoom - 10)); }}
                className="hidden md:block p-2 rounded-full hover:bg-white/10 text-slate-300"
             >
                -
             </button>
             <span className="hidden md:block text-xs text-slate-400 w-8 text-center">{zoom}%</span>
             <button 
                onClick={(e) => { e.stopPropagation(); setZoom(Math.min(200, zoom + 10)); }}
                className="hidden md:block p-2 rounded-full hover:bg-white/10 text-slate-300"
             >
                +
             </button>
        </div>
      </div>

      <div className={`w-full min-h-screen pt-16 pb-20 flex flex-col items-center justify-center transition-all`} style={{ zoom: `${zoom / 100}` }}>
         {pages.length === 0 ? (
             <div className="text-slate-500">Chương này chưa có nội dung.</div>
         ) : mode === ReaderMode.VERTICAL ? (
             <div className="flex flex-col gap-0 max-w-4xl mx-auto shadow-2xl bg-white/5">
                 {pages.map((page, idx) => (
                     <img key={idx} src={page} alt={`Page ${idx + 1}`} className="w-full h-auto block" loading="lazy" />
                 ))}
             </div>
         ) : (
             <div className="max-w-4xl mx-auto h-[80vh] flex items-center justify-center">
                 <img src={pages[currentPage]} alt={`Page ${currentPage}`} className="max-h-full max-w-full object-contain" />
                 
                 <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentPage(p => Math.max(0, p - 1)); }}
                    className="fixed left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full hover:bg-black/80 text-white"
                 >
                    <Icons.ChevronLeft size={30} />
                 </button>
                 <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentPage(p => Math.min(pages.length - 1, p + 1)); }}
                    className="fixed right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full hover:bg-black/80 text-white"
                 >
                    <Icons.ChevronRight size={30} />
                 </button>
             </div>
         )}
      </div>

      <div className={`fixed bottom-0 left-0 right-0 bg-[#0b0a15]/90 backdrop-blur-md border-t border-white/10 p-4 z-50 flex items-center justify-center gap-8 transition-transform duration-300 ${uiVisible ? 'translate-y-0' : 'translate-y-full'}`}>
            <button 
                disabled={!onPrevChapter} 
                onClick={(e) => { e.stopPropagation(); onPrevChapter?.(); }}
                className={`flex items-center gap-2 text-sm font-medium ${!onPrevChapter ? 'text-slate-600' : 'text-white hover:text-purple-400'}`}
            >
                <Icons.ChevronLeft size={16} /> Previous Chapter
            </button>
            <button 
                disabled={!onNextChapter} 
                onClick={(e) => { e.stopPropagation(); onNextChapter?.(); }}
                className={`flex items-center gap-2 text-sm font-medium ${!onNextChapter ? 'text-slate-600' : 'text-white hover:text-purple-400'}`}
            >
                Next Chapter <Icons.ChevronRight size={16} />
            </button>
      </div>
    </div>
  );
};