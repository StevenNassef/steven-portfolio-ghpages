// src/components/MediaCarousel.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";

export default function MediaCarousel({
    title,
    main,
    gallery = [],
    aspect = "16 / 9",
    itemsPerView = 1,
    showDots = true,
    showArrows = true,
    showControls = true,
}) {
    // Track which media files failed to load
    const [failedMedia, setFailedMedia] = useState(new Set());

    // Flatten slides and filter out failed ones
    const slides = useMemo(() => {
        const items = [];
        for (const g of gallery) {
            if (!g?.src) continue;
            const src = g.src;
            // Skip if we know this media failed to load
            if (failedMedia.has(src)) continue;
            items.push({ 
                type: g.type === "video" ? "video" : "image", 
                src: g.src, 
                poster: g.poster 
            });
        }
        return items;
    }, [gallery, failedMedia]);

    // Handler to mark media as failed
    const handleMediaError = (src) => {
        setFailedMedia(prev => {
            const next = new Set(prev);
            next.add(src);
            return next;
        });
    };

    const trackRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const gapPercent = 2; // gap between items as percentage (2%)

    // Calculate number of pages (groups of itemsPerView)
    const totalPages = Math.ceil(slides.length / itemsPerView);

    // Calculate item width based on itemsPerView
    // With CSS gap, items don't need to account for gap in their width
    // gap is applied separately, so we just divide by itemsPerView
    // But we need to account for gap taking up space, so:
    // Available width = 100% - ((itemsPerView - 1) * gap%)
    // Item width = Available width / itemsPerView
    const itemWidthPercent = itemsPerView === 1 
        ? 100 
        : (100 - (itemsPerView - 1) * gapPercent) / itemsPerView;

    // Track active page based on scroll position
    useEffect(() => {
        const el = trackRef.current;
        if (!el || slides.length === 0) return;
        
        const onScroll = () => {
            const scrollLeft = el.scrollLeft;
            const containerWidth = el.clientWidth;
            // Page width is the container width (one page = itemsPerView items)
            const pageWidth = containerWidth;
            const currentPage = Math.round(scrollLeft / pageWidth);
            setActiveIndex(Math.min(Math.max(currentPage, 0), totalPages - 1));
        };
        
        el.addEventListener("scroll", onScroll, { passive: true });
        onScroll(); // Initial check
        return () => el.removeEventListener("scroll", onScroll);
    }, [slides.length, totalPages]);

    const gotoItem = (direction) => {
        const el = trackRef.current;
        if (!el || slides.length === 0) return;
        
        const containerWidth = el.clientWidth;
        const pageWidth = containerWidth;
        const currentPage = Math.round(el.scrollLeft / pageWidth);
        
        if (direction === 'next') {
            const nextPage = Math.min(currentPage + 1, totalPages - 1);
            el.scrollTo({ left: nextPage * pageWidth, behavior: "smooth" });
        } else {
            const prevPage = Math.max(currentPage - 1, 0);
            el.scrollTo({ left: prevPage * pageWidth, behavior: "smooth" });
        }
    };

    const goToSlide = (pageIndex) => {
        const el = trackRef.current;
        if (!el) return;
        const containerWidth = el.clientWidth;
        const pageWidth = containerWidth;
        el.scrollTo({ left: pageIndex * pageWidth, behavior: "smooth" });
    };

    if (slides.length === 0) return null;

    return (
        <div className="relative group w-full" style={{ maxWidth: '100%', overflow: 'hidden' }}>
            <div
                ref={trackRef}
                className="carousel hide-scrollbar"
                style={{ 
                    scrollSnapType: "x mandatory",
                    gap: itemsPerView > 1 ? `${gapPercent}%` : "0",
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                }}
                aria-roledescription="carousel"
                aria-label={`${title} media`}
            >
                {slides.map((slide, i) => {
                    const isFailed = failedMedia.has(slide.src);
                    
                    // Skip rendering if this media failed to load
                    if (isFailed) return null;
                    
                    // Determine if this item should snap (first item of each page)
                    const isFirstInPage = i % itemsPerView === 0;
                    
                    return (
                        <div
                            key={slide.src}
                            className="media bg-card"
                            style={{
                                scrollSnapAlign: isFirstInPage ? "start" : "none",
                                flexShrink: 0,
                                width: `${itemWidthPercent}%`,
                                aspectRatio: aspect,
                                maxWidth: '100%',
                                minHeight: 0,
                                minWidth: 0,
                            }}
                        >
                            {slide.type === "video" ? (
                                <video
                                    src={slide.src}
                                    poster={slide.poster || undefined}
                                    controls={showControls}
                                    playsInline
                                    muted={true}
                                    autoPlay={true}
                                    loop={true}
                                    preload="metadata"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        handleMediaError(slide.src);
                                    }}
                                    className="w-full h-full object-cover"
                                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                                />
                            ) : (
                                <img
                                    src={slide.src}
                                    alt={`${title} ${i + 1}`}
                                    loading="lazy"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        handleMediaError(slide.src);
                                    }}
                                    className="w-full h-full object-cover"
                                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {showArrows && totalPages > 1 && (
                <>
                    <button
                        type="button"
                        aria-label="Previous"
                        onClick={(e) => {
                            e.stopPropagation();
                            gotoItem('prev');
                        }}
                        className="btn-circle left-2"
                        disabled={activeIndex === 0}
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        aria-label="Next"
                        onClick={(e) => {
                            e.stopPropagation();
                            gotoItem('next');
                        }}
                        className="btn-circle right-2"
                        disabled={activeIndex === totalPages - 1}
                    >
                        ›
                    </button>
                </>
            )}

            {showDots && totalPages > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            aria-label={`Go to page ${i + 1}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                goToSlide(i);
                            }}
                            className={`h-2 w-2 rounded-full transition-colors ${
                                i === activeIndex ? "bg-white/90" : "bg-white/40"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
