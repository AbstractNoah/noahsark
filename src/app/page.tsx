'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';
const Lenis = require('lenis').default;

const SLIDES = Array.from({ length: 8 }, (_, i) => `/images/slider/slide${i + 1}.png`);
const SLIDE_COUNT = SLIDES.length;
const SLIDE_SIZE = 220; // px, must match max size
const GAP = 16; // px, gap-4
const MOBILE_GAP = 8; // px, gap-2 for mobile
const TABLET_GAP = 12; // px, gap-3 for tablet
const SPEED = 120; // px/second

// Proportional top values for each content and slider section (in %, relative to background height)
const contentPositions = [
  '0%',    // 1st section
  '10%',   // 2nd section
  '20%',   // 3rd section
  '30%',   // 4th section
  '40%',   // 5th section
  '50%',   // 6th section
  '60%',   // 7th section
  '70%',   // 8th section
  '80%',   // 9th section
  '100%',  // 10th section
];

// Hotspot data
const HOTSPOTS = [
  {
    img: '/images/hotspot/hotspot1.jpg',
    title: 'Thou Shalt HODL and Stay Diamond-Handed',
    subtitle: '"Go forth and tag, for the multitudes must join the quest." (Genesis 1:1)',
    description: 'Share thy mission far and wide—bring thy friends aboard.'
  },
  {
    img: '/images/hotspot/hotspot2.jpg',
    title: 'Believe in Thy Process, and Forsake FOMO',
    subtitle: '"Trust in the path, for it leads to salvation." (Ark 2:8)',
    description: 'Let not thy heart be swayed by market tides.'
  },
  {
    img: '/images/hotspot/hotspot3.jpg',
    title: 'Honor Thy Fellow Noahs and Strengthen the Ark',
    subtitle: '"United we stand, divided we fall." (Genesis 3:3)',
    description: 'Build bonds with thy brethren, for together we are mighty.'
  },
  {
    img: '/images/hotspot/hotspot4.jpg',
    title: 'Thou Shalt Spread the Gospel of the Ark',
    subtitle: '"Let thy voice be heard across the digital seas." (Ark 4:2)',
    description: 'Share thy wisdom and guide others to enlightenment.'
  },
  {
    img: '/images/hotspot/hotspot5.jpg',
    title: 'Celebrate the Memes, for They Are Holy',
    subtitle: '"In laughter we find strength, in joy we find purpose." (Genesis 5:5)',
    description: 'Let thy memes shine bright and bring joy to all.'
  },
  {
    img: '/images/hotspot/hotspot6.jpg',
    title: 'Thou Shalt Not Judge, for All Are Welcome',
    subtitle: '"The Ark accepts all who seek refuge." (Ark 6:9)',
    description: 'Open thy heart to newcomers, for we were all once lost.'
  },
  {
    img: '/images/hotspot/hotspot7.jpg',
    title: 'Flaunt Thy Noah With Pride',
    subtitle: '"Let thy light shine before others." (Genesis 7:7)',
    description: 'Wear thy colors proudly and inspire thy fellows.'
  },
  {
    img: '/images/hotspot/hotspot8.jpg',
    title: 'Stay Steadfast in the Tempest',
    subtitle: '"Through storms we sail, through darkness we prevail." (Ark 8:12)',
    description: 'Hold strong when waves crash, for calm seas lie ahead.'
  },
  {
    img: '/images/hotspot/hotspot9.jpg',
    title: 'Thou Shalt Support the Mission in Spirit and Deed',
    subtitle: '"Actions speak louder than words." (Genesis 9:3)',
    description: 'Contribute to the cause with both heart and hand.'
  },
  {
    img: '/images/hotspot/hotspot10.jpg',
    title: 'Guide Future Noahs to the Ark',
    subtitle: '"Be the light that others may follow." (Ark 10:10)',
    description: 'Mentor those who seek knowledge and show them the way.'
  },
];

// Example whitelist addresses
const WHITELIST = [
  '0x1234567890abcdef1234567890abcdef12345678',
  '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
  '0x1111111111111111111111111111111111111111',
];

export default function Home() {
  const [isPaused, setIsPaused] = useState(false);
  const [x, setX] = useState(-((SLIDE_SIZE + GAP) * SLIDE_COUNT) / 2); // Start from center
  const lastTime = useRef(performance.now());
  const totalWidth = (SLIDE_SIZE + GAP) * SLIDE_COUNT;
  const [isHoveringLink, setIsHoveringLink] = useState(false);
  const [showChecker, setShowChecker] = useState(false);
  // Responsive state for slider/grid item size
  const [isMobile, setIsMobile] = useState(false);

  // Slider için yeni state'ler
  const [sliderItems, setSliderItems] = useState([...SLIDES, ...SLIDES, ...SLIDES]); // 3 set of slides
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Responsive grid top value (SSR compatible)
  const [gridTop, setGridTop] = useState('100%');
  useEffect(() => {
    const updateGridTop = () => {
      if (window.innerWidth < 640) {
        setGridTop('100%');
      } else if (window.innerWidth < 1024) {
        setGridTop('98.3%');
      } else {
        setGridTop('99.2%');
      }
    };
    updateGridTop();
    window.addEventListener('resize', updateGridTop);
    return () => window.removeEventListener('resize', updateGridTop);
  }, []);

  useAnimationFrame((now) => {
    if (!isPaused) {
      const delta = (now - lastTime.current) / 1000;
      lastTime.current = now;
      setX((prev) => {
        let next = prev - SPEED * delta;
        // Reset position when reaching the end of the second set
        if (next <= -totalWidth * 2) {
          next += totalWidth;
        }
        return next;
      });
    } else {
      lastTime.current = now;
    }
  });

  // Slider pozisyonunu sıfırlama efekti
  useEffect(() => {
    const handleTransitionEnd = () => {
      if (x <= -totalWidth * 2) {
        setX(-totalWidth);
      }
    };

    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('transitionend', handleTransitionEnd);
    }

    return () => {
      if (slider) {
        slider.removeEventListener('transitionend', handleTransitionEnd);
      }
    };
  }, [x, totalWidth]);

  // Responsive slider top value (SSR compatible)
  const [sliderPosition, setSliderPosition] = useState('17.7%');
  useEffect(() => {
    const updateSliderPosition = () => {
      if (window.innerWidth < 640) {
        setSliderPosition('16.8%');
      } else if (window.innerWidth < 1024) {
        setSliderPosition('16.5%');
      } else {
        setSliderPosition('17.7%');
      }
    };
    updateSliderPosition();
    window.addEventListener('resize', updateSliderPosition);
    return () => window.removeEventListener('resize', updateSliderPosition);
  }, []);

  // Card size state for SSR/CSR compatibility
  const [cardStyle, setCardStyle] = useState<{
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    width?: string;
    height?: string;
    aspectRatio: string;
  }>({
    minWidth: 220,
    minHeight: 180,
    maxWidth: 340,
    maxHeight: 320,
    aspectRatio: '4 / 3',
  });
  useEffect(() => {
    const updateCardStyle = () => {
      if (window.innerWidth < 640) {
        setCardStyle({
          width: '16vw',
          height: '16vw',
          maxWidth: 220,
          maxHeight: 220,
          minWidth: 80,
          minHeight: 80,
          aspectRatio: '4 / 3',
        });
      } else if (window.innerWidth < 1024) {
        setCardStyle({
          width: '17vw',
          height: '17vw',
          maxWidth: 240,
          maxHeight: 240,
          minWidth: 90,
          minHeight: 90,
          aspectRatio: '4 / 3',
        });
      } else {
        setCardStyle({
          minWidth: 220,
          minHeight: 180,
          maxWidth: 340,
          maxHeight: 320,
          aspectRatio: '4 / 3',
        });
      }
    };
    updateCardStyle();
    window.addEventListener('resize', updateCardStyle);
    return () => window.removeEventListener('resize', updateCardStyle);
  }, []);

  // Responsive slider size
  useEffect(() => {
    const updateSliderSize = () => {
      if (window.innerWidth < 640) {
        setCardStyle({
          width: '16vw',
          height: '16vw',
          maxWidth: 220,
          maxHeight: 220,
          minWidth: 80,
          minHeight: 80,
          aspectRatio: '4 / 3',
        });
      } else {
        setCardStyle({
          minWidth: 220,
          minHeight: 180,
          maxWidth: 340,
          maxHeight: 320,
          aspectRatio: '4 / 3',
        });
      }
    };
    updateSliderSize();
    window.addEventListener('resize', updateSliderSize);
    return () => window.removeEventListener('resize', updateSliderSize);
  }, []);

  // Custom cursor useEffect
  useEffect(() => {
    // Mobil cihazlarda cursor'ı gösterme
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      document.body.style.cursor = 'auto';
      return;
    }

    let rafId: number;
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const cursor = document.getElementById('custom-cursor');
      if (cursor) {
        // Use requestAnimationFrame for smooth animation
        rafId = requestAnimationFrame(() => {
          lastX = e.clientX;
          lastY = e.clientY;
          cursor.style.left = lastX + 'px';
          cursor.style.top = lastY + 'px';
        });
      }
    };

    const handleMouseEnter = () => {
      setIsHoveringLink(true);
      // Hide default cursor
      document.body.style.cursor = 'none';
    };
    
    const handleMouseLeave = () => {
      setIsHoveringLink(false);
      // Hide default cursor
      document.body.style.cursor = 'none';
    };

    // Add event listeners to all link and button elements
    const links = document.querySelectorAll('a, button, [role="button"], .cursor-pointer, .flex-shrink-0, .custom-cursor-pointer');
    
    links.forEach(link => {
      link.addEventListener('mouseenter', handleMouseEnter);
      link.addEventListener('mouseleave', handleMouseLeave);
      // Hide default cursor
      (link as HTMLElement).style.cursor = 'none';
    });

    // Hide cursor on page load
    document.body.style.cursor = 'none';
    
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      links.forEach(link => {
        link.removeEventListener('mouseenter', handleMouseEnter);
        link.removeEventListener('mouseleave', handleMouseLeave);
      });
      // Cleanup
      document.body.style.cursor = 'auto';
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      smooth: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const handler = () => setShowChecker(true);
    window.addEventListener('open-ticket-checker', handler);
    return () => window.removeEventListener('open-ticket-checker', handler);
  }, []);

  return (
    <>
      <div
        id="custom-cursor"
        className="fixed pointer-events-none z-[99999] w-16 h-16 transition-all duration-75 ease-out"
        style={{
          backgroundImage: `url('${isHoveringLink ? '/images/custom-cursor-pointer.png' : '/images/custom-cursor.png'}')`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
          display: 'block',
        }}
      />
      <main
        className="relative w-full select-none"
        style={{
          backgroundImage: "url('/images/bg/combined-bg.jpg')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center top',
          backgroundSize: 'contain',
          minHeight: 'calc(100vw * 5.625)',
          height: 'calc(100vw * 5.625)',
          backgroundColor: '#000',
          cursor: 'none',
        }}
      >
        {/* Mutlak konumlu slider */}
        <div
          className="absolute left-0 right-0 flex justify-center z-30"
          style={{ top: sliderPosition }}
        >
          <div
            className="relative w-full max-w-4xl mx-auto"
            style={{
              height: '16vw',
              maxHeight: '220px',
              minHeight: '100px',
              overflow: 'visible',
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <motion.div
              ref={sliderRef}
              className="flex items-center"
              style={{ 
                x,
                width: totalWidth * 3,
                willChange: 'transform',
                transition: isPaused ? 'none' : 'transform 0.1s linear',
                gap: isMobile ? MOBILE_GAP : (window.innerWidth < 1024 ? TABLET_GAP : GAP)
              }}
            >
              {sliderItems.map((src, idx) => (
                <motion.div
                  key={idx}
                  className="flex-shrink-0 rounded-full bg-black/60 cursor-pointer shadow-lg"
                  style={{
                    width: isMobile ? '16vw' : (window.innerWidth < 1024 ? '18vw' : '14vw'),
                    height: isMobile ? '16vw' : (window.innerWidth < 1024 ? '18vw' : '14vw'),
                    maxWidth: window.innerWidth < 1024 ? 260 : 220,
                    maxHeight: window.innerWidth < 1024 ? 260 : 220,
                    minWidth: 80,
                    minHeight: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'visible',
                    marginRight: isMobile ? MOBILE_GAP : (window.innerWidth < 1024 ? TABLET_GAP : GAP),
                  }}
                  whileHover={{ scale: 1.45, zIndex: 10 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                >
                  <img
                    src={src}
                    alt="Slider görseli"
                    className="w-full h-full object-cover rounded-full pointer-events-none"
                    draggable={false}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
        {/* Mutlak konumlu bölümler */}
        {Array.from({ length: 9 }, (_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 flex justify-center z-20"
            style={{ top: contentPositions[i] }}
          >
            <div className="w-full max-w-5xl flex flex-col items-center justify-center py-8 md:py-16 lg:py-24">
              {/* Content goes here */}
            </div>
          </div>
        ))}
        {/* HOTSPOT GRID */}
        <div
          className="absolute left-0 right-0 flex justify-center z-30"
          style={{ top: gridTop }}
        >
          <HotspotGrid />
        </div>
      </main>
      <div style={{ 
        height: typeof window !== 'undefined' 
          ? (window.innerWidth < 640 
            ? '79vh' 
            : window.innerWidth < 1024 
              ? '115vh' 
              : '145vh')
          : '145vh', 
        width: '100%' 
      }} aria-hidden="true"></div>
      {showChecker && <TicketCheckerModal onClose={() => setShowChecker(false)} />}
    </>
  );
}

// HotspotGrid bileşeni
function HotspotGrid() {
  const [modal, setModal] = useState<number|null>(null);
  const [modalPos, setModalPos] = useState<{top: number, left: number, width: number, height: number} | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Kart boyutları için SSR/CSR uyumlu state (HotspotGrid içinde)
  const [cardStyle, setCardStyle] = useState<{
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    width?: string;
    height?: string;
    aspectRatio: string;
  }>({
    minWidth: 220,
    minHeight: 180,
    maxWidth: 340,
    maxHeight: 320,
    aspectRatio: '4 / 3',
  });
  useEffect(() => {
    const updateCardStyle = () => {
      if (window.innerWidth < 640) {
        setCardStyle({
          width: '35vw',
          height: '25vw',
          aspectRatio: '4 / 3',
        });
      } else {
        setCardStyle({
          minWidth: 220,
          minHeight: 180,
          maxWidth: 340,
          maxHeight: 320,
          aspectRatio: '4 / 3',
        });
      }
    };
    updateCardStyle();
    window.addEventListener('resize', updateCardStyle);
    return () => window.removeEventListener('resize', updateCardStyle);
  }, []);

  // Klavye ile gezinme (modal açıkken)
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (modal === null) return;
      if (e.key === 'ArrowRight') setModal((prev) => prev === null ? 0 : (prev + 1) % HOTSPOTS.length);
      if (e.key === 'ArrowLeft') setModal((prev) => prev === null ? 0 : (prev - 1 + HOTSPOTS.length) % HOTSPOTS.length);
      if (e.key === 'Escape') setModal(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [modal]);

  // Modal dışında tıklayınca kapat
  React.useEffect(() => {
    if (modal === null) return;
    const handleClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).id === 'hotspot-modal-bg') setModal(null);
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [modal]);

  // Mobilde yatay scroll için
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // 2x5 grid için sıralama (1 2 / 3 4 / ...)
  const gridItems = Array(5).fill(0).flatMap((_, row) =>
    Array(2).fill(0).map((_, col) => HOTSPOTS[row * 2 + col])
  );

  // Modalı tıklanan kartın pozisyonunda aç
  const handleCardClick = (i: number) => {
    if (!gridRef.current) return;
    const card = gridRef.current.children[i] as HTMLElement;
    if (card) {
      const rect = card.getBoundingClientRect();
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      setModalPos({
        top: rect.top + rect.height / 2 + (isMobile ? window.scrollY : 0),
        left: rect.left + rect.width / 2 + (isMobile ? window.scrollX : 0),
        width: rect.width,
        height: rect.height,
      });
      setModal(i);
    }
  };

  // Ekran dışına taşmayı engelle (modal için)
  const getModalStyle = () => {
    if (!modalPos) return {};
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const modalWidth = isMobile ? window.innerWidth * 0.96 : 360;
    const modalHeight = isMobile ? 340 : 420;
    let left, top;
    if (isMobile) {
      left = (window.innerWidth - modalWidth) / 2;
      top = (window.innerHeight - modalHeight) / 2;
      if (left < 0) left = 0;
      if (top < 0) top = 0;
    } else {
      left = modalPos.left - modalWidth / 2;
      top = modalPos.top - modalHeight / 2;
      if (left < 0) left = 0;
      if (top < 0) top = 0;
    }
    return {
      position: 'fixed' as const,
      top: top,
      left: left,
      width: modalWidth,
      maxWidth: isMobile ? '100vw' : '96vw',
      maxHeight: '96vh',
      zIndex: 9999,
      background: 'rgba(20,20,20,0.98)',
      borderRadius: 24,
      boxShadow: '0 8px 48px 0 #000b',
      padding: 20,
      overflowY: 'auto' as const,
      display: 'flex' as const,
      flexDirection: 'column' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    };
  };

  // Masaüstü modal mı, mobil modal mı?
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

  // Masaüstünde klasik modal, mobilde contextual modal
  const renderModal = () => {
    if (modal === null) return null;
    if (isDesktop) {
      // Masaüstü: klasik ortalanmış modal, 15:9 oranlı büyük görsel
      return (
        <div
          id="hotspot-modal-bg"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
          style={{ animationDuration: '0.2s' }}
        >
          <div
            className="relative flex flex-col items-center justify-center bg-black/90 rounded-3xl shadow-2xl p-8"
            style={{
              maxWidth: 1000,
              width: '95vw',
              maxHeight: '92vh',
              overflowY: 'auto' as const,
              display: 'flex',
              flexDirection: 'column' as const,
              alignItems: 'center' as const,
              justifyContent: 'center' as const,
            }}
          >
            {/* Sol ok */}
            <button
              onClick={() => setModal((prev) => prev === null ? 0 : (prev - 1 + HOTSPOTS.length) % HOTSPOTS.length)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center transition select-none custom-cursor-pointer z-10"
              style={{ cursor: 'none' }}
              aria-label="Previous"
            >
              <div className="w-8 h-8 border-t-2 border-l-2 border-white transform rotate-[-45deg]"></div>
            </button>

            {/* Sağ ok */}
            <button
              onClick={() => setModal((prev) => prev === null ? 0 : (prev + 1) % HOTSPOTS.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center transition select-none custom-cursor-pointer z-10"
              style={{ cursor: 'none' }}
              aria-label="Next"
            >
              <div className="w-8 h-8 border-t-2 border-r-2 border-white transform rotate-45"></div>
            </button>

            <div style={{ width: '100%', aspectRatio: '4 / 3', maxWidth: 900, maxHeight: 675, background: '#111', borderRadius: 18, overflow: 'hidden', marginBottom: 24 }}>
              <img
                src={gridItems[modal].img}
                alt={gridItems[modal].title}
                className="w-full h-full object-cover"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 text-center whitespace-pre-line">{gridItems[modal].title}</h3>
            <div className="text-base italic text-white/90 text-center mb-2 whitespace-pre-line">{gridItems[modal].subtitle}</div>
            <div className="text-base text-white/80 text-center whitespace-pre-line">{gridItems[modal].description}</div>
            {/* Close button */}
            <button
              onClick={() => setModal(null)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center transition select-none custom-cursor-pointer"
              style={{ cursor: 'none' }}
              aria-label="Close"
            >
              <img src="/images/xicon.png" alt="Close" className="w-8 h-8 object-contain" />
            </button>
          </div>
        </div>
      );
    }
    // Mobil: contextual modal, 4:3 oranlı görsel
    return modalPos && (
      <div style={getModalStyle()}>
        {/* Sol ok */}
        <button
          onClick={() => setModal((prev) => prev === null ? 0 : (prev - 1 + HOTSPOTS.length) % HOTSPOTS.length)}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center transition select-none custom-cursor-pointer z-10"
          style={{ cursor: 'none' }}
          aria-label="Previous"
        >
          <div className="w-6 h-6 border-t-2 border-l-2 border-white transform rotate-[-45deg]"></div>
        </button>

        {/* Sağ ok */}
        <button
          onClick={() => setModal((prev) => prev === null ? 0 : (prev + 1) % HOTSPOTS.length)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center transition select-none custom-cursor-pointer z-10"
          style={{ cursor: 'none' }}
          aria-label="Next"
        >
          <div className="w-6 h-6 border-t-2 border-r-2 border-white transform rotate-45"></div>
        </button>

        <div style={{ width: '100%', aspectRatio: '4 / 3', background: '#111', borderRadius: 18, overflow: 'hidden', marginBottom: 16 }}>
          <img
            src={gridItems[modal].img}
            alt={gridItems[modal].title}
            className="w-full h-full object-cover"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2 text-center whitespace-pre-line">{gridItems[modal].title}</h3>
        <div className="text-base italic text-white/90 text-center mb-2 whitespace-pre-line">{gridItems[modal].subtitle}</div>
        <div className="text-base text-white/80 text-center whitespace-pre-line">{gridItems[modal].description}</div>
        {/* Close button */}
        <button
          onClick={() => setModal(null)}
          className="absolute top-2 right-2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center transition select-none custom-cursor-pointer"
          style={{ cursor: 'none' }}
          aria-label="Close"
        >
          <img src="/images/xicon.png" alt="Close" className="w-7 h-7 object-contain" />
        </button>
      </div>
    );
  };

  // Touchpad için kaydırma kontrolü
  useEffect(() => {
    const modal = document.getElementById('hotspot-modal-bg');
    if (!modal) return;

    let isScrolling = false;
    let startX: number;
    let startY: number;

    const handleTouchStart = (e: TouchEvent) => {
      isScrolling = true;
      startX = e.touches[0].pageX;
      startY = e.touches[0].pageY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isScrolling) return;
      const x = e.touches[0].pageX;
      const y = e.touches[0].pageY;
      const deltaX = x - startX;
      const deltaY = y - startY;

      // Yatay kaydırma eşiği (dikey kaydırmadan daha fazla)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // Sağa kaydırma
          setModal((prev) => prev === null ? 0 : (prev - 1 + HOTSPOTS.length) % HOTSPOTS.length);
        } else {
          // Sola kaydırma
          setModal((prev) => prev === null ? 0 : (prev + 1) % HOTSPOTS.length);
        }
        isScrolling = false;
      }
    };

    const handleTouchEnd = () => {
      isScrolling = false;
    };

    modal.addEventListener('touchstart', handleTouchStart);
    modal.addEventListener('touchmove', handleTouchMove);
    modal.addEventListener('touchend', handleTouchEnd);

    return () => {
      modal.removeEventListener('touchstart', handleTouchStart);
      modal.removeEventListener('touchmove', handleTouchMove);
      modal.removeEventListener('touchend', handleTouchEnd);
    };
  }, [modal]);

  return (
    <>
      <div
        id="hotspot-grid"
        ref={gridRef}
        className="grid grid-cols-2 grid-rows-5 gap-8 p-4 overflow-x-auto"
        style={{ 
          maxWidth: 1200,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Sağa/sola kaydırma göstergesi */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center opacity-50 pointer-events-none">
          <div className="w-8 h-8 border-t-2 border-l-2 border-white transform rotate-[-45deg]"></div>
        </div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center opacity-50 pointer-events-none">
          <div className="w-8 h-8 border-t-2 border-r-2 border-white transform rotate-45"></div>
        </div>

        {gridItems.map((h, i) => (
          <div
            key={i}
            tabIndex={0}
            className="relative flex flex-col items-center justify-end rounded-2xl transition-all duration-300 cursor-pointer group hover:z-20 hover:scale-110 hover:shadow-2xl hover:ring-4 hover:ring-white/40"
            style={{
              background: 'none',
              boxShadow: '0 4px 24px 0 #0008',
              ...cardStyle,
              outline: 'none',
              filter: 'none',
              transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
              willChange: 'transform, filter',
            }}
            onClick={() => handleCardClick(i)}
          >
            <img
              src={h.img}
              alt={h.title}
              className="w-full h-full object-cover rounded-2xl select-none pointer-events-none"
              draggable={false}
              style={{ userSelect: 'none' }}
            />
            {/* Başlık ve metin */}
            <div
              className="absolute bottom-0 left-0 w-full px-4 py-2 text-center transition-all duration-300 rounded-b-2xl opacity-0 max-h-0 pointer-events-none group-hover:opacity-100 group-hover:max-h-20 group-hover:pointer-events-auto"
              style={{ background: 'rgba(0,0,0,0.7)', borderRadius: '0 0 1rem 1rem' }}
            >
              <h3 className="text-lg font-bold text-white mb-0 whitespace-pre-line">{h.title}</h3>
              {/* Metin hover'da gösterilmeyecek */}
            </div>
          </div>
        ))}
      </div>
      {/* Contextual Modal veya Masaüstü Modal */}
      {renderModal()}
    </>
  );
}

// TicketCheckerModal bileşeni
function TicketCheckerModal({ onClose }: { onClose: () => void }) {
  const [address, setAddress] = useState('');
  const [result, setResult] = useState<'none' | 'success' | 'fail'>('none');
  const [wlType, setWlType] = useState<'none' | 'fcfs' | 'gtd'>('none');
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // wl.txt'den whitelist adreslerini yükle
  useEffect(() => {
    fetch('/wl.txt')
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        setWhitelist(lines);
      });
  }, []);

  // ESC ile kapatma
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Modal açıldığında inputa odaklan
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 200);
  }, []);

  // Modal dışında tıklayınca kapat
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).id === 'ticket-checker-modal-bg') onClose();
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  // Adres kontrolü
  const checkAddress = () => {
    if (!address.trim()) return;
    let foundType: 'none' | 'fcfs' | 'gtd' = 'none';
    whitelist.forEach(line => {
      const [type, addr] = line.split(':');
      if (addr && addr.trim().toLowerCase() === address.trim().toLowerCase()) {
        if (type === 'fcfs' || type === 'gtd') foundType = type;
      }
    });
    setWlType(foundType);
    setResult(foundType === 'none' ? 'fail' : 'success');
  };

  return (
    <div
      id="ticket-checker-modal-bg"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      style={{ animationDuration: '0.2s', cursor: 'none' }}
    >
      <div
        className="relative flex flex-col items-center justify-center bg-neutral-900/95 rounded-3xl shadow-2xl p-6 md:p-10 w-[92vw] max-w-md md:max-w-xl min-h-[340px]"
        style={{ cursor: 'none' }}
      >
        {/* X butonu */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center transition select-none custom-cursor-pointer"
          style={{ cursor: 'none' }}
          aria-label="Close"
        >
          <img src="/images/xicon.png" alt="Close" className="w-7 h-7 object-contain" />
        </button>
        {/* Başlık */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 mt-2 text-center">Ticket Checker</h2>
        {/* Input alanı */}
        <input
          ref={inputRef}
          type="text"
          value={address}
          onChange={e => { setAddress(e.target.value); setResult('none'); }}
          onKeyDown={e => { if (e.key === 'Enter') checkAddress(); }}
          placeholder="Enter your blessed address..."
          className="w-full px-4 py-3 rounded-xl bg-neutral-800 text-white text-base md:text-lg outline-none border-2 border-transparent focus:border-[#01ffcb] transition mb-4 shadow-inner"
          style={{ letterSpacing: '0.01em', cursor: 'text' }}
        />
        {/* Sonuç mesajı */}
        {wlType === 'fcfs' && result === 'success' && (
          <div className="w-full text-green-400 text-center font-semibold mb-4 text-lg md:text-xl animate-fade-in">
            You are among the chosen (FCFS). Step aboard.
          </div>
        )}
        {wlType === 'gtd' && result === 'success' && (
          <div className="w-full text-blue-400 text-center font-semibold mb-4 text-lg md:text-xl animate-fade-in">
            You are among the chosen (GTD). Step aboard.
          </div>
        )}
        {wlType === 'none' && result === 'fail' && (
          <div className="w-full text-red-400 text-center font-semibold mb-4 text-lg md:text-xl animate-fade-in">
            Noahs heard the call. You did not.
          </div>
        )}
        {/* Blessing butonu */}
        <button
          className="w-full mt-2 py-3 rounded-xl bg-gradient-to-br from-[#01ffcb] via-[#00e6b2] to-[#00bfa3] text-black font-bold shadow-lg hover:scale-105 active:scale-95 transition text-xl md:text-2xl custom-cursor-pointer border-0"
          style={{ cursor: 'none' }}
          onClick={checkAddress}
        >
          Blessing
        </button>
      </div>
    </div>
  );
} 