# TypingGuide redesign — concept

A redesign concept for typingguide.com plus a narrated walkthrough video.

## Files

- `index.html`, `styles.css`, `app.js` — interactive prototype. Open `index.html` in a browser.
- `SCRIPT.md` — voiceover script.
- `record.js` — Playwright script that drives the prototype and records the screencast.
- `typingguide_redesign.mp4` — final 1280×800, ~98s narrated walkthrough (attach to email).
- `build/preview/*.jpg` — sample frames.

## How the video was produced

1. `espeak-ng` synthesized voiceover from `build/narration.txt` → `build/voice_raw.wav`.
2. `ffmpeg` highpass/lowpass + loudnorm → `build/voice.wav`.
3. Playwright (chromium, 1280×800, headless under Xvfb) drove `index.html`,
   scrolling through hero → live practice (with auto-typing demo) →
   lessons → progress, recording WebM video.
4. `ffmpeg` muxed the WebM video and the cleaned WAV into H.264/AAC MP4
   with `+faststart` for streaming.

## Reproduce

```
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers xvfb-run -a node record.js
ffmpeg -y -i build/video/*.webm -i build/voice.wav \
  -c:v libx264 -preset medium -crf 22 -pix_fmt yuv420p \
  -c:a aac -b:a 160k -movflags +faststart -shortest \
  typingguide_redesign.mp4
```

## Design rationale (summary)

- **Focus** — single hero promise + one primary CTA; dark theme reduces fatigue.
- **Feedback** — live practice card surfaces WPM / accuracy / time inline; mistakes are inline-red, no popups.
- **Progress** — adaptive lesson tracks, WPM trend chart, weakest-keys panel.

> Note: live typingguide.com was not reachable from the build sandbox, so the
> redesign is benchmarked against the conventions of typing-tutor sites
> (typing.com, monkeytype, keybr, typingclub) rather than a direct page-by-page
> teardown.
