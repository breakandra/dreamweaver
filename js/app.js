// DreamWeaver — main application wiring.

const els = {
  text: document.getElementById("dreamText"),
  weave: document.getElementById("weaveBtn"),
  clear: document.getElementById("clearBtn"),
  sample: document.getElementById("sampleBtn"),
  canvas: document.getElementById("mapCanvas"),
  empty: document.getElementById("emptyState"),
  panel: document.getElementById("infoPanel"),
  panelGlyph: document.getElementById("panelGlyph"),
  panelTitle: document.getElementById("panelTitle"),
  panelCat: document.getElementById("panelCat"),
  panelMeaning: document.getElementById("panelMeaning"),
  panelCount: document.getElementById("panelCount"),
  saveBtn: document.getElementById("saveBtn"),
  exportBtn: document.getElementById("exportBtn"),
  journalList: document.getElementById("journalList"),
  journalEmpty: document.getElementById("journalEmpty"),
  symbolCount: document.getElementById("symbolCount"),
  toast: document.getElementById("toast"),
};

const STORE_KEY = "dreamweaver.journal.v1";
let currentGraph = null;
let currentText = "";

const map = new DreamMap(els.canvas, {
  onSelect: (node) => showPanel(node),
});

const SAMPLES = [
  "I was flying over a dark ocean when the water turned into a forest. A snake slithered out of an old house and I started falling, but then I felt strangely free.",
  "I was late for an exam at my childhood school. My teeth started falling out and a stranger in shadow chased me up an endless staircase.",
  "I found a door glowing with moonlight. Behind it was a baby and a butterfly, and the whole room was on fire but I wasn't afraid.",
];

function showToast(msg) {
  els.toast.textContent = msg;
  els.toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => els.toast.classList.remove("show"), 2200);
}

function weave(text) {
  const t = (text || "").trim();
  if (!t) { showToast("Tulis dulu mimpimu ✨"); return; }
  currentText = t;
  const graph = buildDreamGraph(t);
  currentGraph = graph;
  map.setGraph(graph);
  els.empty.classList.add("hidden");
  els.symbolCount.textContent = graph.count;
  hidePanel();
  if (graph.count === 0) {
    showToast("Tidak ada simbol dikenali — coba ceritakan lebih detail.");
  } else {
    showToast(`${graph.count} simbol ditenun ke peta mimpimu.`);
  }
}

function showPanel(node) {
  if (!node) { hidePanel(); return; }
  els.panel.classList.remove("hidden");
  els.panelGlyph.textContent = node.glyph;
  els.panelTitle.textContent = node.label;
  els.panelCat.textContent = node.type === "center" ? "the dream" : (node.category || "");
  els.panelMeaning.textContent = node.meaning;
  if (node.type === "symbol" && node.count) {
    els.panelCount.textContent = `Disebut ${node.count}× dalam mimpimu`;
    els.panelCount.classList.remove("hidden");
  } else {
    els.panelCount.classList.add("hidden");
  }
}

function hidePanel() {
  els.panel.classList.add("hidden");
}

// ---- Journal (localStorage) ----
function loadJournal() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveJournal(entries) {
  localStorage.setItem(STORE_KEY, JSON.stringify(entries));
}

function addToJournal() {
  if (!currentText || !currentGraph) { showToast("Tenun mimpimu dulu sebelum disimpan."); return; }
  const entries = loadJournal();
  const symbols = currentGraph.nodes.filter((n) => n.type === "symbol").map((n) => n.glyph);
  entries.unshift({
    id: Date.now(),
    date: new Date().toISOString(),
    text: currentText,
    symbols,
    count: currentGraph.count,
  });
  saveJournal(entries.slice(0, 50));
  renderJournal();
  showToast("Mimpi tersimpan ke jurnal 🌙");
}

function renderJournal() {
  const entries = loadJournal();
  els.journalList.innerHTML = "";
  if (!entries.length) {
    els.journalEmpty.classList.remove("hidden");
    return;
  }
  els.journalEmpty.classList.add("hidden");
  for (const e of entries) {
    const li = document.createElement("li");
    li.className = "journal-item";
    const d = new Date(e.date);
    const dateStr = d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
      " · " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    li.innerHTML = `
      <div class="ji-top">
        <span class="ji-symbols">${e.symbols.slice(0, 6).join(" ") || "·"}</span>
        <span class="ji-date">${dateStr}</span>
      </div>
      <p class="ji-text">${escapeHtml(e.text.slice(0, 120))}${e.text.length > 120 ? "…" : ""}</p>
      <div class="ji-actions">
        <button class="ji-open" data-id="${e.id}">Buka ulang</button>
        <button class="ji-del" data-id="${e.id}">Hapus</button>
      </div>`;
    els.journalList.appendChild(li);
  }

  els.journalList.querySelectorAll(".ji-open").forEach((b) =>
    b.addEventListener("click", () => {
      const e = loadJournal().find((x) => x.id == b.dataset.id);
      if (e) { els.text.value = e.text; weave(e.text); window.scrollTo({ top: 0, behavior: "smooth" }); }
    })
  );
  els.journalList.querySelectorAll(".ji-del").forEach((b) =>
    b.addEventListener("click", () => {
      saveJournal(loadJournal().filter((x) => x.id != b.dataset.id));
      renderJournal();
    })
  );
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ---- Export PNG ----
function exportImage() {
  if (!currentGraph || !currentGraph.count) { showToast("Tenun mimpimu dulu sebelum diekspor."); return; }
  const src = els.canvas;
  const out = document.createElement("canvas");
  const scale = window.devicePixelRatio || 1;
  out.width = src.width;
  out.height = src.height;
  const ctx = out.getContext("2d");
  // dreamy background
  const g = ctx.createLinearGradient(0, 0, 0, out.height);
  g.addColorStop(0, "#0c0a1f");
  g.addColorStop(1, "#1a1140");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(src, 0, 0);
  // watermark
  ctx.font = `${14 * scale}px Inter, sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.textAlign = "right";
  ctx.fillText("DreamWeaver", out.width - 16 * scale, out.height - 14 * scale);

  const a = document.createElement("a");
  a.download = "dreamweaver-map.png";
  a.href = out.toDataURL("image/png");
  a.click();
  showToast("Peta mimpi diekspor sebagai PNG 🖼️");
}

// ---- Events ----
els.weave.addEventListener("click", () => weave(els.text.value));
els.clear.addEventListener("click", () => {
  els.text.value = "";
  currentGraph = null;
  currentText = "";
  map.setGraph({ nodes: [], edges: [] });
  els.empty.classList.remove("hidden");
  els.symbolCount.textContent = "0";
  hidePanel();
});
els.sample.addEventListener("click", () => {
  const s = SAMPLES[Math.floor(Math.random() * SAMPLES.length)];
  els.text.value = s;
  weave(s);
});
els.saveBtn.addEventListener("click", addToJournal);
els.exportBtn.addEventListener("click", exportImage);
els.text.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") weave(els.text.value);
});

renderJournal();
