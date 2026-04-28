# Render a Claude Artifact on Desktop + Mobile and Build a 5-minute Video

This repo contains a single Colab notebook that:
1. Loads a Claude public artifact URL in a real headless Chromium browser.
2. Records a video at desktop (1920x1080) and mobile (390x844) viewports.
3. Stitches them together with title cards into one ~5 minute MP4.

## One-click run (works from a phone, no laptop required)

Open this URL in any browser, sign in to Google, then click **Runtime -> Run all**:

https://colab.research.google.com/github/kvinayakpai/Claude-Test-Bed/blob/claude/access-bhagavadgita-ontology-tjpYO/render_artifact.ipynb

After ~5-7 minutes, `final_video.mp4` downloads automatically.

## To render a different artifact

Edit the `URL = "..."` line in the first code cell.
