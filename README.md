# commanderdiff

A simple vanilla HTML/CSS/JS web portal to compare MTG Commander precon decks against upgraded versions.

## Usage

1. Open `index.html` (or enable GitHub Pages for the repository root).
2. Paste your precon list in the input box and click **Save as Base Deck**.
3. Paste an upgraded list and click **Compare Upgrade**.
4. Review added/removed card frequencies and percentages across compared decks.
5. Click **Reset** to clear all localStorage data and start over.

Deck input format:

```text
1 Sol Ring
1 Arcane Signet
1 Command Tower
```

The quantity is stripped and card names are stored as arrays in localStorage.
