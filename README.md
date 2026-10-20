# Studio82 website

Static source for https://www.studio82.net.

Deploy the entire repository root to the existing Netlify project `studio82creative`; no build command is required. Include the `videos/` directory in every deployment. Netlify is currently deployed manually; pushing here does not automatically deploy.

## EMBER playback check

Open `/motion`, select EMBER, and verify video and sound start, playback reaches the end, seeking works, and closing stops playback. Check desktop and mobile browsers. `/videos/studio82-ember.mp4` must return `video/mp4`, not an HTML 404 page, and support byte ranges (HTTP 206).

The video is H.264 Main, yuv420p, 1920x1080, 24 fps, with AAC-LC stereo audio. MP4 metadata precedes media data for progressive playback.
