// ================== CONFIG ==================
const WA_NUMBER = "524772521372";

// ================== Utilidades ==================
const qs  = (sel, el=document) => el.querySelector(sel);
const qsa = (sel, el=document) => [...el.querySelectorAll(sel)];

// ================== 1) Año automático ==================
const yearEl = qs("#y");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ================== 2) WhatsApp ==================
const waLink = (t="Hola, quiero cotizar.") =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t)}`;

qsa(".mk-wa").forEach(a=>{
  const msg = a.getAttribute("data-wa-text") || "Hola, quiero cotizar.";
  a.href = waLink(msg);
  a.target = "_blank";
  a.rel = "noopener";
});

// ================== 3) Menú móvil ==================
const btnToggle = qs("#mkNavToggle");
const menu = qs("#mkSiteMenu");
if (btnToggle && menu){
  btnToggle.addEventListener("click", ()=>{
    const open = btnToggle.getAttribute("aria-expanded")==="true";
    btnToggle.setAttribute("aria-expanded", String(!open));
    // usa "open" o "is-open" según tu CSS; aquí dejo "open"
    menu.classList.toggle("open");
  });
}

// ================== 5) Carrusel “Ejemplos” ==================
(function initExamplesCarousel(){
  const root  = qs(".mk-carousel");
  if (!root) return;

  const vp    = qs(".mk-carousel__viewport", root);
  const track = qs(".mk-carousel__track", root);
  const prev  = qs(".mk-carousel__arrow.prev", root);
  const next  = qs(".mk-carousel__arrow.next", root);
  if (!vp || !track || !prev || !next) return;

  const gap = parseFloat(getComputedStyle(track).gap) || 16;
  const step = () => {
    const card = qs(".mk-card", track);
    return card ? card.clientWidth + gap : vp.clientWidth * 0.9;
  };
  const maxScroll = () => track.scrollWidth - vp.clientWidth - 1;

  const updateArrows = ()=>{
    const max     = maxScroll();
    const atStart = vp.scrollLeft <= 1;
    const atEnd   = vp.scrollLeft >= max;
    prev.disabled = atStart;
    next.disabled = atEnd;
    root.classList.toggle("is-start", atStart);
    root.classList.toggle("is-end",   atEnd);
  };

  prev.addEventListener("click", ()=> vp.scrollBy({left: -step(), behavior:"smooth"}));
  next.addEventListener("click", ()=> vp.scrollBy({left:  step(), behavior:"smooth"}));
  vp.addEventListener("scroll", updateArrows);
  window.addEventListener("resize", updateArrows);
  updateArrows();

  // Swipe + anti-click fantasma
  let x0 = null, dragging = false;
  const THRESH = 8;

  vp.addEventListener("pointerdown", e=>{
    x0 = e.clientX; dragging = false;
    vp.setPointerCapture(e.pointerId);
    document.body.classList.remove("is-dragging");
  });
  vp.addEventListener("pointermove", e=>{
    if (x0 == null) return;
    const dx = e.clientX - x0;
    if (Math.abs(dx) > THRESH && !dragging){
      dragging = true;
      document.body.classList.add("is-dragging");
    }
  });
  vp.addEventListener("pointerup", e=>{
    if (x0 != null){
      const dx = e.clientX - x0;
      if (Math.abs(dx) > 30){
        vp.scrollBy({ left: -Math.sign(dx)*step(), behavior:"smooth" });
      }
    }
    x0 = null;
    setTimeout(()=>{ dragging=false; document.body.classList.remove("is-dragging"); }, 0);
  });
  vp.addEventListener("pointercancel", ()=>{
    x0 = null; dragging=false; document.body.classList.remove("is-dragging");
  });
})();

// ===== 6) Panel lateral tipo Netflix =====
(function initPanel(){
  const panel     = document.getElementById("mkPanel");
  const backdrop  = document.getElementById("mkPanelBackdrop");
  if(!panel || !backdrop) return;

  const img    = document.getElementById("mkPanelImg");
  const title  = document.getElementById("mkPanelTitle");
  const desc   = document.getElementById("mkPanelDesc");
  const demo   = document.getElementById("mkPanelDemo");
  const quote  = document.getElementById("mkPanelQuote");
  const closeB = document.getElementById("mkPanelClose");

  const _wa = (typeof waLink === "function")
    ? waLink
    : (t)=>`https://wa.me/524772521372?text=${encodeURIComponent(t||"Hola, quiero cotizar.")}`;

  let lastFocus = null;

  const focusables = () =>
    [...panel.querySelectorAll('a[href],button,input,textarea,select,[tabindex]:not([tabindex="-1"])')]
      .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));

  const open = ()=>{
    panel.classList.add("is-open");
    backdrop.classList.add("is-open");
    panel.setAttribute("aria-hidden","false");
    document.body.classList.add("is-locked");
    lastFocus = document.activeElement;
    title.setAttribute("tabindex","-1");
    title.focus({preventScroll:true});
    requestAnimationFrame(()=>title.removeAttribute("tabindex"));
  };

  const close = ()=>{
    panel.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    panel.setAttribute("aria-hidden","true");
    document.body.classList.remove("is-locked");
    if(lastFocus && typeof lastFocus.focus==="function") lastFocus.focus();
  };

  panel.addEventListener("keydown", (e)=>{
    if (e.key !== "Tab") return;
    const els = focusables(); if (!els.length) return;
    const first = els[0], last = els[els.length-1];
    if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  });

  document.querySelectorAll(".mk-mock").forEach(card=>{
    card.addEventListener("click", ()=>{
      if (document.body.classList.contains("is-dragging")) return;
      const t = card.getAttribute("data-title") || "Ejemplo";
      const s = card.getAttribute("data-showcase") || card.querySelector("img")?.src || "";
      const l = card.getAttribute("data-link") || "#";
      img.src = s; img.alt = `Vista previa: ${t}`;
      title.textContent = t;
      desc.textContent  = "Así se vería tu sitio en diferentes dispositivos.";
      demo.href  = l;
      quote.href = _wa(`Hola, quiero este estilo (${t}). ¿Me cotizas?`);
      open();
    });
    card.addEventListener("keydown",(e)=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); card.click(); }});
  });

  [backdrop, closeB].forEach(n=> n.addEventListener("click", close));
  window.addEventListener("keydown", e=>{ if(e.key==="Escape") close(); });
})();
