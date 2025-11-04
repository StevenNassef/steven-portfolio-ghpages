import React, { useMemo, useRef, useState, useEffect } from "react";

/** Parse aspect ratio string like "19.5 / 9" into a number (w/h). */
function parseAspect(aspect) {
    if (typeof aspect === "number") return aspect;
    const parts = String(aspect || "").split("/");
    if (parts.length === 2) {
        const w = Number(parts[0].trim());
        const h = Number(parts[1].trim());
        if (Number.isFinite(w) && Number.isFinite(h) && h !== 0) return w / h;
    }
    return 19.5 / 9; // default to iPhone 13 Pro Max landscape
}

function FitImage({ src, alt, targetAR, forceContain }) {
    const [contain, setContain] = useState(!!forceContain);
    return (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            onLoad={(e) => {
                if (forceContain) return;
                const img = e.currentTarget;
                const ar = img.naturalWidth / img.naturalHeight;
                // If the image is narrower than the card AR, fit vertically (object-contain).
                setContain(ar < targetAR);
            }}
            className={`w-full h-full ${contain ? "object-contain bg-card" : "object-cover"}`}
        />
    );
}

function FitVideo({ src, poster, targetAR, forceContain }) {
    const [contain, setContain] = useState(!!forceContain);
    return (
        <video
            src={src}
            poster={poster}
            controls
            playsInline
            muted
            onLoadedMetadata={(e) => {
                if (forceContain) return;
                const v = e.currentTarget;
                const ar = (v.videoWidth || 0) / (v.videoHeight || 1);
                setContain(ar < targetAR);
            }}
            className={`w-full h-full ${contain ? "object-contain bg-card" : "object-cover"}`}
        />
    );
}

/**
 * MediaCarousel
 * Props:
 * - title: string
 * - main: string (cover image)
 * - gallery: [{ type: 'image'|'video', src: string, poster?: string }]
 * - aspect: string|number (e.g., "19.5 / 9")
 * - forceContain?: boolean (force object-contain for all slides)
 * - showDots?: boolean
 * - showArrows?: boolean
 */
export default function MediaCarousel({
                                          title,
                                          main,
                                          gallery = [],
                                          aspect = "19.5 / 9",
                                          forceContain = false,
                                          showDots = true,
                                          showArrows = true,
                                      }) {
    const targetAR = useMemo(() => parseAspect(aspect), [aspect]);

    const slides = useMemo(() => {
        const items = [];
        if (main) items.push({ type: "image", src: main });
        for (const g of gallery) {
            if (!g || !g.src) continue;
            items.push({ type: g.type === "video" ? "video" : "image", src: g.src, poster: g.poster });
        }
        // Fallback to a single empty slide if nothing provided (prevents layout jump)
        return items.length ? items : [{ type: "image", src: main || "" }];
    }, [main, gallery]);

    const trackRef = useRef(null);
    const [active, setActive] = useState(0);

    const [slideW, setSlideW] = useState(0);

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        const GAP = 12; // must match the CSS gap set in .carousel

        const update = () => {
            const first = el.querySelector(".slide");
            if (first) {
                const rect = first.getBoundingClientRect();
                setSlideW(rect.width + GAP);
            }
        };

        update();

        // Keep in sync with container size changes
        const ro = new ResizeObserver(() => update());
        ro.observe(el);

        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("resize", update);
            ro.disconnect();
        };
    }, []);

    // Update active dot while scrolling
    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        const handler = () => {
            const width = slideW || el.clientWidth || 1;
            const idx = Math.round(el.scrollLeft / width);
            setActive(Math.max(0, Math.min(idx, slides.length - 1)));
        };
        el.addEventListener("scroll", handler, { passive: true });
        return () => el.removeEventListener("scroll", handler);
    }, [slides.length, slideW]);

    const goto = (idx) => {
        const el = trackRef.current;
        if (!el) return;
        const clamped = Math.max(0, Math.min(idx, slides.length - 1));
        const width = slideW || el.clientWidth || 1;
        el.scrollTo({ left: clamped * width, behavior: "smooth" });
    };

    const scrollBy = (dir) => goto(active + dir);

    // Keyboard navigation (left/right)
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "ArrowLeft") scrollBy(-1);
            if (e.key === "ArrowRight") scrollBy(1);
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [active, slides.length, slideW]);

    return (
        <div className="relative group">
            <div
                ref={trackRef}
                className="carousel hide-scrollbar"
                style={{ scrollSnapType: "x mandatory" }}
                aria-roledescription="carousel"
                aria-label={`${title} media`}
            >
                {slides.map((s, i) => (
                    <div key={i} className="slide" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`}>
                        <div className="media" style={{ aspectRatio: typeof aspect === "number" ? `${aspect}` : aspect }}>
                            {s.type === "video" ? (
                                <FitVideo src={s.src} poster={s.poster} targetAR={targetAR} forceContain={forceContain} />
                            ) : (
                                <FitImage
                                    src={s.src}
                                    alt={`${title} ${i === 0 ? "main" : `screenshot ${i}`}`}
                                    targetAR={targetAR}
                                    forceContain={forceContain}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showArrows && slides.length > 1 && (
                <>
                    <button type="button" aria-label="Previous" onClick={() => scrollBy(-1)} className="btn-circle left-2">
                        ‹
                    </button>
                    <button type="button" aria-label="Next" onClick={() => scrollBy(1)} className="btn-circle right-2">
                        ›
                    </button>
                </>
            )}

            {showDots && slides.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            aria-label={`Go to slide ${i + 1}`}
                            onClick={() => goto(i)}
                            className={`h-2 w-2 rounded-full ${i === active ? "bg-white/90" : "bg-white/40"}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}