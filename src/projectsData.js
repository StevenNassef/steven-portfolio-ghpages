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
        key: "kortifo",
        title: "Kortifo",
        role: "Solo Developer",
        ...generateMediaPaths("kortifo", { maxImages: 16, extensions: ['.PNG'] }),
        bullets: [
            "Add your project description here.",
            "Add more bullet points as needed.",
        ],
        stack: ["Unity", "C#"],
    },
    {
        key: "cairo_invaiders",
        title: "The Second Time Aliens Invaded Cairo",
        role: "Solo Developer",
        ...generateMediaPaths("cairo_invaiders", { maxImages: 16, extensions: ['.PNG'] }),
        bullets: [
            "Fast, responsive gameplay with touch controls.",
            "Content pipeline for levels & enemy waves.",
        ],
        stack: ["Unity", "C#", "Mobile UI"],
    },
    {
        key: "zarzura",
        title: "Zarzura",
        role: "Solo Developer",
        ...generateMediaPaths("zarzura"),
        bullets: [
            "Fast, responsive gameplay with touch controls.",
            "Content pipeline for levels & enemy waves.",
        ],
        stack: ["Unity", "C#", "Mobile UI"],
    },
    {
        key: "jumpy_shooter",
        title: "Jumpy Shooter",
        role: "Solo Developer",
        ...generateMediaPaths("jumpy_shooter"),
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
        ...generateMediaPaths("rent_lord"),
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
        ...generateMediaPaths("rocket_factory"),
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
        ...generateMediaPaths("coin_forge"),
        bullets: [
            "Incremental mechanics & balancing tools.",
            "Store submission, analytics, and updates.",
        ],
        stack: ["Unity", "C#", "Store Ops"],
    },
];