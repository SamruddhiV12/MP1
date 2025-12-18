/*  ==========================================================================
    Vanilla behaviors for MP#1
    - Sticky/resize nav on scroll
    - Smooth scrolling with active position indicator
    - Progress bar showing reading position
    - Mobile nav toggle
    - Modal open/close for portfolio tiles
    - Simple, accessible carousel with arrow controls
   ========================================================================== */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ----- Nav resize + progress bar ----- */
const nav = $(".nav");
const progressBar = $(".nav__progress span");

const onScroll = () => {
  if (!nav || !progressBar) return;

  const y = window.scrollY || window.pageYOffset;
  nav.classList.toggle("shrink", y > 10);

  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  const pct = max > 0 ? Math.min(100, Math.max(0, (y / max) * 100)) : 0;
  progressBar.style.width = `${pct}%`;
};

document.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ----- Smooth scrolling ----- */
$$("a[data-nav]").forEach((a) => {
  a.addEventListener("click", (e) => {
    if (!nav) return;

    nav.classList.remove("open");
    const togg = $(".nav__toggle");
    if (togg) togg.setAttribute("aria-expanded", "false");

    const href = a.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    e.preventDefault();
    const target = $(href);
    if (!target) return;

    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: "start", inline: "nearest" });
  });
});

/* ----- Position indicator ----- */
const sections = [
  "#portfolio",
  "#about",
  "#carousel",
  "#features",
  "#parallax",
  "#video",
  "#contact",
].map((id) => $(id)).filter(Boolean);

const navMap = new Map();
$$(".nav__links a").forEach((link) => {
  const id = link.getAttribute("href");
  if (id && id.startsWith("#")) navMap.set(id, link);
});

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = `#${entry.target.id}`;
      const link = navMap.get(id);
      if (!link) return;

      if (entry.isIntersecting) {
        $$(".nav__links a").forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      }
    });

    const atBottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;

    if (atBottom) {
      $$(".nav__links a").forEach((l) => l.classList.remove("active"));
      const last = $(".nav__links li:last-child a");
      if (last) last.classList.add("active");
    }
  },
  {
    rootMargin: "-80px 0px -70% 0px",
    threshold: 0.15,
  }
);

sections.forEach((sec) => io.observe(sec));

/* ----- Mobile nav toggle ----- */
const toggle = $(".nav__toggle");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = !nav.classList.contains("open");
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
}

/* ----- Modals ----- */
const openModal = (id) => {
  const m = $(`#${id}`);
  if (!m) return;

  m.classList.add("open");

  const closeBtn = $("[data-close]", m);
  if (closeBtn) closeBtn.focus();

  const onKey = (e) => { if (e.key === "Escape") close(); };
  const onBackdrop = (e) => { if (e.target === m) close(); };

  function close() {
    m.classList.remove("open");
    document.removeEventListener("keydown", onKey);
    m.removeEventListener("click", onBackdrop);
  }

  if (closeBtn) closeBtn.addEventListener("click", close, { once: true });
  document.addEventListener("keydown", onKey);
  m.addEventListener("click", onBackdrop);
};

$$(".tile").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-modal-target");
    if (id) openModal(id);
  });
});

/* ----- Carousel ----- */
const track = $(".carousel__track");
const prev = $(".carousel__ctrl.prev");
const next = $(".carousel__ctrl.next");
let index = 0;

const go = (dir) => {
  if (!track) return;
  const slides = $$(".slide", track);
  if (!slides.length) return;

  index = (index + dir + slides.length) % slides.length;
  track.style.transform = `translateX(-${index * 100}%)`;
};

if (prev) prev.addEventListener("click", () => go(-1));
if (next) next.addEventListener("click", () => go(1));

const carousel = $(".carousel");
if (carousel) {
  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  });
}

/* ----- Footer year ----- */
const year = $("#year");
if (year) year.textContent = String(new Date().getFullYear());
