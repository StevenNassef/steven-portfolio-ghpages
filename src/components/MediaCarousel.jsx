import React, { useMemo, useRef, useState, useEffect } from "react";

export default function MediaCarousel({ title, main, gallery = [], aspect = "19.5 / 9" }) {
    const slides = useMemo(() => {
        const items = [];
        if (main) items.push({ type: "image", src: main });
        for (const g of gallery) items.push(g);
        return items;
    }, [main, gallery]);

    const trackRef = useRef(null);
    const [active, setActive] = useState(0);

    // Update active dot while scrolling
    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        const handler = () => {
            const idx = Math.round(el.scrollLeft / el.clientWidth);
            setActive(Math.min(Math.max(idx, 0), slides.length - 1));
        };
        el.addEventListener("scroll", handler, { passive: true });
        return () => el.removeEventListener("scroll", handler);
    }, [slides.length]);

    const scrollBy = (dir) => {
        const el = trackRef.current;
        if (!el) return;
        el.scrollBy({ left: dir * (el.clientWidth + 12), behavior: "smooth" });
    };

    return (
        <div className="relative group">
            <div
                ref={trackRef}
                className="carousel hide-scrollbar"
                style={{ scrollSnapType: "x mandatory" }}
            >
                {slides.map((s, i) => (
                    <div key={i} className="slide">
                        <div className="media" style={{ aspectRatio: aspect }}>
                            {s.type === "video" ? (
                                <video
                                    src={s.src}
                                    className="w-full h-full object-cover"
                                    controls
                                    playsInline
                                    muted
                                />
                            ) : (
                                <img
                                    src={s.src}
                                    alt={`${title} ${i === 0 ? "main" : `screenshot ${i}`}`}
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Prev / Next */}
            {slides.length > 1 && (
                <>
                    <button
                        type="button"
                        aria-label="Previous"
                        onClick={() => scrollBy(-1)}
                        className="btn-circle left-2"
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        aria-label="Next"
                        onClick={() => scrollBy(1)}
                        className="btn-circle right-2"
                    >
                        ›
                    </button>
                </>
            )}

            {/* Dots */}
            {slides.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                    {slides.map((_, i) => (
                        <span
                            key={i}
                            className={`h-2 w-2 rounded-full ${
                                i === active ? "bg-white/90" : "bg-white/40"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}