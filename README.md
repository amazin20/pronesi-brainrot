# Pronesi Eto — Physics Lab

3D browser physics-game prototype for Yandex Games.

This repository is the canonical development source for the project. The current baseline focuses on player movement, joystick/WASD input, direct object interaction, grabbing, pushing, throwing, collision behavior and a Physics Lab test scene.

## Current baseline

- Browser-first HTML/CSS/JavaScript/WebGL project
- WASD / keyboard movement
- Mobile joystick input
- Object grab / push / throw interactions
- Physics Lab test environment
- Project validation scripts and GitHub Actions

## Development rule

Core gameplay must be fixed and verified before adding more content. Changes should be tested against the regression checklist in `docs/TEST_CHECKLIST.md`.

## Run locally

Serve the repository root with any local HTTP server, for example:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080/`.

## Validation

```bash
npm run validate
```

The project is currently a development baseline, not a finished release.