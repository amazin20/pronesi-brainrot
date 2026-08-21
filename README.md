# ПРОНЕСИ ЭТО! — massive game overhaul

Browser-first 3D physics delivery game for Yandex Games and GitHub Pages.

The canonical development source is this repository. The active overhaul is developed in `massive-game-overhaul` from the current `main` baseline; old ZIPs and local copies are not development sources.

## Current overhaul

- 15 authored physical-delivery campaign levels plus a separate Physics Lab;
- camera-relative WASD / arrows and the same movement path for the mobile joystick;
- direct object interaction: tap push, hold grip, drag, bounded rotation, drop and light-object throw;
- cargo-specific mass, moment of inertia, friction, restitution, damping, grip force, torque and roll behavior;
- OBB planar collision response with contact-point angular impulse, gravity, sleeping and adaptive high-speed substeps;
- solid WebGL procedural game art for sofa, refrigerator, mattress, barrel, ladder, cabinet, piano, table, chair, carpet roll, giant pot, beam, box and ball;
- procedural character locomotion, strain pose and hands targeting physical grip points;
- camera obstruction shortening plus camera-only wall fade;
- Yandex Games lifecycle hooks and interstitials only at natural level transitions;
- scoped cleanup of legacy service-worker registrations; the overhaul registers no service worker;
- deterministic architecture, level-geometry and physics-fuzz tests;
- real browser QA workflow with screenshot artifact;
- `main` Pages workflow that validates first, builds commit-SHA-versioned assets, then deploys the exact validated commit.

## Run locally

Serve repository root:

```bash
python -m http.server 8080
```

Open `http://localhost:8080/`.

The Yandex SDK is not requested on localhost, `file:` or GitHub Pages preview. It is loaded dynamically only in the Yandex-like production environment.

## Validation

```bash
npm run check
```

This executes syntax checks, architecture acceptance tests, all-level geometry checks and deterministic physics fuzzing.

```bash
npm run build
```

Builds `dist/` with commit/build-SHA cache busting and `build.json`.

GitHub Actions additionally launches Chromium against `/?qa=1` and stores browser QA evidence.

## Deployment

After a validated merge/push to `main`, `.github/workflows/pages.yml` performs:

`validate -> prepare SHA-versioned site -> upload Pages artifact -> deploy`

Production URL is intended to stay permanent:

`https://amazin20.github.io/pronesi-eto-physics-lab/`

A deployment is not considered verified until the public `build.json` and in-game build badge match the expected `main` commit.

## Important remaining fidelity work

The overhaul is not declared finished merely because CI is green. The current browser engine still does not provide a true authored skinned high-poly/PBR asset pipeline or a full six-degree-of-freedom rigid-body solver. Those limitations are tracked in `docs/BUG_HUNT_REPORT.md`, and the branch remains work-in-progress until the visual/runtime audits and deployment acceptance criteria are completed.
