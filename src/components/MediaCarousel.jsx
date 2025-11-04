// src/components/MediaCarousel.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";

function parseAspect(aspect) {
    if (typeof aspect === "number") return aspect;
    const [w, h] = String(aspect || "").split("/").map(s => Number(s.trim()));
    return Number.isFinite(w) && Number.isFinite(h) && h !== 0 ? w / h : 16 / 9;
}

function FitImage({ src, alt, targetAR, onDetectAR }) {
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
                setContain(ar < targetAR);
            }}
            className={`w-full h-full ${contain ? "object-contain" : "object-cover"} object-center`}
            style={{ objectFit: contain ? "contain" : "cover" }}
        />
    );
}

function FitVideo({ src, poster, targetAR, onDetectAR }) {
    const [contain, setContain] = useState(false);
    return (
        <video
            src={src}
            poster={poster}
            controls
            playsInline
            muted
            onLoadedMetadata={(e) => {
                const v = e.currentTarget;
                const ar = (v.videoWidth || 0) / (v.videoHeight || 1);
                onDetectAR?.(ar);
                setContain(ar < targetAR);
            }}
            className={`w-full h-full ${contain ? "object-contain" : "object-cover"} object-center`}
            style={{ objectFit: contain ? "contain" : "cover" }}
        />
    );
}

export default function MediaCarousel({
                                          title,
                                          main,
                                          gallery = [],
                                          aspect = "16 / 9",
                                          showDots = true,
                                          showArrows = true,
                                      }) {
    const GAP_PX = 12;
    const targetAR = useMemo(() => parseAspect(aspect), [aspect]);

    const slides = useMemo(() => {
        const items = [];
        if (main) items.push({ type: "image", src: main });
        for (const g of gallery) if (g?.src) items.push({ type: g.type === "video" ? "video" : "image", src: g.src, poster: g.poster });
        return items.length ? items : [{ type: "image", src: main || "" }];
    }, [main, gallery]);

    const trackRef = useRef(null);
    const [containerW, setContainerW] = useState(0);
    const [ratios, setRatios] = useState({});
    const onAR = (i, r) => setRatios(prev => (prev[i] === r ? prev : { ...prev, [i]: r }));

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        const update = () => setContainerW(el.clientWidth || 1);
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        addEventListener("resize", update);
        return () => { removeEventListener("resize", update); ro.disconnect(); };
    }, []);

    const isHintWide = (src, idx) => idx === 0 || /(^|\/)[^/]*(_|-)?main\.[a-z0-9]+$/i.test(src);
    const isWideAR = (ar) => ar && ar >= (16 / 9) * 0.975; // ~2.5% tolerance

    // Build pages: wide => its own page; narrow => groups of 3
    const pages = useMemo(() => {
        const list = slides.map((s, i) => ({ ...s, index: i, ar: ratios[i], hintWide: isHintWide(s.src || "", i) }));
        const out = [];
        let buf = [];
        const flush = () => { if (buf.length) { out.push({ type: "narrow", items: buf }); buf = []; } };

        for (const it of list) {
            if (it.hintWide || isWideAR(it.ar)) { flush(); out.push({ type: "wide", items: [it] }); }
            else { buf.push(it); if (buf.length === 3) flush(); }
        }
        flush();
        return out.length ? out : [{ type: "wide", items: [list[0]] }];
    }, [slides, ratios]);

    const [activePage, setActivePage] = useState(0);
    useEffect(() => setActivePage(0), [pages.length]);

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        const onScroll = () => setActivePage(Math.max(0, Math.min(Math.round(el.scrollLeft / (el.clientWidth || 1)), pages.length - 1)));
        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, [pages.length]);

    const gotoPage = (i) => {
        const el = trackRef.current; if (!el) return;
        const idx = Math.max(0, Math.min(i, pages.length - 1));
        el.scrollTo({ left: idx * (el.clientWidth || 1), behavior: "smooth" });
    };
    const frameH = Math.round((containerW || 1) / (16 / 9));
    const thirdBasis = "calc((100% - 2 * var(--gap, 12px)) / 3)";

    return (
        <div className="relative group">
            <div
                ref={trackRef}
                className="carousel hide-scrollbar"
                style={{ scrollSnapType: "x mandatory" }}
                aria-roledescription="carousel"
                aria-label={`${title} media`}
            >
                {pages.map((pg, p) => (
                    <div key={p} className="page" style={{ flex: "0 0 100%", gap: "var(--gap, 12px)", justifyContent: "center" }}>
                        {pg.type === "wide" ? (
                            <div className="media bg-card" style={{ aspectRatio: "16 / 9", width: "100%" }}>
                                {pg.items[0].type === "video"
                                    ? <FitVideo src={pg.items[0].src} poster={pg.items[0].poster} targetAR={16/9} onDetectAR={(r)=>onAR(pg.items[0].index, r)} />
                                    : <FitImage src={pg.items[0].src} alt={`${title} cover`} targetAR={16/9} onDetectAR={(r)=>onAR(pg.items[0].index, r)} />}
                            </div>
                        ) : (
                            pg.items.map((it, i) => (
                                <div key={i} className="media bg-card" style={{ height: `${frameH}px`, flex: `0 0 ${thirdBasis}` }}>
                                    {it.type === "video"
                                        ? <FitVideo src={it.src} poster={it.poster} targetAR={16/9} onDetectAR={(r)=>onAR(it.index, r)} />
                                        : <FitImage src={it.src} alt={`${title} screenshot ${i+1}`} targetAR={16/9} onDetectAR={(r)=>onAR(it.index, r)} />}
                                </div>
                            ))
                        )}
                    </div>
                ))}
            </div>

            {showArrows && pages.length > 1 && (
                <>
                    <button type="button" aria-label="Previous" onClick={()=>gotoPage(activePage-1)} className="btn-circle left-2">‹</button>
                    <button type="button" aria-label="Next" onClick={()=>gotoPage(activePage+1)} className="btn-circle right-2">›</button>
                </>
            )}

            {showDots && pages.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                    {Array.from({ length: pages.length }).map((_, i) => (
                        <button key={i} type="button" aria-label={`Go to page ${i+1}`} onClick={()=>gotoPage(i)}
                                className={`h-2 w-2 rounded-full ${i===activePage? "bg-white/90":"bg-white/40"}`} />
                    ))}
                </div>
            )}
        </div>
    );
}