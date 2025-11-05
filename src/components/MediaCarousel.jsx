// src/components/MediaCarousel.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";

/** Parse "16 / 9" -> number (w/h) */
function parseAspect(aspect) {
    if (typeof aspect === "number") return aspect;
    const [w, h] = String(aspect || "").split("/").map(s => Number(s.trim()));
    return Number.isFinite(w) && Number.isFinite(h) && h !== 0 ? w / h : 16 / 9;
}

function FitImage({ src, alt, targetAR, onDetectAR, isWide = false, onError }) {
    const [contain, setContain] = useState(false);
    return (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            onLoad={(e) => {
                const img = e.currentTarget;
                const ar = (img.naturalWidth || 0) / (img.naturalHeight || 1);
                onDetectAR?.(ar);
                // Narrow images should always use contain to fit within rounded frame
                setContain(!isWide || ar < targetAR);
            }}
            onError={(e) => {
                // Hide image if it fails to load
                e.currentTarget.style.display = 'none';
                onError?.(src);
            }}
            className={`w-full h-full ${(!isWide || contain) ? "object-contain" : "object-cover"} object-center`}
            style={{ objectFit: (!isWide || contain) ? "contain" : "cover" }}
        />
    );
}

function FitVideo({ src, poster, targetAR, onDetectAR, isWide = false, onError }) {
    const [contain, setContain] = useState(false);
    return (
        <video
            src={src}
            poster={poster || undefined}
            controls
            playsInline
            muted
            autoPlay
            loop
            preload="metadata"
            onLoadedMetadata={(e) => {
                const v = e.currentTarget;
                const ar = (v.videoWidth || 0) / (v.videoHeight || 1);
                onDetectAR?.(ar);
                // Narrow images should always use contain to fit within rounded frame
                setContain(!isWide || ar < targetAR);
            }}
            onError={(e) => {
                // Hide video if it fails to load
                e.currentTarget.style.display = 'none';
                onError?.(src);
            }}
            className={`w-full h-full ${(!isWide || contain) ? "object-contain" : "object-cover"} object-center`}
            style={{ objectFit: (!isWide || contain) ? "contain" : "cover" }}
        />
    );
}

/**
 * Carousel scrolls smoothly between images:
 * - wide images => full width (1 per snap)
 * - narrow images => 1/3 width (3 per snap)
 */
export default function MediaCarousel({
                                          title,
                                          main,
                                          gallery = [],
                                          aspect = "16 / 9",
                                          showDots = true,
                                          showArrows = true,
                                      }) {
    const targetAR = useMemo(() => parseAspect(aspect), [aspect]);

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
            items.push({ type: g.type === "video" ? "video" : "image", src: g.src, poster: g.poster });
        }
        return items.length ? items : [];
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
    const itemRefs = useRef({});
    const [containerW, setContainerW] = useState(0);
    const [ratios, setRatios] = useState({});
    const [itemWidths, setItemWidths] = useState({});
    const onAR = (i, r) => setRatios(prev => (prev[i] === r ? prev : { ...prev, [i]: r }));

    // Measure container width (for 16:9 height)
    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        const update = () => setContainerW(el.clientWidth || 1);
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("resize", update);
            ro.disconnect();
        };
    }, []);

    // Measure item widths after they're rendered
    useEffect(() => {
        const updateWidths = () => {
            const widths = {};
            Object.entries(itemRefs.current).forEach(([i, el]) => {
                if (el) widths[i] = el.offsetWidth || 0;
            });
            setItemWidths(widths);
        };
        updateWidths();
        const ro = new ResizeObserver(updateWidths);
        Object.values(itemRefs.current).forEach(el => {
            if (el) ro.observe(el);
        });
        return () => ro.disconnect();
    }, [slides.length]);

    const isHintWide = (src, idx) =>
        idx === 0 || /(^|\/)[^/]*(_|-)?main\.[a-z0-9]+$/i.test(src || "");
    const isWideAR = (ar) => ar && ar >= (16 / 9) * 0.975; // ~2.5% tolerance

    // Determine if each slide is wide or narrow
    const slideConfigs = useMemo(() => {
        return slides.map((s, i) => {
            // Videos are always narrow
            const isVideo = s.type === "video";
            const wide = !isVideo && (isHintWide(s.src, i) || isWideAR(ratios[i]));
            return {
                ...s,
                index: i,
                ar: ratios[i],
                isWide: wide,
            };
        });
    }, [slides, ratios]);

    const gap = 20; // gap in pixels
    const frameH = Math.round(((containerW - 2 * gap) / 3) * (19.5 / 9));
    const thirdBasis = `calc((100% - ${2 * gap}px) / 3)`;

    // Calculate scroll positions for each item
    const scrollPositions = useMemo(() => {
        const positions = [];
        let currentPos = 0;
        
        slideConfigs.forEach((slide, i) => {
            positions.push(currentPos);
            const width = itemWidths[i] || (slide.isWide ? containerW : (containerW - 2 * gap) / 3);
            currentPos += width + gap;
        });
        
        return positions;
    }, [slideConfigs, itemWidths, containerW, gap]);

    // Track active item based on scroll position
    const [activeIndex, setActiveIndex] = useState(0);
    
    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        const onScroll = () => {
            const scrollLeft = el.scrollLeft;
            // Find the closest item
            let closestIdx = 0;
            let minDist = Infinity;
            scrollPositions.forEach((pos, i) => {
                const dist = Math.abs(scrollLeft - pos);
                if (dist < minDist) {
                    minDist = dist;
                    closestIdx = i;
                }
            });
            setActiveIndex(closestIdx);
        };
        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, [scrollPositions]);

    const gotoItem = (direction) => {
        const el = trackRef.current;
        if (!el || scrollPositions.length === 0) return;
        
        const currentScroll = el.scrollLeft;
        const containerWidth = el.clientWidth;
        
        if (direction === 'next') {
            // Find next item that's not fully visible
            for (let i = 0; i < scrollPositions.length; i++) {
                if (scrollPositions[i] > currentScroll + containerWidth * 0.1) {
                    el.scrollTo({ left: scrollPositions[i], behavior: "smooth" });
                    return;
                }
            }
            // If at end, just scroll a bit more
            el.scrollTo({ left: el.scrollWidth - containerWidth, behavior: "smooth" });
        } else {
            // Find previous item
            for (let i = scrollPositions.length - 1; i >= 0; i--) {
                if (scrollPositions[i] < currentScroll - containerWidth * 0.1) {
                    el.scrollTo({ left: scrollPositions[i], behavior: "smooth" });
                    return;
                }
            }
            // If at start, go to beginning
            el.scrollTo({ left: 0, behavior: "smooth" });
        }
    };


    return (
        <div className="relative group">
            <div
                ref={trackRef}
                className="carousel hide-scrollbar"
                style={{ 
                    scrollSnapType: "x mandatory",
                    gap: `${gap}px`
                }}
                aria-roledescription="carousel"
                aria-label={`${title} media`}
            >
                {slideConfigs.map((slide, i) => {
                    const isWide = slide.isWide;
                    const isVideo = slide.type === "video";
                    const isFailed = failedMedia.has(slide.src);
                    
                    // Skip rendering if this media failed to load
                    if (isFailed) return null;
                    
                    return (
                        <div
                            key={`${slide.src}-${i}`}
                            ref={(el) => { itemRefs.current[i] = el; }}
                            className="media bg-card"
                            style={{
                                scrollSnapAlign: "start",
                                flexShrink: 0,
                                width: isWide ? "100%" : thirdBasis,
                                minWidth: isWide ? "100%" : thirdBasis,
                                aspectRatio: isWide ? "16 / 9" : undefined,
                                height: isWide ? undefined : `${frameH}px`,
                                position: isVideo ? "sticky" : "relative",
                                left: isVideo ? 0 : "auto",
                                zIndex: isVideo ? 10 : "auto",
                            }}
                        >
                            {slide.type === "video" ? (
                                <FitVideo
                                    src={slide.src}
                                    poster={slide.poster}
                                    targetAR={16 / 9}
                                    onDetectAR={(r) => onAR(i, r)}
                                    isWide={isWide}
                                    onError={() => handleMediaError(slide.src)}
                                />
                            ) : (
                                <FitImage
                                    src={slide.src}
                                    alt={`${title} ${isWide ? 'cover' : `screenshot ${i + 1}`}`}
                                    targetAR={16 / 9}
                                    onDetectAR={(r) => onAR(i, r)}
                                    isWide={isWide}
                                    onError={() => handleMediaError(slide.src)}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {showArrows && slideConfigs.length > 1 && (
                <>
                    <button
                        type="button"
                        aria-label="Previous"
                        onClick={(e) => {
                            e.stopPropagation();
                            gotoItem('prev');
                        }}
                        className="btn-circle left-2"
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
                    >
                        ›
                    </button>
                </>
            )}

            {showDots && slideConfigs.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                    {slideConfigs.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            aria-label={`Go to item ${i + 1}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                const el = trackRef.current;
                                if (el && scrollPositions[i] !== undefined) {
                                    el.scrollTo({ left: scrollPositions[i], behavior: "smooth" });
                                }
                            }}
                            className={`h-2 w-2 rounded-full ${
                                i === activeIndex ? "bg-white/90" : "bg-white/40"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}