import { getMediaUrl } from './config.js';

export const projects = [
    {
        key: "jumpy_shooter",
        title: "Jumpy Shooter",
        role: "Solo Developer",
        main: getMediaUrl("/projects/jumpy_shooter/jumpy_shooter_main.jpeg"),
        gallery: [
            { type: "video", src: getMediaUrl("/projects/jumpy_shooter/jumpy_shooter.mp4"), poster: getMediaUrl("/projects/jumpy_shooter/jumpy_shooter_1.jpeg") },
            { type: "image", src: getMediaUrl("/projects/jumpy_shooter/jumpy_shooter_2.jpeg") },
            { type: "image", src: getMediaUrl("/projects/jumpy_shooter/jumpy_shooter_3.jpeg") },
            { type: "image", src: getMediaUrl("/projects/jumpy_shooter/jumpy_shooter_3.jpeg") },
            // To add video later:
            // { type: "video", src: "/projects/jumpy_shooter/jumpy_shooter.mp4" },
        ],
        bullets: [
            "Fast, responsive gameplay with touch controls.",
            "Content pipeline for levels & enemy waves.",
        ],
        stack: ["Unity", "C#", "Mobile UI"],
    },
    {
        key: "rent_lord",
        title: "Rent Lord",
        role: "Solo Developer",
        main: getMediaUrl("/projects/rent_lord/rent_lord_main.jpeg"),
        gallery: [
            { type: "video", src: getMediaUrl("/projects/rent_lord/rent_lord.mp4"), poster: getMediaUrl("/projects/rent_lord/rent_lord_1.jpeg") },
            { type: "image", src: getMediaUrl("/projects/rent_lord/rent_lord_2.jpeg") },
            { type: "image", src: getMediaUrl("/projects/rent_lord/rent_lord_3.jpeg") },
            { type: "image", src: getMediaUrl("/projects/rent_lord/rent_lord_4.jpeg") },
        ],
        bullets: [
            "Economy systems with daily/weekly events.",
            "Live-ops hooks & telemetry.",
        ],
        stack: ["Unity", "C#", "Analytics"],
    },
    {
        key: "rocket_factory",
        title: "Rocket Factory",
        role: "Solo Developer",
        main: getMediaUrl("/projects/rocket_factory/rocket_factory_main.jpeg"),
        gallery: [
            { type: "video", src: getMediaUrl("/projects/rocket_factory/rocket_factory.mp4"), poster: getMediaUrl("/projects/coin_forge/rocket_factory_1.jpeg") },
            { type: "image", src: getMediaUrl("/projects/rocket_factory/rocket_factory_2.jpeg") },
            { type: "image", src: getMediaUrl("/projects/rocket_factory/rocket_factory_3.jpeg") },
        ],
        bullets: [
            "Physics-driven assembly gameplay.",
            "Optimized asset pipeline for mobile.",
        ],
        stack: ["Unity", "C#", "Addressables"],
    },
    {
        key: "coin_forge",
        title: "Coin Forge",
        role: "Solo Developer",
        main: getMediaUrl("/projects/coin_forge/coin_forge_main.jpeg"),
        gallery: [
            { type: "video", src: getMediaUrl("/projects/coin_forge/coin_forge.mp4"), poster: getMediaUrl("/projects/coin_forge/coin_forge_1.jpeg") },
            { type: "image", src: getMediaUrl("/projects/coin_forge/coin_forge_2.jpeg") },
            { type: "image", src: getMediaUrl("/projects/coin_forge/coin_forge_4.jpeg") },
        ],
        bullets: [
            "Incremental mechanics & balancing tools.",
            "Store submission, analytics, and updates.",
        ],
        stack: ["Unity", "C#", "Store Ops"],
    },
];