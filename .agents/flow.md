# Flow Notes

- The draw ritual uses three motion types only: the existing shuffle loop, 360ms card-selection settle feedback, and a 1250ms user-triggered 3D flip.
- Ten-card automatic selection advances with requestAnimationFrame timing and can be stopped at any point; reduced-motion mode removes travel while preserving state feedback.
- Fan preview motion uses transform/filter only over 240ms; mobile pointer gestures classify lift/next/previous without a motion dependency, while reduced-motion keeps the lifted state with a 1ms transition.
- AI reading generation uses a one-shot 1.56s requestAnimationFrame decode with 56ms glyph steps and left-to-right settle deadlines; it changes only textContent, has no layout animation, and skips entirely for reduced motion.
