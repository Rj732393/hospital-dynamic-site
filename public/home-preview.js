/* ==========================================================
   home-preview.js — homepage par SIRF thodi si (limited)
   Services aur Programs dynamically dikhata hai.
   - Services: /api/services se aata hai, Category field
     (nature/medical/other) se theme color set hota hai.
   - Programs: /api/programs se aata hai (ASSUMPTION — agar
     aapka endpoint alag hai to yeh URL badal dena, line ~10).
   Poori list services.html / programs.html par already dikhti
   hai — yahan sirf teaser cards hain.
   ========================================================== */
(function () {
  const BASE_URL = "http://localhost:5000";
  const SERVICES_URL = `${BASE_URL}/api/services`;
  const PROGRAMS_URL = `${BASE_URL}/api/programs`; // <-- confirm this path
  const DOCTORS_URL = `${BASE_URL}/api/doctors`;  

  const HOME_SERVICES_LIMIT = 4;
  const HOME_PROGRAMS_LIMIT = 3;
  const HOME_DOCTORS_LIMIT = 10;

  // ---- generic helper: try many possible field names, PascalCase ya camelCase ----
  function pick(obj, keys) {
    for (const k of keys) {
      if (obj && obj[k] !== undefined && obj[k] !== null && String(obj[k]).trim() !== "") {
        return obj[k];
      }
    }
    return "";
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function isImagePath(val) {
    if (!val) return false;
    if (/^https?:\/\//i.test(val)) return true;
    if (val.startsWith("/uploads/")) return true;
    if (/\.(png|jpe?g|webp|gif|svg)$/i.test(val)) return true;
    return false;
  }

  function resolveImage(val) {
    if (!val) return null;
    return /^https?:\/\//i.test(val) ? encodeURI(val) : encodeURI(`${BASE_URL}${val}`);
  }

  async function fetchJson(url) {
    const res = await fetch(encodeURI(url));
    const rawText = await res.text();
    const data = JSON.parse(rawText); // agar backend JSON nahi bhejta to yahi catch me chala jayega
    if (!res.ok || !data.success) throw new Error(data.message || `Request fail (${res.status})`);
    return data.data || [];
  }

  // =================== SERVICES PREVIEW ===================
  function getSvcTitle(s) { return pick(s, ["Title", "title", "Name", "name"]); }
  function getSvcDesc(s) { return pick(s, ["Description", "description", "Details", "details", "Content", "content"]); }
  function getSvcShort(s) { return pick(s, ["ShortDescription", "shortDescription", "Summary", "summary"]); }
  function getSvcIcon(s) { return pick(s, ["ImageUrl", "imageUrl", "Image", "image", "Icon", "icon"]); }
  function getSvcCategory(s) { return (pick(s, ["Category", "category"]) || "other").toLowerCase(); }

  const SVC_THEMES = {
    nature: { bg: "rgba(45,122,79,.1)", color: "#2d7a4f" },
    medical: { bg: "rgba(0,63,135,.1)", color: "#003f87" },
    other: { bg: "rgba(0,63,135,.1)", color: "#003f87" },
  };

  function buildServiceCard(s) {
    const theme = SVC_THEMES[getSvcCategory(s)] || SVC_THEMES.other;
    const icon = getSvcIcon(s) && !isImagePath(getSvcIcon(s)) ? getSvcIcon(s) : "🩺";
    const title = getSvcTitle(s);
    const desc = getSvcShort(s) || getSvcDesc(s).slice(0, 110);
    const el = document.createElement("div");
    el.className = "bg-white p-7 rounded-2xl border border-outline-variant/30 hover:shadow-xl transition-all group";
    el.innerHTML = `
      <div class="w-14 h-14 rounded-xl flex items-center justify-center mb-5 text-[28px] group-hover:scale-110 transition-transform" style="background:${theme.bg};color:${theme.color}">${escapeHtml(icon)}</div>
      <h3 class="font-headline-md text-headline-md text-on-surface mb-2">${escapeHtml(title)}</h3>
      <p class="text-on-surface-variant font-body-md mb-4 text-sm">${escapeHtml(desc)}</p>
    `;
    return el;
  }

  async function loadHomeServices() {
    const gridEl = document.getElementById("homeServicesGrid");
    if (!gridEl) return;
    try {
      const services = await fetchJson(SERVICES_URL);
      const preview = services.slice(0, HOME_SERVICES_LIMIT);
      if (preview.length === 0) return; // static section header stays, grid just remains empty
      gridEl.innerHTML = "";
      preview.forEach((s) => gridEl.appendChild(buildServiceCard(s)));
    } catch (err) {
      console.warn("Home services preview load nahi ho paya:", err.message);
    }
  }


  // =================== DOCTORS PREVIEW ===================
  function getDocName(d) { return pick(d, ["Name", "name"]); }
  function getDocSpec(d) { return pick(d, ["Specialization", "specialization"]); }
  function getDocExp(d) { return pick(d, ["Experience", "experience"]) || 0; }
  function getDocImage(d) { return pick(d, ["ImageUrl", "imageUrl"]); }

  function buildDoctorCard(d) {
    const img = getDocImage(d);
    const showImg = img && isImagePath(img);
    const el = document.createElement("div");
    el.className = "bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-outline-variant/10";
    el.innerHTML = `
      <div class="h-72 overflow-hidden relative img-wrap ${showImg ? "" : "flex items-center justify-center bg-primary/5"}">
        ${showImg
          ? `<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="${escapeHtml(getDocName(d))}" src="${resolveImage(img)}" onerror="this.parentElement.classList.add('flex','items-center','justify-center','bg-primary/5'); this.remove();">`
          : `<span class="material-symbols-outlined text-primary" style="font-size:64px;">account_circle</span>`
        }
        <div class="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-label-sm text-primary font-bold">${getDocExp(d)}+ Yrs Exp</div>
      </div>
      <div class="p-6">
        <h4 class="font-headline-md text-headline-md text-on-surface mb-1">${escapeHtml(getDocName(d))}</h4>
        <p class="text-secondary font-bold text-label-sm mb-4">${escapeHtml(getDocSpec(d))}</p>
      </div>
    `;
    return el;
  }

  async function loadHomeDoctors() {
    const gridEl = document.getElementById("homeDoctorsGrid");
    if (!gridEl) return;
    try {
      const doctors = await fetchJson(DOCTORS_URL);
      const preview = doctors.slice(0, HOME_DOCTORS_LIMIT);
      if (preview.length === 0) return;
      gridEl.innerHTML = "";
      preview.forEach((d) => gridEl.appendChild(buildDoctorCard(d)));
    } catch (err) {
      console.warn("Home doctors preview load nahi ho paya:", err.message);
    }
  }
  // ⬆️⬆️⬆️

  // =================== PROGRAMS PREVIEW ===================
  // NOTE: field names yahan guess kiye gaye hain (Services jaisa hi pattern).
  // Real AdminProgram.jsx dekh kar inhe lock karna behtar rahega.
  function getPrgTitle(p) { return pick(p, ["Title", "title", "Name", "name"]); }
  function getPrgDesc(p) { return pick(p, ["Description", "description", "Details", "details", "Content", "content"]); }
  function getPrgImage(p) { return pick(p, ["ImageUrl", "imageUrl", "Image", "image", "Photo", "photo"]); }
  function getPrgTag(p) { return pick(p, ["Status", "status", "Tag", "tag"]) || "Program"; }

  function buildProgramCard(p) {
    const img = getPrgImage(p);
    const showImg = img && isImagePath(img);
    const el = document.createElement("div");
    el.className = "bg-white rounded-2xl overflow-hidden border border-outline-variant/30 hover:shadow-lg transition-all group";
    el.innerHTML = `
      <div class="h-48 overflow-hidden img-wrap ${showImg ? "" : "flex items-center justify-center bg-secondary-container/20 text-4xl"}">
        ${showImg
          ? `<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="${escapeHtml(getPrgTitle(p))}" src="${resolveImage(img)}" onerror="this.parentElement.style.display='none';">`
          : `${escapeHtml(img || "🩺")}`}
      </div>
      <div class="p-6">
        <span class="inline-block bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">${escapeHtml(getPrgTag(p))}</span>
        <h4 class="font-headline-md text-headline-md text-on-surface mb-2">${escapeHtml(getPrgTitle(p))}</h4>
        <p class="text-on-surface-variant font-body-md text-sm">${escapeHtml(getPrgDesc(p).slice(0, 120))}</p>
      </div>
    `;
    return el;
  }

  async function loadHomePrograms() {
    const gridEl = document.getElementById("homeProgramsGrid");
    if (!gridEl) return;
    try {
      const programs = await fetchJson(PROGRAMS_URL);
      const preview = programs.slice(0, HOME_PROGRAMS_LIMIT);
      if (preview.length === 0) return;
      gridEl.innerHTML = "";
      preview.forEach((p) => gridEl.appendChild(buildProgramCard(p)));
    } catch (err) {
      console.warn("Home programs preview load nahi ho paya:", err.message);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadHomeServices();
    loadHomePrograms();
    loadHomeDoctors();  
  });
})();
