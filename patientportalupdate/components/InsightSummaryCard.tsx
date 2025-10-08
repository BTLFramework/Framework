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

  // Top CTA if present on any slide
  const resourceSlide = data.slides.find(s => s.resourceLink && s.resourceLabel);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header (use first slide as hero) */}
        <div className="bg-gradient-to-r from-btl-50 to-btl-100 p-6 border-b border-btl-200">
          <h3 className="text-2xl font-bold text-btl-900">{data.slides[0]?.title || "Overview"}</h3>
          <p className="text-btl-700 mt-1">{data.slides[0]?.content || "Evidence-based recovery insight"}</p>
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

        {/* Stacked sections for remaining slides (cortisol-style callouts) */}
        <div className="p-8 space-y-6">
          {data.slides.slice(1).map((s) => (
            <div
              key={s.id}
              className="bg-btl-50 border border-btl-200 rounded-2xl p-6 shadow-sm"
            >
              <h4 className="text-xl font-bold text-btl-900 mb-2">{s.title}</h4>
              <p className="text-btl-700 leading-relaxed">{s.content}</p>
            </div>
          ))}

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

