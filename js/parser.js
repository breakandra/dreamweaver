// DreamWeaver — parser
// Turns free-form dream text into a graph: a central "dream" node plus the
// detected symbol nodes, connected to the center and to each other where the
// lexicon says they resonate.

function detectSymbols(text) {
  const lower = " " + text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ") + " ";
  const found = new Map(); // key -> { count, matchedWords:Set }

  for (const { kw, key } of window.KEYWORD_INDEX) {
    // word-boundary-ish match using spaces (we already padded with spaces)
    const needle = " " + kw + " ";
    let idx = lower.indexOf(needle);
    let count = 0;
    while (idx !== -1) {
      count++;
      idx = lower.indexOf(needle, idx + 1);
    }
    // also catch keyword at start/end or followed by plural handled by aliases
    if (count > 0) {
      if (!found.has(key)) found.set(key, { count: 0, words: new Set() });
      const rec = found.get(key);
      rec.count += count;
      rec.words.add(kw);
    }
  }
  return found;
}

// Build the graph model { nodes, edges } from detected symbols.
function buildDreamGraph(text) {
  const detected = detectSymbols(text);

  const nodes = [];
  const edges = [];

  // Center node
  const center = {
    id: "__dream__",
    type: "center",
    label: "Your Dream",
    glyph: "🌙",
    meaning: "The dream itself — the whole landscape your mind painted tonight. The symbols around it are the threads it was woven from.",
    weight: 6,
  };
  nodes.push(center);

  const present = new Set(detected.keys());

  for (const [key, rec] of detected.entries()) {
    const sym = window.DREAM_SYMBOLS[key];
    if (!sym) continue;
    nodes.push({
      id: key,
      type: "symbol",
      label: sym.label,
      glyph: sym.glyph,
      category: sym.category,
      meaning: sym.meaning,
      count: rec.count,
      weight: Math.min(5, 2 + rec.count), // bigger if mentioned more
    });
    // connect every symbol to the center
    edges.push({ source: "__dream__", target: key, kind: "core" });
  }

  // connect resonant symbols to each other (only if both are present)
  const seenPair = new Set();
  for (const key of present) {
    const sym = window.DREAM_SYMBOLS[key];
    if (!sym || !sym.links) continue;
    for (const other of sym.links) {
      if (present.has(other)) {
        const pair = [key, other].sort().join("::");
        if (!seenPair.has(pair)) {
          seenPair.add(pair);
          edges.push({ source: key, target: other, kind: "resonance" });
        }
      }
    }
  }

  return { nodes, edges, count: present.size };
}

if (typeof window !== "undefined") {
  window.buildDreamGraph = buildDreamGraph;
  window.detectSymbols = detectSymbols;
}
