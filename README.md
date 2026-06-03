# 🌙 DreamWeaver

Tulis mimpimu, dan **DreamWeaver** menenunnya menjadi **peta simbol interaktif** — sebuah graph yang menghubungkan simbol-simbol mimpi (air, terbang, jatuh, gigi, ular, dll) beserta tafsir reflektifnya.

> Sebuah eksperimen kecil yang masih jarang dibuat orang: memvisualisasikan mimpi sebagai konstelasi simbol yang saling beresonansi.

## ✨ Fitur

- **Deteksi simbol otomatis** — teks mimpimu dipindai terhadap lexicon ~25 simbol mimpi lintas budaya.
- **Peta force-directed interaktif** — node simbol melayang, saling tarik-menarik, dan terhubung ke pusat "mimpimu". Bisa di-*drag*.
- **Resonansi antar simbol** — simbol yang biasanya berkaitan (mis. *air ↔ transformasi ↔ bulan*) dihubungkan garis putus-putus.
- **Panel makna** — klik simbol mana pun untuk membaca tafsir singkatnya.
- **Jurnal mimpi** — simpan mimpi (tersimpan lokal di browser via `localStorage`), buka ulang, atau hapus.
- **Export PNG** — unduh peta mimpimu sebagai gambar.
- **Estetik dreamy** — latar bintang berkelip, glow, gradient ungu-malam.

## 🚀 Menjalankan

Tidak butuh build step apa pun — ini web app statis murni (HTML/CSS/JS vanilla).

```bash
# cukup buka index.html, atau jalankan server statis sederhana:
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

## 🧠 Cara kerja

1. `js/symbols.js` — lexicon simbol: keyword (alias), makna, glyph emoji, kategori, dan `links` (simbol yang beresonansi).
2. `js/parser.js` — memindai teks, mencocokkan keyword, lalu membangun model graph `{ nodes, edges }`.
3. `js/graph.js` — simulasi fisika ringan (repulsion + spring + gravity) yang merender graph ke `<canvas>`, lengkap dengan interaksi hover/klik/drag.
4. `js/app.js` — wiring UI: tombol, jurnal (`localStorage`), export PNG, toast.

## 📁 Struktur

```
dreamweaver/
├── index.html
├── css/style.css
└── js/
    ├── symbols.js   # lexicon simbol + tafsir
    ├── parser.js    # teks -> graph
    ├── graph.js     # mesin force-directed di canvas
    └── app.js       # logika aplikasi & UI
```

## ⚠️ Catatan

Tafsir simbol di sini untuk **refleksi & hiburan**, bukan nasihat medis/psikologis maupun ramalan. Semua data mimpi tersimpan **lokal** di browser kamu dan tidak dikirim ke mana pun.

---

Dibuat dengan 🌙 oleh DreamWeaver.
