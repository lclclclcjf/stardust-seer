# Flow Notes

- The draw ritual uses three motion types only: the existing shuffle loop, 360ms card-selection settle feedback, and a 1250ms user-triggered 3D flip.
- Ten-card automatic selection advances with requestAnimationFrame timing and can be stopped at any point; reduced-motion mode removes travel while preserving state feedback.
- Fan preview motion uses transform/filter only over 240ms; mobile pointer gestures classify lift/next/previous without a motion dependency, while reduced-motion keeps the lifted state with a 1ms transition.
- AI reading generation uses a one-shot 1.56s requestAnimationFrame decode with 56ms glyph steps and left-to-right settle deadlines; it changes only textContent, has no layout animation, and skips entirely for reduced motion.
- The theme gallery uses a capped ±4° transform-only pointer tilt with a 280ms ease-out return and an on-demand Canvas 2D ripple field. Ripples cap at eight, stop rendering when settled or hidden, and both effects are disabled for reduced motion.
- The autumn Garden preview uses one Canvas 2D layer with 20 desktop or 12 mobile maple leaves, requestAnimationFrame movement at 1.5x fall speed, a 1.5 DPR cap, tab-visibility pausing, and a user-facing pause/resume control; reduced motion renders 2-3 static leaves.
