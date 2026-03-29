# Inference Frontend UI Improvement Plan

Based on the current screenshot, the core problem is layout priority: the decorative scene owns most of the canvas, while the actual working UI is squeezed into a small card in the upper-right. The app currently reads more like an illustration with a tiny control widget than an inference frontend.

## Plan

1. Rebalance the layout around utility first.
   Make the query UI the primary surface, not the decoration. The desk scene should become background framing, not the main occupant.

2. Replace the small floating panel with a large anchored work area.
   Use a two-column layout on desktop:
   - left or center: large prompt and response workspace
   - right or background: reduced decorative scene elements
   Alternatively, keep a single large central panel and let the scene sit behind it at lower visual weight.

3. Greatly enlarge the prompt area.
   Increase the textarea height to something closer to a real drafting box.
   Make it wide enough for multi-line prompts without cramped wrapping.
   Add `Ctrl+Enter` submission so the keyboard path works.

4. Greatly enlarge the response area.
   Give the response its own tall scrollable region with much more vertical space.
   Ensure the default empty, loading, and error states occupy the same large area so the layout does not jump.

5. Compress the decorative composition.
   Reduce the monitor, lamp, shelf, and window footprint.
   Lower their contrast and treat them as ambient background elements.
   Remove empty decorative space that currently pushes the usable UI into a corner.

6. Make the query controls structurally clearer.
   Keep a visible header, prompt label, large textarea, strong send button, and clearly separated response pane.
   The button should remain visible without scrolling.

7. Fix mobile and narrow-width behavior.
   On smaller screens, stack prompt above response and collapse decoration further.
   The current tiny panel behavior should be avoided entirely.

8. Tune for "tool" rather than "poster".
   Keep the visual identity, but bias spacing, alignment, and sizing toward usability.
   The page should feel like a working inference client with art direction, not art with a small client attached.

## Concrete Target

Desktop should feel roughly like:

- 60 to 75 percent of the main surface devoted to prompt and response
- 25 to 40 percent devoted to decoration or background
- prompt box large enough for paragraph-length input
- response box large enough to read several paragraphs comfortably

## Likely Implementation Surface

The most likely files to change are:

- `src/components/DeskScene.jsx`
- `src/components/ModelQueryPanel.jsx`
- `src/styles.css`
