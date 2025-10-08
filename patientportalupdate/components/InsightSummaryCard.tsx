"use client";

import { ExternalLink, Award } from "lucide-react";
import { useEffect, useState } from "react";

interface SummarySlide {
  id: number;
  title: string;
  content: string;
  backgroundColor?: string;
  textColor?: string;
  resourceLink?: string;
  resourceLabel?: string;
}

interface SummaryData {
  slides: SummarySlide[];
  timeMinutes?: number;
  level?: string;
  why?: string;
  sectionTitle?: string;
  sectionIntro?: string;
}

export default function InsightSummaryCard({ assetPath }: { assetPath: string }) {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(assetPath);
        const json = await res.json();
        setData(json);
      } catch (e: any) {
        setError(e?.message || "Failed to load summary");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [assetPath]);

  if (loading) {
    return <div className="flex justify-center items-center h-32 text-gray-500">Loading…</div>;
  }
  if (error || !data?.slides?.length) {
    return <div className="flex justify-center items-center h-32 text-gray-500">No summary available</div>;
  }

  // Meta and helper fields
  const metaTime: number | undefined = (data as any)?.timeMinutes;
  const metaLevel: string | undefined = (data as any)?.level;
  const why: string | undefined = (data as any)?.why;
  const sectionTitle: string | undefined = (data as any)?.sectionTitle;
  const sectionIntro: string | undefined = (data as any)?.sectionIntro;

  // Top CTA if present on any slide
  const resourceSlide = data.slides.find(s => s.resourceLink && s.resourceLabel);
  const actionSlide = data.slides.find(s => /try this/i.test(s.title || ''));

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header (use first slide as hero) */}
        <div className="bg-gradient-to-r from-btl-50 to-btl-100 p-6 border-b border-btl-200">
          <h3 className="text-2xl font-bold text-btl-900">{data.slides[0]?.title || "Overview"}</h3>
          <p className="text-btl-700 mt-1">{why || data.slides[0]?.content || "Evidence-based recovery insight"}</p>

          {/* Meta chips */}
          <div className="mt-2 flex items-center gap-2">
            {typeof metaTime === 'number' && (
              <span className="text-xs font-semibold text-btl-700 bg-btl-100 border border-btl-200 rounded-full px-2 py-0.5">
                {metaTime}–{metaTime + 1} min
              </span>
            )}
            {metaLevel && (
              <span className="text-xs font-semibold text-btl-700 bg-btl-100 border border-btl-200 rounded-full px-2 py-0.5">
                {metaLevel}
              </span>
            )}
          </div>
          {resourceSlide && (
            <div className="mt-4">
              <a
                href={resourceSlide.resourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-btl-600 text-white font-semibold rounded-xl hover:bg-btl-700 transition-colors shadow-md"
              >
                <span>{resourceSlide.resourceLabel}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        {/* Body sections: replicate cortisol layout
            - Outer callout container with intro/section title
            - Inside: 2x2 grid of tiles (title + supporting text)
        */}
        <div className="p-8 space-y-6">
          {(() => {
            // Build a single 2x2 grid section like cortisol
            const remaining = data.slides.slice(1);
            // Exclude the action slide (with resourceLink) from the grid
            const contentTiles = remaining.filter(s => !(s.resourceLink && /try this/i.test(s.title || '')));
            // Take first 4; if fewer, pad by repeating last tile for symmetry
            const tiles: SummarySlide[] = contentTiles.slice(0, 4);
            while (tiles.length > 0 && tiles.length < 4) {
              tiles.push(tiles[tiles.length - 1]);
            }
            if (tiles.length === 0) return null;

            return (
              <div className="bg-btl-50 border border-btl-200 rounded-2xl p-6 shadow-sm">
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-btl-900">{sectionTitle || 'Key Insights'}</h4>
                  {(sectionIntro || '') && (
                    <p className="text-btl-700 mt-1">{sectionIntro}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tiles.map((tile, tileIdx) => (
                    <div key={tile.id ?? tileIdx} className="bg-white rounded-xl p-4 border border-btl-200">
                      <h5 className="font-semibold text-btl-800 mb-1">{tile.title}</h5>
                      {tile.content && (
                        <p className="text-sm text-btl-700 leading-relaxed">{tile.content}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Micro-action callout */}
          {actionSlide && (
            <div className="bg-btl-50 border border-btl-200 rounded-2xl p-6 shadow-sm">
              <h4 className="text-lg font-bold text-btl-900 mb-1">{actionSlide.title}</h4>
              <p className="text-btl-700 leading-relaxed">{actionSlide.content}</p>
            </div>
          )}

          {/* Bottom CTA and Key Takeaway */}
          {resourceSlide && (
            <div className="bg-btl-50 border border-btl-200 rounded-2xl p-6 shadow-sm">
              <h4 className="text-lg font-bold text-btl-900 mb-3">Learn More</h4>
              <a
                href={resourceSlide.resourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-btl-600 text-white font-semibold rounded-full hover:bg-btl-700 transition-colors shadow-lg"
              >
                <span>{resourceSlide.resourceLabel}</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          )}

          <div className="bg-gradient-to-br from-btl-600 to-btl-700 border-2 border-btl-500 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-6 h-6 text-white" />
              <h4 className="text-xl font-bold text-white">Key Takeaway</h4>
            </div>
            <p className="text-btl-100 font-medium leading-relaxed">
              Review the essentials above, then explore the full resource to deepen understanding. Complete the quiz to lock in learning and earn points.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

