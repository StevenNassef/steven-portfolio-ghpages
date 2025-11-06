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
}) {
    // Track which media files failed to load
    const [failedMedia, setFailedMedia] = useState(new Set());
    // Track which media items are visible (for lazy loading)
    const [visibleItems, setVisibleItems] = useState(new Set());
    const itemRefs = useRef(new Map());

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

    // Intersection Observer for lazy loading images
    useEffect(() => {
        if (!trackRef.current || slides.length === 0) return;
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const src = entry.target.getAttribute('data-src');
                        if (src) {
                            setVisibleItems(prev => new Set(prev).add(src));
                        }
                    }
                });
            },
            {
                root: trackRef.current,
                rootMargin: '50px', // Start loading 50px before item enters viewport
                threshold: 0.1,
            }
        );

        // Use setTimeout to ensure DOM is updated
        const timeoutId = setTimeout(() => {
            // Observe all items
            itemRefs.current.forEach((ref) => {
                if (ref) observer.observe(ref);
            });
        }, 0);

        return () => {
            clearTimeout(timeoutId);
            observer.disconnect();
        };
    }, [slides.length]);

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
        <div className="relative group w-full">
            <div
                ref={trackRef}
                className="carousel hide-scrollbar"
                style={{ 
                    scrollSnapType: "x mandatory",
                    gap: itemsPerView > 1 ? `${gapPercent}%` : "0",
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
                    
                    // Check if this item should be loaded (first few items or visible)
                    const shouldLoad = i < itemsPerView * 2 || visibleItems.has(slide.src);
                    
                    return (
                        <div
                            key={`${slide.src}-${i}`}
                            ref={(el) => {
                                if (el) itemRefs.current.set(slide.src, el);
                            }}
                            data-src={slide.src}
                            className="media bg-card"
                            style={{
                                scrollSnapAlign: isFirstInPage ? "start" : "none",
                                flexShrink: 0,
                                width: `${itemWidthPercent}%`,
                                aspectRatio: aspect,
                            }}
                        >
                            {slide.type === "video" ? (
                                <video
                                    src={shouldLoad ? slide.src : undefined}
                                    poster={shouldLoad ? (slide.poster || undefined) : undefined}
                                    controls
                                    playsInline
                                    muted
                                    autoPlay={shouldLoad}
                                    loop
                                    preload={shouldLoad ? "metadata" : "none"}
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        handleMediaError(slide.src);
                                    }}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <img
                                    src={shouldLoad ? slide.src : undefined}
                                    alt={`${title} ${i + 1}`}
                                    loading={i < itemsPerView ? "eager" : "lazy"}
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        handleMediaError(slide.src);
                                    }}
                                    className="w-full h-full object-cover"
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
