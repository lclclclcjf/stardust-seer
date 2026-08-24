# Artisan Notes

- Illustrated tarot themes are selected in `CardBack.tsx` and `CardFace.tsx`, with theme-specific assets and overlays defined in `tarot-card.module.css`.
- Classic Reconstructed uses black walnut, aged brass, and limestone assets while preserving the shared dynamic number, suit glyph, title, and reversed-state overlays.
- Sakura v3 keeps its top medallion blossom unobstructed by moving the dynamic card number into a compact upper-left badge.
- AI Free stores a concrete `AiDeckId` with each draw so its randomly selected back and face remain stable through shuffling, revealing, history, and retry navigation.
- The draw page uses spread-specific card-width variables and label typography: three-card and ten-card layouts scale independently, while the page allows vertical overflow so enlarged multi-row spreads remain fully reachable.
- UI light/dark mode is stored independently from the selected card-art theme on each draw; reading pages reuse the garden v2 background and the homepage form's 58% raised-surface glass treatment.
