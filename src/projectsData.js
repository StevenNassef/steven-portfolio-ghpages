import { getMediaUrl, getHighQualityVideoUrl } from './config.js';

/**
 * Dynamically generates media paths based on naming convention:
 * - Main: {key}_main.jpeg
 * - Gallery: {key}_1.jpeg, {key}_2.jpeg, etc. (numbered sequentially)
 * - Video: {key}.mp4 or {key}.MP4
 * - Poster: First numbered image (e.g., {key}_1.jpeg)
 * 
 * @param {string} key - Project key (folder name)
 * @param {object} options - Configuration options
 * @param {number} options.maxImages - Maximum number of images to generate (default: 20)
 * @param {string[]} options.extensions - Image extensions to try (default: ['.jpeg'])
 */
function generateMediaPaths(key, options = {}) {
    const { maxImages = 20, extensions = ['.jpeg'] } = options;
    const projectPath = `/projects/${key}`;
    
    // Main image
    const main = getMediaUrl(`${projectPath}/${key}_main.jpeg`);
    
    // Gallery array
    const gallery = [];
    
    // Try to add video (both lowercase and uppercase extensions)
    const videoExtensions = ['.mp4'];
    for (const ext of videoExtensions) {
        const videoPath = getHighQualityVideoUrl(`${projectPath}/${key}${ext}`);
        const videoPathLow = getMediaUrl(`${projectPath}/${key}_low${ext}`);
        // Get poster from first numbered image
        const poster = getMediaUrl(`${projectPath}/${key}_1.jpeg`);
        gallery.push({
            type: "video",
            src: videoPath, // High quality (original) - uses HIGH_QUALITY_VIDEO_BASE_URL
            srcLow: videoPathLow, // Low quality (for home screen) - uses MEDIA_BASE_URL
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
        ...generateMediaPaths("mergedom", { maxImages: 8 }),
        aspectRatio: "9 / 19.5",
        itemsPerView: 3,
        genre: "Merge & Design",
        description: "A highly successful merge-3 puzzle game combined with home design mechanics, where players merge items to unlock and customize beautiful living spaces. With over 20 million downloads, this game showcases advanced live-ops infrastructure, sophisticated monetization systems, and seamless seasonal content delivery.",
        timeline: "2025",
        jobTitle: "Senior Unity Engineer",
        teamSize: 14,
        engine: "Unity",
        duration: "Ongoing",
        bullets: [
            "Advanced merge-3 mechanics with complex item hierarchies and progression systems that maintain player engagement for months.",
            "Feature flags infrastructure enabling real-time A/B testing and gradual feature rollouts without app updates.",
            "Comprehensive IAP system with multiple monetization strategies including subscriptions, consumables, and premium currencies.",
            "Live-ops content pipeline supporting seasonal events (Throwback Treasure, Chocolate Box) with remote configuration.",
            "Advanced home design customization system with thousands of furniture combinations and room layouts.",
            "Real-time analytics integration tracking player behavior, retention, and monetization metrics across multiple SDKs.",
            "Performance optimization delivering consistent 60fps on mid-range devices with complex visual effects and animations.",
            "Modular SDK architecture supporting analytics (Firebase), attribution (Singular), and third-party services.",
            "Dynamic difficulty adjustment system that adapts to player skill level and maintains optimal engagement.",
            "Cloud save system with cross-device synchronization and conflict resolution.",
        ],
        gameplayMechanics: [
            "Merge-3 puzzle gameplay with strategic depth and resource management",
            "Home design mode with drag-and-drop furniture placement and room customization",
            "Energy system with timed refills and bonus energy rewards",
            "Collection system tracking hundreds of unique items and furniture pieces",
            "Achievement system with rewards and progression tracking",
            "Daily challenges and special events with exclusive rewards",
        ],
        highlights: [
            "20M+ downloads across iOS and Android platforms",
            "4.6/5.0 average rating with high player retention",
            "100K+ daily active users with strong engagement metrics",
            "Featured in App Store and Google Play Store",
            "Successful live-ops events driving consistent revenue",
        ],
        stack: ["Unity", "C#", "Live-Ops", "In-App Purchases", "Firebase", "AppsFlyer", "Singular", "Kinoa"],
        challenges: [
            "Fixed In App Purchases reduced failed transactions by 90%",
            "Designed flexible live-ops system with JSON-based configuration allowing remote content updates, event scheduling, and A/B test variations without requiring app releases.",
            "Optimized rendering pipeline using Unity's SRP batching, GPU instancing, and texture atlasing to achieve smooth performance with detailed home designs containing hundreds of decorative elements.",
            "Integrated multiple SDKs (Firebase Analytics, Singular Attribution, Kinoa) while maintaining code modularity through dependency injection and interface abstractions, enabling easy SDK swaps and testing.",
            "Built scalable analytics infrastructure processing millions of events daily with minimal performance impact on gameplay.",
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
        ...generateMediaPaths("kortifo", { maxImages: 16 }),
        aspectRatio: "9 / 19.5",
        itemsPerView: 3,
        genre: "Card Strategy",
        description: "An innovative card-based strategy game that combines tactical gameplay with intuitive mobile controls. Led development from concept to launch, architecting core systems, implementing smooth card animations, and building engaging progression mechanics that keep players coming back.",
        timeline: "2023-2024",
        jobTitle: "Lead Game Programmer",
        teamSize: 8,
        engine: "Unity",
        duration: "8 months",
        bullets: [
            "Complex card-based gameplay with strategic depth, combo systems, and tactical decision-making.",
            "Intuitive touch controls with drag-and-drop mechanics, card flicking, and gesture recognition optimized for mobile.",
            "Custom UI framework featuring smooth card animations, transitions, and particle effects for satisfying interactions.",
            "Advanced state management system handling complex card game logic, turn-based gameplay, and multiplayer synchronization.",
            "Cloud save system with cross-device synchronization and offline mode support.",
            "Comprehensive progression system with unlockable cards, achievements, and daily rewards.",
            "Balanced card economy with rarity systems, upgrade mechanics, and collection tracking.",
            "Performance optimization delivering 60fps with hundreds of animated cards and visual effects.",
            "Modular architecture supporting easy addition of new card types, abilities, and game modes.",
            "Analytics integration tracking player behavior, card usage, and monetization metrics.",
        ],
        gameplayMechanics: [
            "Strategic card battles with turn-based combat system",
            "Card collection and deck building with hundreds of unique cards",
            "Combo system rewarding strategic card combinations",
            "Resource management with multiple currency types",
            "Campaign mode with progressive difficulty and story elements",
            "Multiplayer PvP battles with matchmaking and ranking systems",
        ],
        highlights: [
            "150K+ downloads with strong player retention",
            "4.4/5.0 average rating with positive user feedback",
            "Featured in App Store and Google Play Store",
            "Successfully launched on both iOS and Android platforms",
        ],
        stack: ["Unity", "C#", "Unity Game Services", "Cloud Code", "Firebase", "Analytics", "In-App Purchases", "Singular"],
        challenges: [
            "Optimized card rendering using Unity's UI system with object pooling, sprite atlasing, and batched draw calls to achieve 60fps on mid-range devices with hundreds of animated cards simultaneously on screen.",
            "Implemented efficient state management using command pattern and state machine architecture to handle complex card game logic, undo/redo functionality, and network synchronization for multiplayer.",
            "Designed scalable progression system with data-driven card definitions, balanced economy curves, and flexible unlock systems that maintain player engagement over extended play sessions.",
            "Built custom animation system for card interactions using Unity's animation system and DOTween, creating satisfying visual feedback for every player action.",
            "Architected modular card system allowing designers to easily create new cards, abilities, and effects through data configuration without code changes.",
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
        role: "Sole Developer",
        ...generateMediaPaths("cairo_invaiders", { maxImages: 2 }),
        aspectRatio: "16 / 9",
        itemsPerView: 1,
        genre: "Action Shooter",
        description: "A fast-paced top-down action shooter set in the heart of Cairo, featuring unique Egyptian-themed visuals and intense alien invasion gameplay. Developed in just one week, this game showcases efficient game development practices with responsive touch controls, dynamic enemy waves, and stunning visual effects.",
        timeline: "2021-2022",
        jobTitle: "Lead Game Developer",
        teamSize: 3,
        engine: "Unity",
        duration: "1 week",
        bullets: [
            "Dynamic enemy wave system with data-driven design supporting hundreds of unique enemy patterns and behaviors.",
            "Adaptive difficulty scaling that analyzes player performance and adjusts challenge in real-time.",
            "Stunning Egyptian-themed art style with custom shader effects, particle systems, and post-processing.",
            "Advanced object pooling system handling hundreds of bullets, enemies, and effects simultaneously.",
            "Efficient level design pipeline with JSON-based configuration enabling rapid content creation.",
            "Performance optimization achieving consistent 60fps with hundreds of enemies and particles on screen.",
            "Touch control system with virtual joystick, auto-aim assistance, and customizable sensitivity.",
            "Leaderboard system tracking high scores and player achievements.",
        ],
        gameplayMechanics: [
            "Top-down shooter gameplay with 360-degree aiming and movement",
            "Wave-based enemy spawning with increasing difficulty and complexity",
            "Weapon system with multiple weapon types and modifiers",
            "Boss battles with unique patterns and attack sequences",
            "Score system with combo multipliers and bonus rewards",
        ],
        highlights: [
            "Developed in just 1 week from concept to playable prototype",
            "Showcases efficient game development and rapid prototyping skills",
            "Unique Egyptian-themed setting with culturally inspired visuals",
            "Smooth 60fps performance with hundreds of on-screen entities",
            "Published on itch.io with positive community feedback",
        ],
        stack: ["Unity", "C#", "Shaders", "Particle Systems"],
        challenges: [
            "Achieved consistent 60fps with hundreds of enemies, bullets, and particles on screen simultaneously using object pooling, spatial partitioning, and efficient rendering techniques.",
            "Designed flexible level editor system using ScriptableObjects and JSON configuration, enabling rapid content iteration and easy balancing without code changes.",
            "Implemented dynamic difficulty adjustment system that monitors player performance metrics and adjusts enemy spawn rates, health, and damage in real-time to maintain optimal challenge.",
            "Created custom shader effects for Egyptian-themed visuals including sand particles, heat distortion, and atmospheric effects that enhance immersion without sacrificing performance.",
        ],
        links: {
            itch: "https://omarelsayed997.itch.io/return-of-the-evil-eye",
        },
    },
    {
        key: "zarzura",
        title: "Zarzura",
        role: "Sole Developer",
        ...generateMediaPaths("zarzura", { maxImages: 11 }),
        aspectRatio: "9 / 19.5",
        itemsPerView: 3,
        genre: "Word Puzzle",
        description: "An engaging word-trivia mobile game that challenges players with vocabulary puzzles and brain teasers. With an impressive 4.9/5.0 rating, Zarzura features daily challenges, competitive leaderboards, and a comprehensive word database that keeps players coming back for more.",
        timeline: "2020-2021",
        jobTitle: "Lead Game Developer",
        teamSize: 3,
        engine: "Unity",
        duration: "10 months",
        bullets: [
            "Extensive word-trivia gameplay with thousands of puzzles and vocabulary challenges across multiple difficulty levels.",
            "Daily challenges and weekly events with exclusive rewards and special themes to maintain player engagement.",
            "Competitive leaderboard system with global rankings, friend comparisons, and social features.",
            "Fast, responsive gameplay with intuitive touch controls and swipe gestures optimized for mobile devices.",
            "Comprehensive word database with validation system handling tens of thousands of words and phrases.",
            "Achievement system with unlockable rewards, badges, and progression tracking.",
            "Power-up system providing strategic assistance while maintaining challenge and preventing frustration.",
            "Beautiful UI design with smooth animations, transitions, and engaging visual feedback.",
            "Analytics integration tracking player progress, puzzle completion rates, and engagement metrics.",
        ],
        gameplayMechanics: [
            "Word puzzle gameplay with multiple game modes (anagrams, word search, crosswords)",
            "Progressive difficulty system with hundreds of levels and challenges",
            "Daily challenge system with unique puzzles and time-limited rewards",
            "Power-up system with multiple hint types and strategic assistance",
            "Statistics system tracking completed puzzles and achievements",
            "Social features with leaderboards, friend comparisons, and sharing",
        ],
        highlights: [
            "Exceptional 4.9/5.0 average rating demonstrating high player satisfaction",
            "10K+ downloads with strong player retention and engagement",
            "Featured in App Store with positive reviews and recommendations",
            "High-quality word database with comprehensive vocabulary coverage",
        ],
        stack: ["Unity", "C#", "Mobile UI", "Playfab"],
        challenges: [
            "Designed scalable content system using JSON configuration and data-driven design patterns, enabling easy addition of new puzzles, challenges, and game modes without code changes.",
            "Optimized UI performance using Unity's Canvas system with object pooling, efficient batching, and minimal draw calls to achieve smooth 60fps transitions and animations.",
            "Built comprehensive word database system with multiple language support, difficulty classification, and categorization for easy content management and expansion.",
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
        role: "Sole Developer",
        ...generateMediaPaths("coin_forge", { maxImages: 6 }),
        aspectRatio: "9 / 19.5",
        itemsPerView: 3,
        genre: "Idle Incremental",
        description: "An engaging incremental/idle game where players forge coins, build automated production chains, and expand their empire. Developed solo in just 3 weeks, this game features deep progression systems, sophisticated economy balancing, and full store operations from submission to analytics.",
        timeline: "2022-2023",
        jobTitle: "Unity Game Developer",
        teamSize: 1,
        engine: "Unity",
        duration: "3 weeks",
        bullets: [
            "Deep incremental mechanics with exponential progression curves and prestige systems designed for long-term engagement.",
            "Automated production chains with upgradeable buildings, resource management, and optimization strategies.",
            "Efficient save system handling complex game state with compression, encryption, and cloud backup support.",
            "Comprehensive analytics dashboard tracking player progression, monetization metrics, and engagement data.",
            "Balanced economy system with multiple resource types, exchange rates, and upgrade costs.",
        ],
        gameplayMechanics: [
            "Idle gameplay with automated coin production and resource generation",
            "Building upgrade system with multiple tiers and specialization options",
            "Achievement system with rewards and milestone tracking",
        ],
        highlights: [
            "Developed solo in just 3 weeks from concept to store submission",
            "Successfully published on App Store with full store operations",
            "Demonstrates expertise in incremental game design and economy balancing",
            "Comprehensive analytics integration for data-driven optimization",
        ],
        stack: ["Unity", "C#", "Analytics"],
        challenges: [
            "Designed balanced progression curves using mathematical modeling and playtesting to maintain player engagement over months of play, with carefully tuned exponential growth rates.",
            "Built comprehensive analytics dashboard integrating multiple SDKs to track player progression, monetization metrics, retention rates, and engagement patterns, enabling data-driven decisions for game balancing and monetization optimization.",
        ],
        links: {
            appStore: "https://apps.apple.com/app/id1524642004",
        },
    },
    {
        key: "rent_lord",
        title: "Rent Lord",
        role: "Sole Developer",
        ...generateMediaPaths("rent_lord", { maxImages: 6 }),
        aspectRatio: "9 / 19.5",
        itemsPerView: 3,
        genre: "Simulation Management",
        description: "A comprehensive property management simulation game where players build and manage a real estate empire. Developed solo in 4 weeks, this game features complex economy systems, and sophisticated analytics integration for data-driven optimization.",
        timeline: "2022-2023",
        jobTitle: "Unity Game Developer",
        teamSize: 1,
        engine: "Unity",
        duration: "4 weeks",
        bullets: [
            "Comprehensive property management mechanics with building upgrades, tenant management, and maintenance systems.",
            "Advanced analytics integration tracking player behavior, monetization metrics, retention rates, and economy balance.",
            "Property acquisition system with multiple property types, locations, and investment strategies.",
            "Tenant management with happiness systems, rent collection, and property maintenance requirements.",
            "Upgrade system with multiple upgrade paths, efficiency improvements, and visual enhancements.",
            "Achievement system with milestones, rewards, and progression tracking.",
        ],
        gameplayMechanics: [
            "Property management with building purchase, upgrade, and customization",
            "Tenant system with happiness tracking and rent collection",
            "Progression system with multiple property types and locations",
        ],
        highlights: [
            "Developed solo in 4 weeks from concept to store submission",
            "Complex economy system demonstrating advanced game design skills",
            "Successfully published on App Store",
        ],
        stack: ["Unity", "C#"],
        challenges: [
            "Integrated multiple analytics SDKs (Firebase Analytics, Adjust Attribution) creating comprehensive tracking system that monitors player behavior, monetization metrics, retention rates, and economy balance, enabling data-driven decisions for game balancing and optimization.",
            "Built property management system with complex state management handling hundreds of properties, tenants, upgrades, and transactions while maintaining performance and data integrity.",
        ],
        links: {
            appStore: "https://apps.apple.com/us/app/rent-lord/id1530679994",
        },
    },
    {
        key: "rocket_factory",
        title: "Rocket Factory",
        role: "Sole Developer",
        ...generateMediaPaths("rocket_factory", { maxImages: 8 }),
        aspectRatio: "9 / 19.5",
        itemsPerView: 3,
        genre: "Factory Management",
        description: "An engaging factory management game where players build and manage a rocket production facility. Developed solo in 3 weeks, this game features production chains, automation systems, and upgrade mechanics that allow players to expand their factory and produce increasingly complex rockets.",
        timeline: "2021-2022",
        jobTitle: "Unity Game Developer",
        teamSize: 1,
        engine: "Unity",
        duration: "3 weeks",
        bullets: [
            "Factory management gameplay with production chains, resource management, and automation systems.",
            "Extensive rocket production system with multiple rocket types, components, and upgrade paths.",
            "Resource management system tracking materials, components, and finished rockets with inventory management.",
            "Progressive upgrade system allowing players to unlock new production capabilities and rocket types.",
            "Performance optimization achieving smooth 60fps with complex factory layouts and multiple production lines.",
            "Visual feedback system showing production progress, resource flows, and factory efficiency metrics.",
            "Save system allowing players to maintain factory progress and resume gameplay across sessions.",
            "Achievement system rewarding efficient factory management and production milestones.",
        ],
        gameplayMechanics: [
            "Factory management with building placement and production chain optimization",
            "Resource collection and management with multiple material types",
            "Production automation with upgradeable machines and efficiency improvements",
            "Rocket assembly system with component crafting and final assembly",
            "Progress tracking with production goals and achievement milestones",
        ],
        highlights: [
            "Developed solo in 3 weeks from concept to store submission",
            "Successfully published on App Store",
            "Demonstrates factory management and automation game design skills",
            "Optimized for mobile with efficient asset management and performance",
        ],
        stack: ["Unity", "C#"],
        challenges: [
            "Built production chain system with data-driven configuration allowing easy addition of new buildings, resources, and recipes through configuration files, enabling rapid content expansion without code changes.",
            "Implemented efficient resource management and inventory system handling multiple resource types, production rates, and storage capacities while maintaining smooth performance and responsive UI updates.",
            "Designed upgrade and progression system with balanced economy curves, unlock requirements, and reward structures that maintain player engagement and provide clear sense of progression throughout the game.",
        ],
        links: {
            appStore: "https://apps.apple.com/app/id1524159055",
            // playStore: "https://play.google.com/...",
        },
    },
    {
        key: "jumpy_shooter",
        title: "Jumpy Shooter",
        role: "Sole Developer",
        ...generateMediaPaths("jumpy_shooter", { maxImages: 3 }),
        aspectRatio: "9 / 19.5",
        itemsPerView: 3,
        genre: "Action Platformer",
        description: "An intense action-packed mobile shooter that combines precise platforming mechanics with fast-paced shooting gameplay. Developed solo in just 2 weeks, this game features procedurally generated levels, diverse weapon systems, and satisfying upgrade mechanics that keep players coming back for more.",
        timeline: "2021-2022",
        jobTitle: "Unity Game Developer",
        teamSize: 1,
        engine: "Unity",
        duration: "2 weeks",
        bullets: [
            "Fast, responsive gameplay with intuitive touch controls, precise jump mechanics, and smooth movement.",
            "Procedurally generated levels with dynamic enemy placement, platform layouts, and difficulty scaling.",
            "Power-up system offering a variety of temporary boosts and abilities to enhance gameplay.",
            "Optimized rendering pipeline achieving consistent 60fps on mobile devices with hundreds of bullets and enemies.",
            "Advanced object pooling system efficiently managing bullets, enemies, particles, and power-ups.",
            "Multiple weapon types with unique firing patterns, damage values, and upgrade paths.",
        ],
        gameplayMechanics: [
            "Platformer gameplay with precise jumping and movement controls",
            "Shooting mechanics with multiple weapon types and firing patterns",
            "Procedurally generated levels with increasing difficulty",
            "Power-up collection with temporary boosts and abilities",
            "Enemy AI Logic with multiple enemy types and behaviors"
        ],
        highlights: [
            "Developed solo in just 2 weeks from concept to store submission",
            "Successfully published on App Store",
            "Demonstrates rapid prototyping and efficient development practices",
            "Smooth 60fps performance with complex gameplay systems",
            "Engaging procedural generation keeping gameplay fresh and challenging",
        ],
        stack: ["Unity", "C#"],
        challenges: [
            "Balanced jump physics and shooting mechanics through extensive playtesting and iterative design, creating satisfying gameplay feel with responsive controls that provide precision and fluidity while maintaining accessibility for casual players.",
            "Implemented efficient object pooling system using custom pool managers with pre-allocation, recycling, and cleanup strategies to handle hundreds of bullets, enemies, and particles simultaneously while maintaining 60fps performance and minimal memory allocation.",
            "Designed flexible procedural level generation system using rule-based algorithms, difficulty curves, and content templates that create varied, engaging levels while maintaining consistent challenge progression and preventing impossible scenarios.",
            "Optimized rendering pipeline using sprite batching, texture atlasing, and efficient draw call management to achieve smooth performance with complex visual effects, multiple enemy types, and numerous projectiles on screen.",
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
 * Contact links for social media and email
 * Centralized contact information used across the portfolio
 */
export const contactLinks = {
    email: 'contact@stevennassef.com',
    ccEmail: 'stevennassef97@gmail.com',
    github: 'https://github.com/StevenNassef',
    linkedin: 'https://www.linkedin.com/in/steven-nassef/',
};

/**
 * Company configuration for logos and icons
 * Each company includes local icon path, LinkedIn URL, icon URL, and Clearbit logo
 */
export const companyConfig = {
    'Carry1st': { 
        label: 'Carry1st',
        // localIcon: '/company-icons/carry1st.png',
        linkedinUrl: 'https://www.linkedin.com/company/carry1st/',
        // iconUrl: 'https://cdn.simpleicons.org/carry1st/000000',
        clearbitLogo: 'https://logo.clearbit.com/carry1st.com',
    },
    'Umami Games': { 
        label: 'Umami Games',
        // localIcon: '/company-icons/umami-games.png',
        linkedinUrl: 'https://www.linkedin.com/company/umami-games1/',
        // iconUrl: 'https://cdn.simpleicons.org/umami/000000',
        clearbitLogo: 'https://logo.clearbit.com/umamigames.com',
    },
    'Kob Games Studios': { 
        label: 'Kob Games Studios',
        // localIcon: '/company-icons/kob-studios.png',
        linkedinUrl: 'https://www.linkedin.com/company/kobgames/',
        // iconUrl: 'https://cdn.simpleicons.org/kobgames/000000',
        clearbitLogo: 'https://logo.clearbit.com/kobgames.com',
    },
    'Yajulu': { 
        label: 'Yajulu',
        // localIcon: '/company-icons/yajulu.png',
        linkedinUrl: 'https://www.linkedin.com/company/yajulu/',
        // iconUrl: 'https://cdn.simpleicons.org/yajulu/000000',
        clearbitLogo: 'https://logo.clearbit.com/yajulu.com',
    },
};