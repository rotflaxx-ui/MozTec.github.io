
const WA_NUMBER = "524772521372";

// 2) Año automático
const yearEl = document.getElementById("y");
if (yearEl) yearEl.textContent = new Date().getFullYear();


// 3) Construye todos los enlaces a WhatsApp
const wa = (t) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t || "Hola, quiero cotizar.")}`;


document.querySelectorAll(".wa").forEach(a=>{
const msg = a.getAttribute("data-wa-text") || "Hola, quiero cotizar.";
  a.href = wa(msg);
  a.target = "_blank";
  a.rel = "noopener";
  
});

// 4) Scroll suave para anclas del menú
document.addEventListener("click",(e)=>{
  const a = e.target.closest('a[href^="#"]'); if(!a) return;
  const el = document.querySelector(a.getAttribute("href")); if(!el) return;
  e.preventDefault(); el.scrollIntoView({behavior:"smooth", block:"start"});
});

// 5) Hero slider simple (izq/der)
// Lista de imágenes REMOTAS (URLs completas, siempre https)
const imgs = [
  "https://seoescala.com/wp-content/uploads/2023/10/diseno-y-desarrollo-de-paginas-web-1.webp",
  "https://tse2.mm.bing.net/th/id/OIP.iGYbNc3bNEjsa7I8sQihNQHaKe?r=0&cb=thfc1&pid=ImgDet&w=474&h=670&rs=1&o=7&rm=3",
];let idx = 0;
const ROTATE_MS = 3000;   // 3 segundos
let timer = null;

const heroImg = document.getElementById("heroImg");
const prev = document.getElementById("prev");
const next = document.getElementById("next");

// muestra imagen por índice
const show = (n) => {
  if (!heroImg || !imgs.length) return;
  idx = (n + imgs.length) % imgs.length;
  heroImg.src = imgs[idx];
};

// arranca/parar auto-rotado (evita timers duplicados)
const startAuto = () => {
  stopAuto();
  if (imgs.length > 1) timer = setInterval(() => show(idx + 1), ROTATE_MS);
};
const stopAuto = () => {
  if (timer) { clearInterval(timer); timer = null; }
};

// precarga (suaviza el cambio)
imgs.forEach(src => { const i = new Image(); i.src = src; });

// init: muestra la primera y arranca auto-rotado
if (heroImg) { show(0); startAuto(); }

// botones (reinician el timer para que el usuario alcance a ver)
if (prev) prev.addEventListener("click", () => { stopAuto(); show(idx - 1); startAuto(); });
if (next) next.addEventListener("click", () => { stopAuto(); show(idx + 1); startAuto(); });

// pausa al pasar el mouse (solo desktop)
if (heroImg) {
  heroImg.addEventListener("mouseenter", stopAuto);
  heroImg.addEventListener("mouseleave", startAuto);
}
// Menú responsive (abre/cierra)
const nav = document.querySelector('.nav');
const navToggle = document.getElementById('navToggle');
if (nav && navToggle) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
  // Cierra el menú al tocar un link
  document.querySelectorAll('.menu a').forEach(a => {
    a.addEventListener('click', () => nav.classList.remove('open'));
  });
}
