# Artisan Notes

- Illustrated tarot themes are selected in `CardBack.tsx` and `CardFace.tsx`, with theme-specific assets and overlays defined in `tarot-card.module.css`.
- Classic Reconstructed uses black walnut, aged brass, and limestone assets while preserving the shared dynamic number, suit glyph, title, and reversed-state overlays.
- Sakura v3 keeps its top medallion blossom unobstructed by moving the dynamic card number into a compact upper-left badge.
- AI Free stores a concrete `AiDeckId` with each draw so its randomly selected back and face remain stable through shuffling, revealing, history, and retry navigation.
- The draw page uses spread-specific card-width variables and label typography: three-card and ten-card layouts scale independently, while the page allows vertical overflow so enlarged multi-row spreads remain fully reachable.
- UI light/dark mode is stored independently from the selected card-art theme on each draw; reading pages reuse the garden v2 background and the homepage form's 58% raised-surface glass treatment.
- AI Free now contains twelve registered decks; each deck declares independent content, title, and number tones so artwork with mixed light and dark regions keeps dynamic overlays legible.
- The history route uses its supplied garden artwork as a fixed full-viewport background; header, record, loading, and empty-state surfaces reuse the garden option cards' 58% raised color with 14px blur and 112% saturation.
- The draw route uses a local reducer state machine; shuffled card identities remain ephemeral until the asker confirms a complete, unique selection, then the existing history persistence path is reused.
- Fan-card preview is local UI state: keyboard ↑ or a mobile upward swipe lifts exactly one unselected card; horizontal navigation atomically moves that preview so the previous card returns before Enter/click selection.
- The theme gallery uses three equal-width comparison cards from left to right on desktop and stacks them on mobile; shared media and copy heights keep each theme visually balanced.
- Eclipse Archive uses paired 16:9 full-screen hero assets selected by the existing demo theme mode; the hero background stays presentation-only while the reading form and card-theme logic remain unchanged.
- Eclipse Archive hero artwork uses `object-fit: contain` above 980px to preserve the full approved composition and switches to `cover` on narrow screens so the horizontal 16:9 subject remains legible.
- Eclipse Archive uses a decorative, accessibility-hidden duplicate of the active light/dark image as a blurred cover layer behind the sharp contained artwork; the fixed visual layer and transparent reading section preserve one continuous scene while reusing Garden's reduced-motion-aware scroll reveal.
- The AI loading decode reserves a fixed monospace line; its visual glyph stream is aria-hidden while the stable final phrase is exposed through aria-label, preventing screen-reader churn.
- 花札剧场 uses the approved 1672×941 European opera artwork as one fixed full-screen scene; desktop copy occupies the darker center-left stage, mobile crops around 58% horizontal focus, and the reading controls use 58% raised-surface glass with reduced-transparency fallbacks.

- 花札剧场 v3 使用独立的 16:9 深浅背景；桌面端深色文案靠左、浅色文案靠右，自动模式跟随系统配色。

- Theme identity is carried separately from light/dark mode as `uiVariant`; draw uses each variant's dark scene, reading resolves paired light/dark artwork, and legacy records safely default to Garden.

- 花札剧场主题缩略图复用已上线的 16:9 暖日光剧场资产；以 `object-fit: cover` 和 52% 水平焦点铺满窗口，在裁切左右边缘的同时保留飞牌与面具。
