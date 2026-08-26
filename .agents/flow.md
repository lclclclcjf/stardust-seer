# Flow Notes

- The draw ritual uses three motion types only: the existing shuffle loop, 360ms card-selection settle feedback, and a 1250ms user-triggered 3D flip.
- Ten-card automatic selection advances with requestAnimationFrame timing and can be stopped at any point; reduced-motion mode removes travel while preserving state feedback.
