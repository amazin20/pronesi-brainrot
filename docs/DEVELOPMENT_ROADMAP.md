# Development roadmap

Work in this order. Do not skip ahead to bulk content production.

## P0 — Input and movement

- Desktop WASD / arrows always move the character.
- Mobile virtual joystick is visible and reliable.
- Movement input and object-touch input work simultaneously.
- No input mode can silently disable another platform's controls.

## P0 — Collision integrity

- Held objects retain collisions.
- No teleport/snap through walls.
- High-speed throws use continuous/swept collision protection.
- Large objects physically fail to fit through openings that are too small.

## P0 — Direct physical interaction

- Tap = controlled push impulse.
- Hold = physical grip, not transform parenting.
- Drag = target force/torque intent, not direct object teleportation.
- Release without gesture = drop.
- Fast gesture + release = throw.
- Heavy objects have limited liftability and grip force.

## P1 — Character and animation

- Replace placeholder/procedural-looking character presentation.
- Add locomotion blend states.
- Add grab, push, pull, drag, lift, heavy effort, throw, stumble, recover, grip-slip reactions.
- Hands must target actual contact points through IK/procedural posing.

## P1 — Visual asset pass

- Fix holes, transparency, flipped normals, z-fighting, broken topology, and poor materials.
- Use deliberate silhouettes and detailed game-ready meshes rather than arbitrary polygon inflation.
- Keep Yandex/WebGL performance budgets in mind through LODs and optimized collision meshes.

## P2 — First production level

Only after the Physics Lab passes the regression checklist, build one polished production level around a single awkward transport task.
