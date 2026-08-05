# Artisan Notes

- Illustrated tarot themes are selected in `CardBack.tsx` and `CardFace.tsx`, with theme-specific assets and overlays defined in `tarot-card.module.css`.
- Classic Reconstructed uses black walnut, aged brass, and limestone assets while preserving the shared dynamic number, suit glyph, title, and reversed-state overlays.
- Sakura v3 keeps its top medallion blossom unobstructed by moving the dynamic card number into a compact upper-left badge.
- AI Free stores a concrete `AiDeckId` with each draw so its randomly selected back and face remain stable through shuffling, revealing, history, and retry navigation.
