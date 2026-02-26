import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getContentById } from '../services/api';
import { ContentDetails, ContentType } from '../types';
import { VideoPlayer } from '../components/VideoPlayer';
import { ComicReader } from '../components/ComicReader';
import { Icons } from '../components/Icon';

export const WatchRead = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [content, setContent] = useState<ContentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (id) {
        const data = await getContentById(id);
        setContent(data || null);
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-slate-500 gap-2"><div className="w-5 h-5 border-2 border-purple-500 rounded-full animate-spin border-t-transparent"/> Đang tải Player...</div>;
  if (!content) return <div className="h-screen bg-black flex items-center justify-center text-white">Nội dung không tồn tại</div>;

  const handleClose = () => {
    navigate(`/details/${id}`);
  };

  if (content.type === ContentType.COMIC || content.type === ContentType.MANGA) {
      const chNum = parseInt(searchParams.get('ch') || '1');
      const chapter = content.chapters?.find(c => c.number === chNum) || content.chapters?.[0];

      if (!chapter) return <div className="h-screen bg-black flex items-center justify-center text-white">Chương không tồn tại</div>;

      return (
        <ComicReader 
            chapter={chapter} 
            onClose={handleClose}
            onNextChapter={content.chapters?.find(c => c.number === chNum + 1) ? () => navigate(`/watch/${id}?ch=${chNum + 1}`) : undefined}
            onPrevChapter={chNum > 1 ? () => navigate(`/watch/${id}?ch=${chNum - 1}`) : undefined}
            contentId={content.id}
            contentTitle={content.title}
            contentImage={content.coverImage}
        />
      );
  }

  const epParam = searchParams.get('ep');
  const serverParam = searchParams.get('server');
  
  const epNum = parseFloat(epParam || '1');
  const serverIdx = parseInt(serverParam || '0');
  
  const currentServer = content.episodes?.[serverIdx];
  const episodes = currentServer?.server_data || content.episodes?.[0]?.server_data || [];
  
  const episode = episodes.find(e => e.number === epNum) || episodes[0];
  
  const title = episode ? `${content.title} - ${episode.title}` : content.title;
  
  return (
    <div className="min-h-screen bg-[#0b0a15] flex flex-col">
        <div className="w-full aspect-video md:h-[75vh] bg-black sticky top-0 z-50 shadow-2xl shadow-purple-900/20">
            <VideoPlayer 
                title={title}
                poster={content.backdropImage}
                embedUrl={episode?.link_embed}
                onClose={handleClose}
                contentId={content.id}
                contentTitle={content.title}
                contentImage={content.coverImage}
                episodeNumber={epNum}
            />
            
            {!episode?.link_embed && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-900/80 text-white p-4 rounded-xl backdrop-blur-md">
                    <h3 className="font-bold flex items-center gap-2"><Icons.X size={20}/> Lỗi Nguồn Phát</h3>
                    <p className="text-sm mt-1">Không tìm thấy link phát cho tập này.</p>
                </div>
            )}
        </div>

        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-white mb-1">{content.title}</h1>
                    <p className="text-slate-400 text-sm flex items-center gap-2">
                        <Icons.Play size={14} className="text-purple-500"/>
                        Đang phát: <span className="text-white font-medium">{episode?.title}</span>
                    </p>
                </div>
                
                {content.episodes && content.episodes.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                        {content.episodes.map((server, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    const newServerEpisodes = content.episodes?.[idx]?.server_data || [];
                                    const sameEp = newServerEpisodes.find(e => e.number === epNum);
                                    const newEpNum = sameEp ? epNum : (newServerEpisodes[0]?.number || 1);
                                    navigate(`/watch/${id}?ep=${newEpNum}&server=${idx}`, { replace: true });
                                }}
                                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-all border ${
                                    serverIdx === idx 
                                    ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-900/20' 
                                    : 'bg-[#1a1825] text-slate-400 border-white/10 hover:bg-[#252236] hover:text-slate-200'
                                }`}
                            >
                                {server.server_name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {episodes.map(ep => (
                    <button
                        key={ep.id}
                        onClick={() => navigate(`/watch/${id}?ep=${ep.number}&server=${serverIdx}`, { replace: true })}
                        className={`py-3 px-2 rounded-lg border text-center transition-all group truncate text-sm font-medium ${
                            ep.number === epNum
                            ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/40'
                            : 'bg-[#1a1825] border-white/5 text-slate-400 hover:bg-[#252236] hover:text-white hover:border-purple-500/30'
                        }`}
                        title={ep.title}
                    >
                        {ep.title}
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
};