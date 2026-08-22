# Project status

## Active work

Branch: `massive-rebuild-v2`

Base source of truth at branch creation: `main` commit `6bc7273cc54f7b7be0ea5d11990dd35e018f4b4b`.

PR: #8 `massive-rebuild-v2 -> main`.

The active game now uses only the V2 interaction/render/input path. The obsolete `04-player-interaction.js`, `05-renderer.js` and `06-input.js` files were deleted after V2 desktop/mobile browser QA became green.

## Implemented V2 checkpoint

- exact rotated OBB surface picking plus ellipsoid/cylinder picking for curved hero props;
- local grip point + local surface normal and visible 3D grip ring;
- pointer movement drives bounded force at the physical anchor; object position is never assigned to cursor position;
- ~190 ms pointer history -> bounded 3D gesture velocity -> mass/strength-limited throw impulse at the actual grip point;
- off-center impulse torque, one/two-hand strength differences, slip and heavy-object movement penalties;
- camera-relative WASD/arrows and the same vector path for joystick;
- real mobile PointerEvent regression for joystick + physical grip simultaneously and jump;
- spatial-hash dynamic collision broad phase with sleeping fast path while retaining SAT narrow phase;
- swept wall CCD/adaptive substeps and hostile 45/180 u/s collision cases;
- explicit walkable floor classification (`step/platform/ramp`) so low walls never masquerade as floor;
- vertical body-on-body resting/stacking contacts;
- thresholded fragile destruction with deferred break queue so collision iteration cannot be invalidated by array mutation;
- fragile floor impacts enter the same bounded destruction path;
- bounded 4–5 fragment replacements and short-lived material impact effects;
- material-aware physics/audio for wood, metal, fabric, rubber, stone/concrete, plastic, cardboard, ceramic and glass;
- 106 interactive object types/variants across office/home/furniture/dish/paper/warehouse categories;
- physical themed clutter in office/apartment/warehouse/kitchen/store/hotel/museum;
- Object Test Gallery developer mode;
- rebuilt V2 WebGL renderer with audited outward winding, inverse-transpose normals and higher-segment base geometry;
- V2.1 camera cutaway and character silhouette/detail polish;
- statics now inherit the current level theme instead of being forced to the old light-gray fallback;
- 15 campaign delivery levels plus Physics Lab retained.

## Verification already achieved before final cleanup

One exact V2 head completed:

- architecture checks: PASS;
- executable mesh/render audit: PASS;
- catalog/regression checks: PASS;
- 15-level geometry check: PASS;
- walkable-floor regression: PASS;
- physics fuzz: PASS with 1000 randomized scenarios x 240 steps;
- spatial broad phase reduced a sparse 106-body gallery to 132 candidates versus 5565 all-pairs candidates in the deterministic check;
- desktop Chromium behavior QA: 97/97 PASS;
- mobile Chromium behavior QA: 103/103 PASS, including DOM PointerEvents on joystick while gripping and the jump button;
- desktop and mobile screenshot artifacts were inspected manually.

A **new final CI run is still required after the legacy-file deletion and themed-static cleanup**. Do not merge until that exact final head is green and its screenshots are inspected.

## Hostile bugs found after the first green V2 browser run

- stale QA fragment counter after destruction;
- camera blocker rendered as a giant translucent slab;
- curved objects used box-surface picking for visible grip marker;
- full dynamic O(n^2) pair candidate pass remained in the core;
- a syntax mistake in hostile fuzz was not covered by the old syntax gate;
- destruction could mutate `S.bodies` during collision-pair iteration;
- fragile objects falling directly on the floor did not enter destruction logic;
- `lowwall` could be misclassified as floor by the old height heuristic;
- browser CI previously had no real mobile PointerEvent pass;
- static geometry always carried `#dbe4ea`, preventing renderer theme-wall fallback and making office partitions look like giant light-gray blocks.

All of these have concrete fixes in the current branch and regression coverage where executable verification is possible.

## Known limitations / not falsely claimed

- the current character is improved procedural articulated geometry, **not** an imported authored skinned mesh with production skeleton/skin weights;
- there is no real Blender/GLTF high-detail -> retopo -> baked normal/AO -> LOD production asset pipeline in this repository yet;
- physics is still mainly yaw/planar rigid-body dynamics plus vertical motion and interaction torque, not a general arbitrary 6DOF pitch/roll inertia-tensor engine;
- particles/effects are bounded records/fragments but not a full GPU instanced production particle system;
- 106 catalog entries have real physical/dimensional variation, but some intentionally share renderer archetypes rather than pretending 106 individually authored production meshes already exist.

These limitations do not block a functional user playtest of the V2 interaction/physics build, but they do block calling the art/physics stack a finished AAA production implementation.

## Exact next action

1. Run full CI on the current cleanup head.
2. Inspect both final desktop and mobile screenshots.
3. Review `main...massive-rebuild-v2` diff for unexpected changes.
4. If all green, mark PR #8 ready and merge it.
5. Wait for the main Pages validation/deploy workflow.
6. Verify public `build.json` SHA and the live game URL before telling the user the build is ready to test.
