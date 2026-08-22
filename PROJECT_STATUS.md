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
- statics inherit the current level theme instead of being forced to the old light-gray fallback;
- 15 campaign delivery levels plus Physics Lab retained.

## Final branch verification

Exact cleanup head `f7c17ae4c77f0a4c26cc5098077560fc2de0106b` completed GitHub Actions run `32545793451` successfully after legacy runtime deletion and themed-static cleanup.

Verified on that exact head:

- syntax gate: PASS for active runtime, QA and build scripts;
- architecture gate: PASS, including deletion of obsolete runtime paths;
- executable mesh/render audit: PASS;
- V2 catalog/regression gate: PASS;
- all 15 campaign level geometry checks: PASS;
- explicit walkable-floor regression: PASS;
- deterministic physics fuzz: PASS with 1000 randomized scenarios x 240 steps;
- broad-phase deterministic gallery check: 132 candidates vs 5565 all-pairs candidates;
- desktop Chromium behavior QA: 97/97 PASS;
- mobile Chromium behavior QA: 103/103 PASS, including real DOM PointerEvents for joystick while physically gripping and the jump button;
- final desktop/mobile screenshot artifacts manually inspected;
- final diff against `main` reviewed; branch is ahead only and changes are scoped to V2 gameplay/physics/render/input/QA/docs/workflow cleanup.

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
- static geometry always carried `#dbe4ea`, preventing renderer theme-wall fallback.

All have concrete fixes in the branch and regression coverage where executable verification is possible.

## Known limitations / not falsely claimed

- the current character is improved procedural articulated geometry, **not** an imported authored skinned mesh with production skeleton/skin weights;
- there is no real Blender/GLTF high-detail -> retopo -> baked normal/AO -> LOD production asset pipeline in this repository yet;
- physics is still mainly yaw/planar rigid-body dynamics plus vertical motion and interaction torque, not a general arbitrary 6DOF pitch/roll inertia-tensor engine;
- particles/effects are bounded records/fragments but not a full GPU-instanced production particle system;
- 106 catalog entries have real physical/dimensional variation, but some intentionally share renderer archetypes rather than pretending 106 individually authored production meshes already exist.

These limitations do not block a functional user playtest of the V2 interaction/physics build, but they do block calling the art/physics stack a finished AAA production implementation.

## Release gate

The branch is ready for PR review/merge from a functional playtest perspective. Remaining release steps are operational:

1. mark PR #8 ready;
2. merge only this green head into `main`;
3. wait for the main Pages validation/deploy workflow;
4. verify public `build.json` SHA and the live site before telling the user to test.
