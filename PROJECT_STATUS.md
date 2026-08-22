# Project status

## Active work

Branch: `massive-rebuild-v2`

Base source of truth at branch creation: `main` commit `6bc7273cc54f7b7be0ea5d11990dd35e018f4b4b`.

The V2 branch replaces the active interaction/art path again rather than cosmetically patching it. The old `04-player-interaction.js`, `05-renderer.js` and `06-input.js` files remain temporarily for comparison but are **not loaded by `index.html`** and are scheduled for deletion after V2 runtime QA is green.

## Implemented V2 checkpoint

- exact surface OBB picking and local grip point + local surface normal;
- visible 3D grip ring attached to the physical surface anchor;
- pointer movement produces a bounded physical force target rather than setting object position;
- last ~190 ms of pointer movement become a gesture vector used for physically bounded release impulse;
- off-center release applies impulse at the grip point and therefore produces torque;
- LIGHT / MEDIUM / HEAVY / VERY HEAVY strength classes;
- two-hand grip increases force and torque limits without making very-heavy cargo throwable;
- anchor damping includes angular point velocity `omega x r` and player velocity;
- 106 interactive object types/variants with distinct dimensions, masses, materials and model archetypes;
- physical office/apartment/warehouse/kitchen/store/hotel/museum clutter spawned as ordinary bodies;
- body-on-body vertical resting/stacking contacts;
- thresholded fragile destruction with bounded 4–5 fragment replacements;
- pooled-style short-lived impact effect records for dust/sparks/glass/ceramic/wood/paper feedback;
- material-aware audio profiles for wood, metal, fabric, rubber, stone, plastic, cardboard, ceramic and glass;
- rebuilt active `05-renderer-v2.js` with higher-segment base meshes, new hero-cargo construction, expanded environment-object rendering and a rebuilt procedural character presentation;
- Object Test Gallery developer mode for the full catalog;
- V2-specific static, mesh, catalog, grab, throw, stacking, destruction and browser QA gates.

## Automated verification status

**PENDING FIRST FULL V2 RUN.**

The previous main overhaul was green before this branch was created. The new V2 modules have not yet earned that status. No V2 feature should be called verified until the branch CI executes:

1. syntax gate;
2. architecture V2 gate;
3. executable mesh/winding audit at V2 segment counts;
4. V2 catalog/regression gate;
5. 15-level geometry gate;
6. V2 physics fuzz including stacking/destruction + 1000 randomized scenarios x 240 steps;
7. real Chromium browser behavior QA + screenshot artifact.

## Known limitations / not falsely claimed

- the current character is still procedural articulated geometry, **not** an imported authored skinned mesh with production skeleton/skin weights;
- there is still no true authored Blender/GLTF high-detail -> retopo -> baked normal/AO -> LOD pipeline in the repository;
- physics remains primarily yaw/planar rigid-body dynamics plus vertical motion; it is not yet a complete general 6DOF rigid-body engine for arbitrary pitch/roll/canting;
- effect records are bounded and short-lived, but a reusable GPU particle pool/instancing system is still incomplete;
- the 106-entry catalog contains real dimensional/material/physics variation, but some entries intentionally share renderer archetypes rather than pretending 106 independently authored production meshes already exist.

## Exact next action

1. Append the V2 defects and the requested `BUGS NOT REPORTED BY USER` section to `docs/BUG_HUNT_REPORT.md`.
2. Create a draft PR `massive-rebuild-v2 -> main`.
3. Run the full GitHub Actions pipeline on the actual PR head.
4. For every failure: read the concrete log/artifact, reproduce/root-cause/fix without weakening the assertion, then rerun.
5. After first green browser QA: download and inspect the screenshot, then perform the eight independent hostile audit passes (models, player, physics, grab/throw, collision, levels/environment, performance, free hostile QA).
6. Delete the inactive old interaction/renderer/input modules and rerun everything.
7. Only after accepted diff + final Chromium evidence merge to `main`, deploy Pages and verify public build SHA.
