// 1) Configura tu número (52 + 10 dígitos, sin + ni espacios)
const WA_NUMBER = "524772521372";

// 2) Año automático
document.getElementById("2025").textContent = new Date().getFullYear();

// 3) Construye todos los enlaces a WhatsApp
const wa = (t) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t || "Hola, quiero cotizar.")}`;

document.querySelectorAll(".wa").forEach(a=>{

document.querySelectorAll(".wa").forEach(a=>{
+  const msg = a.getAttribute("data-wa-text") || "Hola, quiero cotizar.";
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
const imgs = ["../img/hero-1.jpg","../img/hero-2.jpg","../img/hero-3.jpg"]; // pon 1-3 imágenes
let idx = 0;
const heroImg = document.getElementById("heroImg");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const show = (n)=>{ idx = (n+imgs.length)%imgs.length; heroImg.src = imgs[idx]; };
prev.addEventListener("click", ()=> show(idx-1));
next.addEventListener("click", ()=> show(idx+1));
