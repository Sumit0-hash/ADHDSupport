import React, { useMemo } from 'react';
import { useData } from '../context/UserContext.js';
import type { IExpertTalk } from '../types/index.js';
import { ExternalLink } from 'lucide-react';

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);

    // youtu.be/<id>
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.replace('/', '') || null;
    }

    // youtube.com/watch?v=<id>
    const v = u.searchParams.get('v');
    if (v) return v;

    // youtube.com/embed/<id>
    const parts = u.pathname.split('/').filter(Boolean);
    const embedIndex = parts.findIndex((p) => p === 'embed');
    if (embedIndex !== -1 && parts[embedIndex + 1]) return parts[embedIndex + 1];

    return null;
  } catch {
    return null;
  }
}

function getThumbUrl(youtubeLink: string): string | null {
  const id = getYouTubeId(youtubeLink);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export const ExpertTalks = () => {
  const { expertTalks, loading } = useData();

  const talks = useMemo(() => {
    // newest first (server already sorts, but just in case)
    return [...expertTalks].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [expertTalks]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-[#30506C]">Loading expert talks...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#D7E9ED]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-[#30506C] mb-2">Expert Talks</h1>
        <p className="text-[#263A47] mb-8">Curated YouTube talks from experts to support parents and families.</p>

        {talks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-[#263A47]">No expert talks yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {talks.map((talk: IExpertTalk) => {
              const thumb = getThumbUrl(talk.youtubeLink);

              return (
                <div key={talk._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-44 bg-[#EAF4F6] flex items-center justify-center">
                    {thumb ? (
                      <img src={thumb} alt={talk.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-[#30506C] font-medium px-4 text-center">
                        Thumbnail not available
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-[#30506C] mb-2 line-clamp-2">{talk.title}</h3>

                    <button
                      onClick={() => window.open(talk.youtubeLink, '_blank', 'noopener,noreferrer')}
                      className="w-full py-2 rounded-lg font-medium transition bg-[#469CA4] hover:bg-[#3a7f8a] text-white flex items-center justify-center gap-2"
                    >
                      <ExternalLink size={18} />
                      Watch on YouTube
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
