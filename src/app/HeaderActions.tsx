"use client";

export default function HeaderActions() {
  return (
    <div className="flex gap-2 md:gap-4">
      <button
        className="px-4 md:px-8 py-1.5 md:py-2 rounded-full border-2 border-white text-white font-semibold bg-black/80 hover:bg-white/10 transition-all text-xs md:text-lg"
        style={{ fontFamily: 'PPPangramSansRounded-NarrowSemibold, sans-serif' }}
        onClick={() => {
          const el = document.getElementById('hotspot-grid');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        10 Commandments
      </button>
      <button
        className="px-4 md:px-8 py-1.5 md:py-2 rounded-full border-2 border-white text-white font-semibold bg-black/80 hover:bg-white/10 transition-all text-xs md:text-lg"
        style={{ fontFamily: 'PPPangramSansRounded-NarrowSemibold, sans-serif' }}
        onClick={() => {
          if (typeof window !== 'undefined') {
            const event = new CustomEvent('open-ticket-checker');
            window.dispatchEvent(event);
          }
        }}
      >
        WL Checker
      </button>
    </div>
  );
} 