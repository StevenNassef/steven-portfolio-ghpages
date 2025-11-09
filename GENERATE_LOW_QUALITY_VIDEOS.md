# Generate Low-Quality Videos

This guide explains how to create low-quality versions of your portfolio videos for faster loading on the home screen.

## Overview

The portfolio uses two video qualities:
- **High Quality**: Original videos shown on project detail pages
- **Low Quality**: Compressed versions shown on the home screen for faster loading

## Prerequisites

You need `ffmpeg` installed on your system.

### Install ffmpeg

**macOS (using Homebrew):**
```bash
brew install ffmpeg
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

**Windows:**
1. Download ffmpeg from https://ffmpeg.org/download.html
2. Extract and add to your PATH

## Usage

### Automatic Generation

Run the script to automatically process all videos:

```bash
npm run generate-low-quality-videos
```

Or directly:
```bash
node generate-low-quality-videos.js
```

### What the Script Does

1. **Finds all videos** in `public/projects/*/` directories
2. **Creates low-quality versions** with:
   - Maximum width: 720px (maintains aspect ratio)
   - Reduced bitrate: 500k (vs original)
   - Reduced audio: 64k mono
   - CRF: 28 (good compression balance)
   - Fast encoding preset
3. **Saves as** `{key}_low.mp4` in the same directory
4. **Shows progress** and file size reductions

### Video Files Found

The script will process these videos:
- `cairo_invaiders/cairo_invaiders.mp4`
- `coin_forge/coin_forge.mp4`
- `jumpy_shooter/jumpy_shooter.mp4`
- `mergedom/mergedom.mp4`
- `mergedom/mergedom_2.mp4`
- `rent_lord/rent_lord.mp4`
- `rocket_factory/rocket_factory.mp4`
- `zarzura/zarzura.mp4`

## Output

After running the script, you'll have:
- Original videos: `{key}.mp4` (high quality)
- Low-quality versions: `{key}_low.mp4` (for home screen)

Example:
- `mergedom/mergedom.mp4` (original)
- `mergedom/mergedom_low.mp4` (low quality)

## Quality Settings

The low-quality videos use these settings:
- **Resolution**: Max 720p width (scales down if larger)
- **Video Bitrate**: 500k
- **Audio Bitrate**: 64k (mono)
- **CRF**: 28 (good compression)
- **Codec**: H.264 (libx264)
- **Audio Codec**: AAC

These settings provide a good balance between file size and visual quality for web previews.

## Troubleshooting

### ffmpeg not found

If you get an error that ffmpeg is not found:
1. Make sure ffmpeg is installed (see Prerequisites)
2. Verify installation: `ffmpeg -version`
3. If installed but not found, add it to your PATH

### Video processing fails

If a specific video fails to process:
1. Check that the video file is not corrupted
2. Verify you have read/write permissions in the directory
3. Check available disk space
4. Try processing that video manually with ffmpeg

### Skip already processed videos

The script automatically skips videos if:
- The low-quality version already exists
- The low-quality version is newer than the original

To regenerate all videos, delete the `*_low.mp4` files first.

## Manual Processing

If you prefer to process videos manually, use this ffmpeg command:

```bash
ffmpeg -i input.mp4 \
  -vf scale=720:-2 \
  -c:v libx264 \
  -crf 28 \
  -preset fast \
  -b:v 500k \
  -maxrate 500k \
  -bufsize 1000k \
  -c:a aac \
  -b:a 64k \
  -ac 1 \
  -ar 22050 \
  -movflags +faststart \
  output_low.mp4
```

## File Size Reduction

Typically, low-quality videos are 70-90% smaller than originals:
- Original: 10-50 MB
- Low-quality: 1-5 MB

This significantly improves page load times on the home screen.

## Next Steps

After generating the low-quality videos:
1. Test the home screen to verify low-quality videos load
2. Test project detail pages to verify high-quality videos load
3. Commit the new `*_low.mp4` files to your repository
4. Deploy to see the performance improvement

