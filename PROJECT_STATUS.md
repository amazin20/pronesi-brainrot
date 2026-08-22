# Project status

## Active work

Branch: `massive-game-overhaul`

Base source of truth at branch creation: `main` commit `b3efafdf17085fdeb1f4ce2401ed5d775adae905`.

This branch replaces the old single Physics Lab entrypoint with a clean overhaul runtime under `src/overhaul/`.

## Implemented checkpoint

- 15 campaign levels plus a dedicated Physics Lab;
- camera-relative keyboard/joystick movement through one input vector;
- physical tap / hold / drag / rotate / drop / light-throw interaction;
- cargo-specific mass/inertia/material/grip profiles;
- contact-point angular impulse, friction/restitution, gravity, damping, sleeping and adaptive substeps;
- procedural solid WebGL cargo art and a more complete character presentation;
- camera obstruction shortening/fading;
- Yandex lifecycle, natural-break interstitial hook, audio pause/resume;
- no new service worker; scoped legacy registration cleanup;
- commit-SHA build identity and automatic cache-busting Pages build;
- PR/push browser QA workflow and main-only validated Pages deploy workflow;
- append-only `docs/BUG_HUNT_REPORT.md`.

## Verified in automated non-browser runtime

- JavaScript syntax for active overhaul modules;
- architecture acceptance checks;
- all 15 levels load with finite state, clean cargo spawns and a geometrically valid goal orientation;
- resting body settles/sleeps with near-zero angular velocity;
- high-speed wall collision remains finite;
- deterministic physics fuzz: 500 randomized scenarios x 240 steps without NaN/Infinity/explosive velocity;
- Pages build preparation produces SHA-versioned asset URLs, `.nojekyll` and `build.json`.

## NOT VERIFIED IN REAL RUNTIME

- current branch screenshot/visual integrity in the GitHub Actions Chromium environment has not yet been inspected after the complete root switch;
- camera obstruction behavior across all difficult production levels needs visual hostile QA;
- character/art quality still needs multi-angle screenshot audit;
- true authored skinned character mesh, skinning weights and imported PBR/normal/AO asset pipeline do not exist yet;
- physics is not yet a complete six-degree-of-freedom rigid-body simulation: yaw is fully physical, while canting/tipping/pitch/roll remain limited;
- GitHub Pages production freshness cannot be verified until an accepted version reaches `main` and the Pages deployment finishes.

## Known open major work

See `docs/BUG_HUNT_REPORT.md`, especially the authored high-detail/skinned/PBR asset gap and remaining 6DOF physics fidelity gap.

## Exact next action

1. Read the latest `massive-game-overhaul` head and GitHub Actions result.
2. If browser QA fails, inspect the exact job log/artifact and fix root cause without weakening tests.
3. If it passes, download and visually inspect screenshots, then add hostile camera/interaction cases and the seven independent audit reports.
4. Continue core/art/physics fixes before creating/merging the final PR.
5. Only after accepted merge to `main`, verify the Pages deployment and public `build.json` SHA against `main`.
