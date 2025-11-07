import { getMediaUrl } from './config.js';

/**
 * Dynamically generates media paths based on naming convention:
 * - Main: {key}_main.jpeg or {key}_main.PNG
 * - Gallery: {key}_1.jpeg, {key}_2.jpeg, etc. (numbered sequentially)
 * - Video: {key}.mp4 or {key}.MP4
 * - Poster: First numbered image (e.g., {key}_1.jpeg)
 * 
 * @param {string} key - Project key (folder name)
 * @param {object} options - Configuration options
 * @param {number} options.maxImages - Maximum number of images to generate (default: 20)
 * @param {string[]} options.extensions - Image extensions to try (default: ['.jpeg', '.PNG'])
 */
function generateMediaPaths(key, options = {}) {
    const { maxImages = 20, extensions = ['.jpeg', '.PNG'] } = options;
    const projectPath = `/projects/${key}`;
    
    // Main image - try both extensions
    const main = getMediaUrl(`${projectPath}/${key}_main.jpeg`);
    
    // Gallery array
    const gallery = [];
    
    // Try to add video (both lowercase and uppercase extensions)
    const videoExtensions = ['.mp4', '.MP4'];
    for (const ext of videoExtensions) {
        const videoPath = getMediaUrl(`${projectPath}/${key}${ext}`);
        // Try to get poster from first numbered image
        const poster = getMediaUrl(`${projectPath}/${key}_1.jpeg`) || 
                       getMediaUrl(`${projectPath}/${key}_1.PNG`);
        gallery.push({
            type: "video",
            src: videoPath,
            poster: poster
        });
    }
    
    // Generate numbered images (1 to maxImages)
    // Use the first extension as default, or try all if multiple specified
    for (let i = 1; i <= maxImages; i++) {
        // If only one extension, use it; otherwise try all
        if (extensions.length === 1) {
            gallery.push({
                type: "image",
                src: getMediaUrl(`${projectPath}/${key}_${i}${extensions[0]}`)
            });
        } else {
            // Try all extensions - component will handle which ones load
            for (const ext of extensions) {
                gallery.push({
                    type: "image",
                    src: getMediaUrl(`${projectPath}/${key}_${i}${ext}`)
                });
            }
        }
    }
    
    return { main, gallery };
}

export const projects = [
    {
        key: "mergedom",
        title: "Mergedom: Home Design",
        role: "",
        ...generateMediaPaths("mergedom", { maxImages: 9, extensions: ['.PNG'] }),
        aspectRatio: "9 / 19.5",
        itemsPerView: 3,
        description: "A home design mobile game where players merge items to create beautiful spaces. Features core gameplay systems, feature flags, IAP integration, and live-ops content tooling for seasonal events and special promotions.",
        timeline: "2025",
        jobTitle: "Senior Unity Engineer",
        teamSize: 10,
        engine: "Unity",
        duration: "Ongoing",
        bullets: [
            "Core gameplay systems with merge mechanics and home design customization.",
            "Feature flags infrastructure for A/B testing and gradual feature rollouts.",
            "IAP integration with multiple monetization strategies and analytics tracking.",
            "Live-ops content tooling for seasonal events (e.g., Throwback Treasure, Chocolate Box).",
            "Performance profiling and optimization for smooth gameplay on mobile devices.",
            "SDK integrations for analytics, attribution, and third-party services.",
        ],
        stack: ["Unity", "C#", "Live-Ops", "IAP"],
        challenges: [
            "Implemented efficient merge mechanics that maintain performance with complex item hierarchies.",
            "Designed flexible live-ops system for remote content updates without app releases.",
            "Optimized rendering pipeline for smooth 60fps gameplay with detailed home designs.",
            "Integrated multiple SDKs while maintaining code modularity and testability.",
        ],
        links: {
            appStore: "https://apps.apple.com/app/id1549205071",
            playStore: "https://play.google.com/store/apps/details?id=com.mergedomhomedesign.game",
        },
        metrics: {
            downloads: "20M+",
            rating: "4.6",
            dau: "100K+",
        },
    },
    {
        key: "kortifo",
        title: "Kortifo",
        role: "",
        ...generateMediaPaths("kortifo", { maxImages: 16, extensions: ['.PNG'] }),
        aspectRatio: "9 / 19.5",
        itemsPerView: 3,
        description: "A mobile game combining card mechanics with strategic gameplay. Built from concept to launch as a solo project, focusing on intuitive touch controls and engaging progression systems.",
        timeline: "2023-2024",
        jobTitle: "Lead Game Programmer",
        teamSize: 4,
        engine: "Unity",
        duration: "8 months",
        bullets: [
            "Card-based gameplay with strategic depth and progression systems.",
            "Intuitive touch controls optimized for mobile devices.",
            "Custom UI framework for smooth card animations and interactions.",
            "Save system with cloud sync capabilities.",
        ],
        stack: ["Unity", "C#"],
        challenges: [
            "Optimized card rendering and animations for 60fps on mid-range devices.",
            "Implemented efficient state management for complex card game logic.",
            "Designed scalable progression system that maintains player engagement.",
        ],
        links: {
            appStore: "https://apps.apple.com/app/id6466821053",
            playStore: "https://play.google.com/store/apps/details?id=com.UMAMI.Kortifo",
            // github: "https://github.com/...",
        },
        metrics: {
            downloads: "150K+",
            rating: "4.4",
            dau: "5K+",
        },
    },
    {
        key: "cairo_invaiders",
        title: "The Second Time Aliens Invaded Cairo",
        role: "",
        ...generateMediaPaths("cairo_invaiders", { maxImages: 16, extensions: ['.PNG'] }),
        aspectRatio: "16 / 9",
        itemsPerView: 1,
        description: "A fast-paced action game set in Cairo with unique Egyptian-themed visuals. Features responsive touch controls and dynamic enemy wave systems that scale difficulty progressively.",
        timeline: "2021-2022",
        jobTitle: "Lead Game Developer",
        teamSize: 1,
        engine: "Unity",
        duration: "1 week",
        bullets: [
            "Fast, responsive gameplay with touch controls optimized for mobile.",
            "Content pipeline for levels & enemy waves with data-driven design.",
            "Dynamic difficulty scaling that adapts to player skill level.",
            "Egyptian-themed art style with custom shader effects.",
        ],
        stack: ["Unity", "C#", "Mobile UI"],
        challenges: [
            "Achieved consistent 60fps with hundreds of enemies on screen simultaneously.",
            "Designed flexible level editor system for rapid content iteration.",
            "Balanced touch controls for precision gameplay on various screen sizes.",
        ],
        links: {
            itch: "https://omarelsayed997.itch.io/return-of-the-evil-eye",
        },
    },
    {
        key: "zarzura",
        title: "Zarzura",
        role: "",
        ...generateMediaPaths("zarzura"),
        aspectRatio: "9 / 19.5",
        itemsPerView: 3,
        description: "A word-trivia mobile game that challenges players with engaging puzzles and vocabulary challenges. Features daily challenges, leaderboards, and a comprehensive word database.",
        timeline: "2020-2021",
        jobTitle: "Lead Game Developer",
        teamSize: 1,
        engine: "Unity",
        duration: "10 months",
        bullets: [
            "Word-trivia gameplay with extensive vocabulary database.",
            "Daily challenges and weekly events to maintain player engagement.",
            "Leaderboard system with social features and achievements.",
            "Fast, responsive gameplay with touch controls optimized for mobile.",
        ],
        stack: ["Unity", "C#", "Mobile UI"],
        challenges: [
            "Implemented efficient word validation system handling thousands of words.",
            "Designed scalable content system for easy addition of new puzzles and challenges.",
            "Optimized UI performance for smooth transitions and animations.",
        ],
        links: {
            appStore: "https://apps.apple.com/app/id1599258541",
          }
          ,
          metrics: {
            downloads: "10K+",
            rating: "4.9",
            dau: "500",
        },
    },
    {
        key: "coin_forge",
        title: "Coin Forge",
        role: "",
        ...generateMediaPaths("coin_forge"),
        aspectRatio: "9 / 19.5",
        itemsPerView: 3,
        description: "An incremental/idle game where players forge coins and build their empire. Features deep progression systems, automated production chains, and comprehensive store operations including IAP and analytics.",
        timeline: "2022-2023",
        jobTitle: "Unity Game Developer",
        teamSize: 1,
        engine: "Unity",
        duration: "3 weeks",
        bullets: [
            "Incremental mechanics & balancing tools for long-term player engagement.",
            "Store submission, analytics, and updates with full CI/CD pipeline.",
            "Automated production systems with upgradeable buildings and resources.",
            "IAP integration with multiple monetization strategies and A/B testing.",
        ],
        stack: ["Unity", "C#", "Store Ops"],
        challenges: [
            "Designed balanced progression curves that maintain engagement over months of play.",
            "Implemented efficient save system handling large amounts of game state data.",
            "Built comprehensive analytics dashboard for tracking player progression and monetization.",
            "Managed full app store submission process including metadata, screenshots, and compliance.",
        ],
        links: {
            appStore: "https://apps.apple.com/app/id1524642004",
        },
    },
    {
        key: "rent_lord",
        title: "Rent Lord",
        role: "",
        ...generateMediaPaths("rent_lord"),
        aspectRatio: "9 / 19.5",
        itemsPerView: 3,
        description: "A property management simulation game where players build and manage a real estate empire. Features complex economy systems, live-ops events, and comprehensive analytics integration.",
        timeline: "2022-2023",
        jobTitle: "Unity Game Developer",
        teamSize: 1,
        engine: "Unity",
        duration: "4 weeks",
        bullets: [
            "Complex economy systems with daily/weekly events and seasonal content.",
            "Live-ops hooks & telemetry for data-driven game balancing.",
            "Property management mechanics with upgrade systems and tenant management.",
            "Analytics integration for tracking player behavior and monetization metrics.",
        ],
        stack: ["Unity", "C#", "Analytics"],
        challenges: [
            "Designed scalable economy system that maintains balance across progression tiers.",
            "Implemented live-ops infrastructure for remote content updates without app releases.",
            "Integrated multiple analytics SDKs (Firebase, Adjust) for comprehensive tracking.",
        ],
        links: {
            appStore: "https://apps.apple.com/us/app/rent-lord/id1530679994",
        },
    },
    {
        key: "rocket_factory",
        title: "Rocket Factory",
        role: "",
        ...generateMediaPaths("rocket_factory"),
        aspectRatio: "9 / 19.5",
        itemsPerView: 3,
        description: "A physics-based puzzle game where players assemble rockets from various components. Features realistic physics simulation, component customization, and launch mechanics that test player creativity.",
        timeline: "2021-2022",
        jobTitle: "Unity Game Developer",
        teamSize: 1,
        engine: "Unity",
        duration: "3 weeks",
        bullets: [
            "Physics-driven assembly gameplay with realistic component interactions.",
            "Optimized asset pipeline for mobile using Unity Addressables system.",
            "Component customization system with hundreds of part combinations.",
            "Launch simulation with physics-based trajectory calculations.",
        ],
        stack: ["Unity", "C#", "Addressables"],
        challenges: [
            "Implemented efficient physics simulation that maintains performance with complex assemblies.",
            "Designed Addressables workflow for dynamic content loading and reduced initial download size.",
            "Balanced physics parameters for satisfying gameplay while maintaining realism.",
        ],
        links: {
            appStore: "https://apps.apple.com/app/id1524159055",
            // playStore: "https://play.google.com/...",
        },
    },
    {
        key: "jumpy_shooter",
        title: "Jumpy Shooter",
        role: "",
        ...generateMediaPaths("jumpy_shooter"),
        aspectRatio: "9 / 19.5",
        itemsPerView: 3,
        description: "An action-packed mobile shooter combining platforming mechanics with shooting gameplay. Features procedurally generated levels and upgrade systems that keep players engaged.",
        timeline: "2021-2022",
        jobTitle: "Unity Game Developer",
        teamSize: 1,
        engine: "Unity",
        duration: "2 weeks",
        bullets: [
            "Fast, responsive gameplay with touch controls and intuitive jump mechanics.",
            "Content pipeline for levels & enemy waves with procedural generation elements.",
            "Progressive upgrade system with multiple weapon types and power-ups.",
            "Optimized rendering pipeline for smooth 60fps gameplay on mobile devices.",
        ],
        stack: ["Unity", "C#", "Mobile UI"],
        challenges: [
            "Balanced jump physics and shooting mechanics for satisfying gameplay feel.",
            "Implemented efficient object pooling system for bullets and enemies.",
            "Designed flexible level generation system that maintains challenge progression.",
        ],
        links: {
            appStore: "https://apps.apple.com/app/id1514741492",
            // playStore: "https://play.google.com/...",
        },
    },
];

/**
 * Experience data for the Experience Snapshot section
 * Each experience includes company, role, period, and description
 */
export const experiences = [
    {
        company: 'Carry1st',
        role: 'Senior Unity Engineer',
        period: '2025',
        description: '<b>Mergedom: Home Design</b> — core gameplay systems, feature flags, IAP & live‑ops content tooling (e.g., Throwback Treasure, Chocolate Box), performance profiling, SDK integrations.',
    },
    {
        company: 'Umami Games',
        role: 'Lead Game Programmer',
        period: '2023–2025',
        description: '<b>Kortifo</b> — architected core systems, rapid prototyping, led feature development and code reviews. Card-based gameplay with strategic depth, custom UI framework, and cloud sync capabilities.',
    },
    {
        company: 'Yajulu',
        role: 'Lead Game Developer',
        displayTitle: 'Yajulu',
        period: '2021–2023',
        description: '<b>Zarzura</b> (word‑trivia), <b>The Second Time Aliens Invaded Cairo</b> — full lifecycle: design, implementation, launch, and updates.',
    },
    {
        company: 'Kob Games Studios',
        role: 'Unity Game Developer',
        period: '2020',
        description: '<b>Coin Forge</b>, <b>Rent Lord</b>, <b>Rocket Factory</b>, <b>Jumpy Shooter</b> — incremental/idle mechanics, complex economy systems, live‑ops infrastructure, analytics integration, and full app store submission process.',
    },
];

/**
 * Company configuration for logos and icons
 * Each company includes local icon path, LinkedIn URL, icon URL, and Clearbit logo
 */
export const companyConfig = {
    'Carry1st': { 
        label: 'Carry1st',
        localIcon: '/company-icons/carry1st.png',
        linkedinUrl: 'https://www.linkedin.com/company/carry1st/',
        iconUrl: 'https://cdn.simpleicons.org/carry1st/000000',
        clearbitLogo: 'https://logo.clearbit.com/carry1st.com',
    },
    'Umami Games': { 
        label: 'Umami Games',
        localIcon: '/company-icons/umami-games.png',
        linkedinUrl: 'https://www.linkedin.com/company/umami-games1/',
        iconUrl: 'https://cdn.simpleicons.org/umami/000000',
        clearbitLogo: 'https://logo.clearbit.com/umamigames.com',
    },
    'Kob Games Studios': { 
        label: 'Kob Games Studios',
        localIcon: '/company-icons/kob-studios.png',
        linkedinUrl: 'https://www.linkedin.com/company/kobgames/',
        iconUrl: 'https://cdn.simpleicons.org/kobgames/000000',
        clearbitLogo: 'https://logo.clearbit.com/kobgames.com',
    },
    'Yajulu': { 
        label: 'Yajulu',
        localIcon: '/company-icons/yajulu.png',
        linkedinUrl: 'https://www.linkedin.com/company/yajulu/',
        iconUrl: 'https://cdn.simpleicons.org/yajulu/000000',
        clearbitLogo: 'https://logo.clearbit.com/yajulu.com',
    },
};