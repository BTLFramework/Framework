"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Activity, Moon, Brain, Heart, MessageCircle, Footprints } from "lucide-react";
import type { SummaryData, SummarySlide } from "./InsightSummaryCard";

const factors = [
  { label: "Activity", Icon: Activity },
  { label: "Sleep", Icon: Moon },
  { label: "Stress", Icon: Brain },
  { label: "Injury & health", Icon: Heart },
  { label: "Expectations", Icon: MessageCircle },
  { label: "Past experiences", Icon: Footprints },
];

/** Read-only presentation: navigation never awards points or completes a lesson. */
export default function InsightLessonCarousel({ data }: { data: SummaryData }) {
  const [index, setIndex] = useState(0);
  const [readAll, setReadAll] = useState(false);
  const root = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const interacted = useRef(false);

  useEffect(() => {
    if (!interacted.current) return;
    heading.current?.focus({ preventScroll: true });
    // Reset only the lesson's scrolling container, not unrelated page panels.
    let parent = root.current?.parentElement;
    while (parent) {
      if (/(auto|scroll)/.test(getComputedStyle(parent).overflowY)) {
        parent.scrollTo({ top: 0, behavior: "auto" });
        return;
      }
      parent = parent.parentElement;
    }
    root.current?.scrollIntoView({ block: "start", behavior: "auto" });
  }, [index, readAll]);

  const go = (next: number) => {
    interacted.current = true;
    setIndex(Math.max(0, Math.min(data.slides.length - 1, next)));
  };

  function content(slide: SummarySlide) {
    return <>
      {slide.id === 2 && <div className="grid grid-cols-2 gap-3 my-6" aria-label="Factors that can influence pain">
        {factors.map(({ label, Icon }) => <div key={label} className="flex items-center gap-2 rounded-xl bg-btl-50 p-3 min-w-0">
          <Icon aria-hidden="true" className="w-5 h-5 shrink-0 text-btl-600" />
          <span className="text-sm font-semibold text-btl-900 break-words">{label}</span>
        </div>)}
      </div>}
      <p className="text-base leading-relaxed text-btl-800 whitespace-pre-line break-words">{slide.content}</p>
      {slide.id === 3 && <ol aria-label="The example's approach" className="mt-6 space-y-3">
        {["Adjust the amount", "Notice the response", "Discuss a repeated change"].map((step, n) => <li key={step} className="flex gap-3 items-center text-btl-900 font-medium">
          <span className="rounded-full bg-btl-100 text-btl-800 w-8 h-8 shrink-0 flex items-center justify-center">{n + 1}</span>{step}
        </li>)}
      </ol>}
    </>;
  }

  return <section ref={root} aria-label="Recovery lesson" className="w-full max-w-2xl mx-auto text-btl-900">
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <p className="text-sm font-semibold" aria-live="polite">{readAll ? "Full lesson" : `${index + 1} of ${data.slides.length}`} · At your own pace</p>
      <button type="button" aria-pressed={readAll} className="text-sm underline underline-offset-4 rounded px-2 py-2 focus-visible:ring-2 focus-visible:ring-btl-600" onClick={() => { interacted.current = true; setReadAll(!readAll); }}>
        {readAll ? "Back to slides" : "Read all"}
      </button>
    </div>
    {!readAll && <div className="flex gap-1.5 mb-6" aria-hidden="true">{data.slides.map((slide, n) => <span key={slide.id} className={`h-1.5 rounded-full flex-1 ${n <= index ? "bg-btl-600" : "bg-btl-100"}`} />)}</div>}
    <div className="bg-white rounded-2xl border border-btl-200 p-5 sm:p-8">
      {readAll ? <>
        <h3 ref={heading} tabIndex={-1} className="text-2xl font-bold mb-6 focus:outline-none">Why one day can feel different</h3>
        {data.slides.map(slide => <article key={slide.id} className="mb-8 last:mb-0">
          <h4 className="text-xl font-bold mb-3">{slide.title}</h4>{content(slide)}
        </article>)}
      </> : <>
        <p className="text-xs uppercase tracking-widest font-semibold text-btl-600 mb-3">{["Understand", "See the whole picture", "An everyday example", "Notice", "Put it into practice", "Know when to get support"][index]}</p>
        <h3 ref={heading} tabIndex={-1} className="text-2xl sm:text-3xl font-bold leading-tight mb-5 focus:outline-none">{data.slides[index].title}</h3>
        {content(data.slides[index])}
      </>}
    </div>
    {(readAll || index === data.slides.length - 1) && <div className="mt-5 border-l-4 border-btl-600 bg-btl-50 p-4 rounded-r-xl">
      <p className="font-semibold mb-2">Keep this with you</p><p className="leading-relaxed">{data.takeaway}</p>
      <p className="mt-3 text-sm">Ready to apply it? Use “Take Quiz” below. Reading the slides alone does not complete the lesson.</p>
    </div>}
    {!readAll && <nav aria-label="Lesson slides" className="flex justify-between items-center gap-3 mt-6">
      <button type="button" disabled={index === 0} onClick={() => go(index - 1)} className="inline-flex gap-2 items-center rounded-xl border border-btl-300 px-4 py-3 font-semibold disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-btl-600"><ArrowLeft aria-hidden="true" className="w-4 h-4" />Back</button>
      {index < data.slides.length - 1 ? <button type="button" onClick={() => go(index + 1)} className="inline-flex gap-2 items-center rounded-xl bg-btl-600 text-white px-5 py-3 font-semibold hover:bg-btl-700 focus-visible:ring-2 focus-visible:ring-btl-800">Next<ArrowRight aria-hidden="true" className="w-4 h-4" /></button> : <button type="button" onClick={() => go(0)} className="underline underline-offset-4 px-3 py-3 rounded focus-visible:ring-2 focus-visible:ring-btl-600">Review from start</button>}
    </nav>}
  </section>;
}
