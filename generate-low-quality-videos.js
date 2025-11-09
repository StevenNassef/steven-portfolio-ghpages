#!/usr/bin/env node

// Script to generate low-quality video versions for portfolio projects
// This script will:
// 1. Find all .mp4 video files in public/projects/*/
// 2. Create low-quality versions with reduced resolution and bitrate
// 3. Save them as {key}_low.mp4 in the same directory
// 
// Requirements:
// - ffmpeg must be installed: brew install ffmpeg (on macOS)
// 
// Usage:
//   node generate-low-quality-videos.js

import { execSync } from 'child_process';
import { readdirSync, existsSync, statSync } from 'fs';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECTS_DIR = join(__dirname, 'public', 'projects');

// Video quality settings for low-quality versions
const LOW_QUALITY_SETTINGS = {
    // Reduce resolution (scale down to max 720p width, maintain aspect ratio)
    scale: '720:-2',
    // Reduce bitrate significantly (500k for good compression)
    videoBitrate: '500k',
    // Use faster encoding preset
    preset: 'fast',
    // Reduce frame rate if needed (optional, comment out to keep original FPS)
    // fps: '24',
    // Audio settings (keep audio but reduce quality)
    audioBitrate: '64k',
    audioChannels: 1, // Mono audio
    audioSampleRate: '22050',
    // Codec settings
    codec: 'libx264',
    audioCodec: 'aac',
    // CRF (Constant Rate Factor) - lower = better quality but larger file
    // 28 is a good balance for low-quality web videos
    crf: 28,
};

/**
 * Check if ffmpeg is installed
 */
function checkFFmpeg() {
    try {
        execSync('ffmpeg -version', { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Get video files in a directory
 */
function getVideoFiles(dir) {
    try {
        const files = readdirSync(dir);
        return files
            .filter(file => file.endsWith('.mp4') || file.endsWith('.MP4'))
            .filter(file => !file.includes('_low')) // Skip already processed low-quality videos
            .map(file => join(dir, file));
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error.message);
        return [];
    }
}

/**
 * Get video duration in seconds
 */
function getVideoDuration(videoPath) {
    try {
        const output = execSync(
            `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`,
            { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }
        );
        return parseFloat(output.trim());
    } catch (error) {
        console.warn(`Could not get duration for ${videoPath}:`, error.message);
        return null;
    }
}

/**
 * Get video dimensions
 */
function getVideoDimensions(videoPath) {
    try {
        const output = execSync(
            `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${videoPath}"`,
            { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }
        );
        const [width, height] = output.trim().split('x').map(Number);
        return { width, height };
    } catch (error) {
        console.warn(`Could not get dimensions for ${videoPath}:`, error.message);
        return null;
    }
}

/**
 * Create low-quality version of a video
 */
function createLowQualityVideo(inputPath, outputPath) {
    const inputDir = dirname(inputPath);
    const inputFile = basename(inputPath);
    const outputFile = basename(outputPath);
    
    // Check if output already exists
    if (existsSync(outputPath)) {
        const inputStats = statSync(inputPath);
        const outputStats = statSync(outputPath);
        
        // If output is newer than input, skip
        if (outputStats.mtime > inputStats.mtime) {
            console.log(`⏭️  Skipping ${inputFile} (low-quality version already exists and is up-to-date)`);
            return { success: true, skipped: true };
        }
    }
    
    console.log(`\n🎬 Processing: ${inputFile}`);
    
    // Get video info
    const duration = getVideoDuration(inputPath);
    const dimensions = getVideoDimensions(inputPath);
    
    if (duration) {
        console.log(`   Duration: ${duration.toFixed(2)}s`);
    }
    if (dimensions) {
        console.log(`   Resolution: ${dimensions.width}x${dimensions.height}`);
    }
    
    // Build ffmpeg command
    // Scale: if width > 720, scale down to 720p, otherwise keep original size
    const scaleFilter = dimensions && dimensions.width > 720 
        ? `scale=${LOW_QUALITY_SETTINGS.scale}` 
        : 'scale=iw:ih'; // Keep original size if already small
    
    const ffmpegArgs = [
        '-i', `"${inputPath}"`,
        '-vf', scaleFilter,
        '-c:v', LOW_QUALITY_SETTINGS.codec,
        '-crf', LOW_QUALITY_SETTINGS.crf.toString(),
        '-preset', LOW_QUALITY_SETTINGS.preset,
        '-b:v', LOW_QUALITY_SETTINGS.videoBitrate,
        '-maxrate', LOW_QUALITY_SETTINGS.videoBitrate,
        '-bufsize', (parseInt(LOW_QUALITY_SETTINGS.videoBitrate) * 2).toString() + 'k',
        '-c:a', LOW_QUALITY_SETTINGS.audioCodec,
        '-b:a', LOW_QUALITY_SETTINGS.audioBitrate,
        '-ac', LOW_QUALITY_SETTINGS.audioChannels.toString(),
        '-ar', LOW_QUALITY_SETTINGS.audioSampleRate,
        '-movflags', '+faststart', // Enable fast start for web playback
        '-y', // Overwrite output file if it exists
        `"${outputPath}"`,
    ];
    
    const command = `ffmpeg ${ffmpegArgs.join(' ')}`;
    
    try {
        console.log(`   Creating low-quality version...`);
        execSync(command, { 
            stdio: ['ignore', 'pipe', 'pipe'],
            cwd: inputDir,
            shell: true 
        });
        
        // Get file sizes
        const inputSize = statSync(inputPath).size;
        const outputSize = statSync(outputPath).size;
        const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);
        
        console.log(`   ✅ Created: ${outputFile}`);
        console.log(`   Size: ${(inputSize / 1024 / 1024).toFixed(2)} MB → ${(outputSize / 1024 / 1024).toFixed(2)} MB (${reduction}% reduction)`);
        
        return { success: true, skipped: false, reduction };
    } catch (error) {
        console.error(`   ❌ Error processing ${inputFile}:`, error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Main function
 */
function main() {
    console.log('🎥 Low-Quality Video Generator');
    console.log('==============================\n');
    
    // Check if ffmpeg is installed
    if (!checkFFmpeg()) {
        console.error('❌ Error: ffmpeg is not installed!');
        console.error('\nPlease install ffmpeg first:');
        console.error('  macOS: brew install ffmpeg');
        console.error('  Linux: sudo apt-get install ffmpeg');
        console.error('  Windows: Download from https://ffmpeg.org/download.html');
        process.exit(1);
    }
    
    console.log('✅ ffmpeg is installed\n');
    
    // Check if projects directory exists
    if (!existsSync(PROJECTS_DIR)) {
        console.error(`❌ Error: Projects directory not found: ${PROJECTS_DIR}`);
        process.exit(1);
    }
    
    // Find all video files
    const projectDirs = readdirSync(PROJECTS_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => join(PROJECTS_DIR, dirent.name));
    
    const videoFiles = [];
    for (const projectDir of projectDirs) {
        const videos = getVideoFiles(projectDir);
        videoFiles.push(...videos);
    }
    
    if (videoFiles.length === 0) {
        console.log('ℹ️  No video files found in projects directories.');
        process.exit(0);
    }
    
    console.log(`Found ${videoFiles.length} video file(s) to process:\n`);
    videoFiles.forEach(file => {
        console.log(`  - ${basename(file)}`);
    });
    
    // Process each video
    const results = {
        success: 0,
        skipped: 0,
        failed: 0,
        totalReduction: 0,
    };
    
    for (const videoPath of videoFiles) {
        const dir = dirname(videoPath);
        const name = basename(videoPath, extname(videoPath));
        const ext = extname(videoPath);
        const outputPath = join(dir, `${name}_low${ext}`);
        
        const result = createLowQualityVideo(videoPath, outputPath);
        
        if (result.success) {
            if (result.skipped) {
                results.skipped++;
            } else {
                results.success++;
                if (result.reduction) {
                    results.totalReduction += parseFloat(result.reduction);
                }
            }
        } else {
            results.failed++;
        }
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Summary:');
    console.log(`   ✅ Created: ${results.success}`);
    console.log(`   ⏭️  Skipped: ${results.skipped}`);
    console.log(`   ❌ Failed: ${results.failed}`);
    if (results.success > 0) {
        const avgReduction = (results.totalReduction / results.success).toFixed(1);
        console.log(`   📉 Average size reduction: ${avgReduction}%`);
    }
    console.log('='.repeat(50));
    
    if (results.failed > 0) {
        process.exit(1);
    }
}

// Run the script
main();

