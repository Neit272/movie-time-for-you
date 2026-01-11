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
  const epNum = parseFloat(epParam || '1');
  
  const episode = content.episodes?.find(e => e.number === epNum) || content.episodes?.[0];
  
  const title = episode ? `${content.title} - ${episode.title}` : content.title;
  
  return (
    <div className="fixed inset-0 z-50 bg-black">
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
  );
};