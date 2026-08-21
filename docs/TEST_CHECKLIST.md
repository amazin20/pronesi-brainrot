# Regression checklist

A build must not be called ready if a P0 check fails.

## P0 input

- [ ] WASD moves the character.
- [ ] Arrow keys move the character.
- [ ] Mobile joystick is visible on touch devices.
- [ ] Joystick movement and object interaction can happen at the same time.
- [ ] Pause/resume does not permanently kill movement input.

## P0 interactions

- [ ] Tap/click produces a physical push rather than teleporting an object.
- [ ] Hold grabs after the intended threshold.
- [ ] Held object remains physically collidable.
- [ ] Release can drop without always throwing.
- [ ] Swipe release can throw light/medium objects.
- [ ] Refrigerator cannot behave like an 8 kg box.

## P0 collision

- [ ] Two boxes collide instead of passing through each other.
- [ ] Thrown object collides with a wall at high speed.
- [ ] Sofa cannot phase through a narrower doorway.
- [ ] Held object cannot phase through walls, floor, or ceiling.

## P1 presentation

- [ ] No unintended transparent surfaces.
- [ ] No visible mesh holes from normal gameplay camera angles.
- [ ] No obvious flipped normals or z-fighting.
- [ ] Character has visible locomotion and interaction animation states.

## Yandex/browser

- [ ] `index.html` exists at archive/repository root.
- [ ] Local mode remains playable when `/sdk.js` is unavailable.
- [ ] Yandex lifecycle hooks fail safely outside the platform.
