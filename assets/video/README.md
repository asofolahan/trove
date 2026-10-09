# Property Videos

Video files are not stored in git (too large for GitHub).

## Hosting options

### Option A — GitHub Releases (free, simplest)
1. Go to `https://github.com/asofolahan/trove/releases/new`
2. Create a release (e.g. `v1.0-media`)
3. Drag `alina-harbour-highlight.mp4` into the assets section
4. Publish the release
5. Copy the direct download URL (right-click the file → Copy link)
6. Paste it into `assets/config.js` as the `videoUrl` for `KT-K01D`

### Option B — Cloudflare R2 (free tier, CDN-backed)
Upload to an R2 bucket with public access. Use the R2 public URL as `videoUrl`.

### Option C — Compress first, then host
411 MB is large for web. Consider compressing with HandBrake or ffmpeg to ~30–60 MB
before uploading — quality will still be excellent for a property highlight reel.

```bash
ffmpeg -i "Alina Hub Highlight Video.mp4" -vcodec libx264 -crf 28 -preset slow \
  -acodec aac -b:a 128k alina-harbour-highlight-web.mp4
```
