/* ==========================================================
   services.js — fetches Services from the backend API and
   renders them as cards on services.html (Read More = modal)
   ========================================================== */
(function () {
  // Backend URL — change this to your deployed API URL in production
  const BASE_URL = "http://localhost:5000";
  const API_URL = `${BASE_URL}/api/services`;

  const skeletonEl = document.getElementById("servicesSkeleton");
  const errorEl = document.getElementById("servicesError");
  const errorDetailEl = document.getElementById("servicesErrorDetail");
  const emptyEl = document.getElementById("servicesEmpty");
  const gridEl = document.getElementById("servicesGrid");
  const retryBtn = document.getElementById("servicesRetryBtn");

  const modal = document.getElementById("serviceModal");
  const modalCloseBtn = document.getElementById("serviceModalCloseBtn");
  const modalImgWrap = document.getElementById("serviceModalImgWrap");
  const modalImg = document.getElementById("serviceModalImg");
  const modalTitle = document.getElementById("serviceModalTitle");
  const modalMeta = document.getElementById("serviceModalMeta");
  const modalBadge = document.getElementById("serviceModalBadge");
  const modalDescription = document.getElementById("serviceModalDescription");

  // ------------------------------------------------------------------
  // Backend kabhi PascalCase bhejta hai (Title, Description) aur kabhi
  // camelCase (title, description) — ya alag naam bhi ho sakta hai
  // (LongDescription, Details, Content, wagera). Ye helper har possible
  // naam try karta hai taaki "description Read More me nahi dikh raha"
  // jaisi field-mismatch problem kabhi na ho.
  // ------------------------------------------------------------------
  function pick(obj, keys) {
    for (const k of keys) {
      if (obj && obj[k] !== undefined && obj[k] !== null && String(obj[k]).trim() !== "") {
        return obj[k];
      }
    }
    return "";
  }

  function getId(s) {
    return pick(s, ["ServiceId", "serviceId", "Id", "id", "_id"]);
  }
  function getTitle(s) {
    return pick(s, ["Title", "title", "Name", "name"]);
  }
  function getShortDesc(s) {
    return pick(s, ["ShortDescription", "shortDescription", "Summary", "summary", "Subtitle", "subtitle"]);
  }
  function getDescription(s) {
    return pick(s, [
      "Description",
      "description",
      "LongDescription",
      "longDescription",
      "FullDescription",
      "fullDescription",
      "Details",
      "details",
      "Content",
      "content",
      "Body",
      "body",
    ]);
  }
  function getImage(s) {
    return pick(s, ["ImageUrl", "imageUrl", "Image", "image", "Icon", "icon", "Photo", "photo"]);
  }
  function getCreatedAt(s) {
    return pick(s, ["CreatedAt", "createdAt", "created_at"]);
  }
  function getUpdatedAt(s) {
    return pick(s, ["UpdatedAt", "updatedAt", "updated_at"]);
  }

  function showState(state) {
    skeletonEl.classList.add("hidden");
    errorEl.classList.add("hidden");
    emptyEl.classList.add("hidden");
    gridEl.classList.add("hidden");
    if (state === "loading") skeletonEl.classList.remove("hidden");
    if (state === "error") errorEl.classList.remove("hidden");
    if (state === "empty") emptyEl.classList.remove("hidden");
    if (state === "grid") gridEl.classList.remove("hidden");
  }

  function resolveImage(imageUrl) {
    if (!imageUrl) return null;
    const fullUrl = /^https?:\/\//i.test(imageUrl) ? imageUrl : `${BASE_URL}${imageUrl}`;
    return encodeURI(fullUrl);
  }

  // Agar ImageUrl http(s) URL hai ya /uploads/... path hai ya file
  // extension wala hai to photo maano; chhota emoji/icon text ho to icon.
  function isImagePath(val) {
    if (!val) return false;
    if (/^https?:\/\//i.test(val)) return true;
    if (val.startsWith("/uploads/")) return true;
    if (/\.(png|jpe?g|webp|gif|svg)$/i.test(val)) return true;
    return false;
  }

  function resolveIcon(imageUrl) {
    if (!imageUrl) return "🩺";
    if (isImagePath(imageUrl)) return null; // ye photo hai, icon nahi
    return imageUrl;
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function shortText(service) {
    const short = getShortDesc(service);
    if (short) return short;
    const desc = getDescription(service);
    return desc.slice(0, 130) + (desc.length > 130 ? "…" : "");
  }

  function buildCard(service) {
    const imageUrl = getImage(service);
    const icon = resolveIcon(imageUrl);
    const img = icon ? null : resolveImage(imageUrl);
    const title = getTitle(service);
    const shortDesc = getShortDesc(service);

    const card = document.createElement("div");
    card.className = "svc-card bg-white p-7 rounded-2xl border border-outline-variant/30 hover:shadow-xl transition-all";

    card.innerHTML = `
      ${img
        ? `<div class="svc-img-wrap"><img alt="${escapeHtml(title)}" src="${img}" onerror="this.parentElement.style.display='none';"></div>`
        : `<div class="svc-icon-box">${escapeHtml(icon)}</div>`}
      <h3 class="font-headline-md text-headline-md text-on-surface mb-2">${escapeHtml(title)}</h3>
      <p class="text-on-surface-variant font-body-md mb-4 text-sm svc-desc">${escapeHtml(shortText(service))}</p>
      ${shortDesc ? `<span class="svc-badge">${escapeHtml(shortDesc)}</span>` : ""}
      <div class="mt-4">
        <button type="button" class="read-more-btn text-primary font-bold text-label-md flex items-center gap-1" data-id="${escapeHtml(getId(service))}">Read More <span class="material-symbols-outlined text-[18px]">chevron_right</span></button>
      </div>
    `;

    card.querySelector(".read-more-btn").addEventListener("click", () => openModal(service));
    return card;
  }

  function renderServices(services) {
    gridEl.innerHTML = "";
    if (!services || services.length === 0) {
      showState("empty");
      return;
    }
    gridEl.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5";
    const fragment = document.createDocumentFragment();
    services.forEach((s) => fragment.appendChild(buildCard(s)));
    gridEl.appendChild(fragment);
    showState("grid");
  }

  async function loadServices() {
    showState("loading");
    try {
      const res = await fetch(encodeURI(API_URL));
      const rawText = await res.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(`Server ne JSON nahi bheja (status ${res.status}). Raw: ${rawText.slice(0, 300)}`);
      }
      if (!res.ok || !data.success) {
        throw new Error(`(${res.status}) ${data.message || "Services fetch nahi ho paye"}`);
      }
      console.log("Fetched services:", data.data);
      renderServices(data.data);
    } catch (err) {
      console.error("Services load error:", err);
      if (errorDetailEl) errorDetailEl.textContent = err.message;
      showState("error");
    }
  }

  function openModal(service) {
    const imageUrl = getImage(service);
    const icon = resolveIcon(imageUrl);
    const img = icon ? null : resolveImage(imageUrl);
    if (img) {
      modalImgWrap.classList.remove("no-image");
      modalImgWrap.querySelector("#serviceModalIcon")?.remove();
      modalImg.style.display = "";
      modalImg.src = img;
      modalImg.alt = getTitle(service);
    } else {
      modalImgWrap.classList.add("no-image");
      modalImg.style.display = "none";
      modalImg.src = "";
    }
    modalTitle.textContent = getTitle(service);
    modalBadge.style.background = "rgba(0,63,135,.1)";
    modalBadge.style.color = "#003f87";
    modalBadge.textContent = getShortDesc(service) || "Service";
    const dateLabel = formatDate(getUpdatedAt(service) || getCreatedAt(service));
    modalMeta.textContent = dateLabel ? `Last updated: ${dateLabel}` : "";

    const desc = getDescription(service);
    modalDescription.textContent = desc || "Detail jald hi update kiya jayega.";

    // Debug helper: agar description khaali hai to console me poora
    // object dikhado, taaki backend ka asli field naam pata chal sake.
    if (!desc) {
      console.warn("Service me Description field nahi mila. Poora object:", service);
    }

    modal.classList.remove("hidden");
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    modal.classList.add("hidden");
    document.body.classList.remove("modal-open");
    modalImg.src = "";
  }

  modalCloseBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
  });

  retryBtn.addEventListener("click", loadServices);

  document.addEventListener("DOMContentLoaded", loadServices);
})();
