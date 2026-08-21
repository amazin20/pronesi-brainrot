# Yandex Games integration notes

The root `index.html` references `/sdk.js`.

Inside Yandex Games the project currently expects:

- `YaGames.init()` after game code is available;
- `LoadingAPI.ready()` after scene/UI initialization;
- `GameplayAPI.start()` when gameplay begins or resumes;
- `GameplayAPI.stop()` when gameplay pauses or the tab loses visibility;
- audio/gameplay pause when the document becomes hidden.

Ads are intentionally not part of the Physics Lab milestone. Interstitial and rewarded ads should be integrated only after the core physical interaction loop is accepted and then placed at natural gameplay breaks.

Before release, validate the build inside the Yandex Games debug environment and run a dedicated moderation-readiness pass.
