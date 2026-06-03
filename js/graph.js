// DreamWeaver — interactive force-directed dream map on canvas.
// Lightweight custom physics (no external libs): repulsion between nodes,
// spring attraction along edges, and gentle gravity toward center.

class DreamMap {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.nodes = [];
    this.edges = [];
    this.dpr = window.devicePixelRatio || 1;
    this.onSelect = opts.onSelect || function () {};
    this.hover = null;
    this.selected = null;
    this.dragNode = null;
    this.pointer = { x: 0, y: 0, down: false };
    this.t = 0;
    this.stars = [];
    this._raf = null;

    this._resize();
    window.addEventListener("resize", () => this._resize());
    this._bindPointer();
    this._makeStars();
    this._loop();
  }

  _resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.w = rect.width;
    this.h = rect.height;
    this.canvas.width = this.w * this.dpr;
    this.canvas.height = this.h * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this._makeStars();
  }

  _makeStars() {
    this.stars = [];
    const n = Math.floor((this.w * this.h) / 9000);
    for (let i = 0; i < n; i++) {
      this.stars.push({
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        r: Math.random() * 1.3 + 0.2,
        tw: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.02 + 0.005,
      });
    }
  }

  setGraph(graph) {
    const cx = this.w / 2;
    const cy = this.h / 2;
    this.nodes = graph.nodes.map((n, i) => {
      const angle = (i / Math.max(1, graph.nodes.length - 1)) * Math.PI * 2;
      const radius = n.type === "center" ? 0 : 120 + Math.random() * 80;
      return {
        ...n,
        x: cx + Math.cos(angle) * radius + (Math.random() - 0.5) * 20,
        y: cy + Math.sin(angle) * radius + (Math.random() - 0.5) * 20,
        vx: 0,
        vy: 0,
        r: 14 + n.weight * 4,
        pulse: Math.random() * Math.PI * 2,
      };
    });
    this.edges = graph.edges.map((e) => ({ ...e }));
    this.selected = null;
    this.hover = null;
  }

  _node(id) {
    return this.nodes.find((n) => n.id === id);
  }

  _physics() {
    const cx = this.w / 2;
    const cy = this.h / 2;
    const nodes = this.nodes;

    // repulsion
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        let dx = a.x - b.x, dy = a.y - b.y;
        let d2 = dx * dx + dy * dy;
        if (d2 < 1) { d2 = 1; dx = Math.random(); dy = Math.random(); }
        const d = Math.sqrt(d2);
        const force = 9000 / d2;
        const fx = (dx / d) * force;
        const fy = (dy / d) * force;
        a.vx += fx; a.vy += fy;
        b.vx -= fx; b.vy -= fy;
      }
    }

    // spring along edges
    for (const e of this.edges) {
      const a = this._node(e.source), b = this._node(e.target);
      if (!a || !b) continue;
      const dx = b.x - a.x, dy = b.y - a.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const target = e.kind === "resonance" ? 150 : 170;
      const k = e.kind === "resonance" ? 0.012 : 0.02;
      const f = (d - target) * k;
      const fx = (dx / d) * f, fy = (dy / d) * f;
      a.vx += fx; a.vy += fy;
      b.vx -= fx; b.vy -= fy;
    }

    // gravity + integrate
    for (const n of nodes) {
      if (n.type === "center") {
        // ease center toward middle
        n.vx += (cx - n.x) * 0.05;
        n.vy += (cy - n.y) * 0.05;
      } else {
        n.vx += (cx - n.x) * 0.0016;
        n.vy += (cy - n.y) * 0.0016;
      }
      if (this.dragNode === n) continue;
      n.vx *= 0.86;
      n.vy *= 0.86;
      n.x += n.vx;
      n.y += n.vy;
      // bounds
      const pad = n.r + 6;
      n.x = Math.max(pad, Math.min(this.w - pad, n.x));
      n.y = Math.max(pad, Math.min(this.h - pad, n.y));
    }
  }

  _draw() {
    const ctx = this.ctx;
    this.t += 1;
    ctx.clearRect(0, 0, this.w, this.h);

    // stars
    for (const s of this.stars) {
      s.tw += s.sp;
      const a = 0.35 + Math.sin(s.tw) * 0.35;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220,225,255,${a})`;
      ctx.fill();
    }

    if (!this.nodes.length) return;

    // edges
    for (const e of this.edges) {
      const a = this._node(e.source), b = this._node(e.target);
      if (!a || !b) continue;
      const active = this.selected && (e.source === this.selected || e.target === this.selected);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      // slight curve
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const nx = -(b.y - a.y), ny = b.x - a.x;
      const nl = Math.sqrt(nx * nx + ny * ny) || 1;
      const bend = e.kind === "resonance" ? 18 : 8;
      ctx.quadraticCurveTo(mx + (nx / nl) * bend, my + (ny / nl) * bend, b.x, b.y);
      if (e.kind === "resonance") {
        ctx.strokeStyle = active ? "rgba(255,180,120,0.9)" : "rgba(255,170,120,0.28)";
        ctx.lineWidth = active ? 2 : 1.2;
        ctx.setLineDash([4, 6]);
      } else {
        ctx.strokeStyle = active ? "rgba(170,160,255,0.95)" : "rgba(150,140,230,0.35)";
        ctx.lineWidth = active ? 2.4 : 1.4;
        ctx.setLineDash([]);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // nodes
    for (const n of this.nodes) {
      n.pulse += 0.04;
      const pulse = 1 + Math.sin(n.pulse) * 0.04;
      const r = n.r * pulse;
      const isHover = this.hover === n;
      const isSel = this.selected === n.id;

      // glow
      const grd = ctx.createRadialGradient(n.x, n.y, r * 0.2, n.x, n.y, r * 2.2);
      const base = n.type === "center" ? [180, 150, 255] : this._catColor(n.category);
      grd.addColorStop(0, `rgba(${base[0]},${base[1]},${base[2]},0.55)`);
      grd.addColorStop(1, `rgba(${base[0]},${base[1]},${base[2]},0)`);
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(n.x, n.y, r * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // disc
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = n.type === "center" ? "rgba(40,32,70,0.95)" : "rgba(28,26,52,0.92)";
      ctx.fill();
      ctx.lineWidth = isSel ? 3 : isHover ? 2.4 : 1.4;
      ctx.strokeStyle = isSel
        ? "rgba(255,255,255,0.95)"
        : `rgba(${base[0]},${base[1]},${base[2]},0.9)`;
      ctx.stroke();

      // glyph
      ctx.font = `${Math.round(r * 1.0)}px "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(n.glyph, n.x, n.y + 1);

      // label
      ctx.font = `${n.type === "center" ? 14 : 12}px Inter, system-ui, sans-serif`;
      ctx.fillStyle = "rgba(230,228,255,0.92)";
      ctx.fillText(n.label, n.x, n.y + r + 14);
    }
  }

  _catColor(cat) {
    const map = {
      nature: [110, 200, 255],
      action: [255, 150, 120],
      body: [255, 130, 180],
      animal: [150, 220, 150],
      place: [200, 170, 255],
      object: [255, 210, 120],
      people: [255, 160, 200],
      theme: [180, 160, 255],
    };
    return map[cat] || [180, 170, 255];
  }

  _loop() {
    this._physics();
    this._draw();
    this._raf = requestAnimationFrame(() => this._loop());
  }

  _pick(x, y) {
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const n = this.nodes[i];
      const dx = x - n.x, dy = y - n.y;
      if (dx * dx + dy * dy <= (n.r + 4) * (n.r + 4)) return n;
    }
    return null;
  }

  _bindPointer() {
    const c = this.canvas;
    const pos = (ev) => {
      const rect = c.getBoundingClientRect();
      const t = ev.touches ? ev.touches[0] : ev;
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    };

    c.addEventListener("mousemove", (ev) => {
      const p = pos(ev);
      this.pointer.x = p.x; this.pointer.y = p.y;
      if (this.dragNode) {
        this.dragNode.x = p.x; this.dragNode.y = p.y;
        this.dragNode.vx = 0; this.dragNode.vy = 0;
      } else {
        this.hover = this._pick(p.x, p.y);
        c.style.cursor = this.hover ? "pointer" : "default";
      }
    });

    c.addEventListener("mousedown", (ev) => {
      const p = pos(ev);
      const n = this._pick(p.x, p.y);
      if (n) {
        this.dragNode = n;
        this.selected = n.id;
        this.onSelect(n);
      } else {
        this.selected = null;
        this.onSelect(null);
      }
    });

    window.addEventListener("mouseup", () => { this.dragNode = null; });

    // touch
    c.addEventListener("touchstart", (ev) => {
      const p = pos(ev);
      const n = this._pick(p.x, p.y);
      if (n) { this.dragNode = n; this.selected = n.id; this.onSelect(n); ev.preventDefault(); }
      else { this.selected = null; this.onSelect(null); }
    }, { passive: false });
    c.addEventListener("touchmove", (ev) => {
      if (!this.dragNode) return;
      const p = pos(ev);
      this.dragNode.x = p.x; this.dragNode.y = p.y;
      this.dragNode.vx = 0; this.dragNode.vy = 0;
      ev.preventDefault();
    }, { passive: false });
    window.addEventListener("touchend", () => { this.dragNode = null; });
  }
}

if (typeof window !== "undefined") {
  window.DreamMap = DreamMap;
}
