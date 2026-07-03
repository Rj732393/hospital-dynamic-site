/* ==========================================================
   program.js — fetches Programs from the backend API and
   renders them as cards on program.html (Read More = modal)
   ========================================================== */
(function () {
  // Backend URL — change this to your deployed API URL in production
  const BASE_URL = "http://localhost:5000";
  const API_URL = `${BASE_URL}/api/programs`;

  const skeletonEl = document.getElementById("programsSkeleton");
  const errorEl = document.getElementById("programsError");
  const emptyEl = document.getElementById("programsEmpty");
  const gridEl = document.getElementById("programsGrid");
  const retryBtn = document.getElementById("retryBtn");

  const modal = document.getElementById("programModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalImgWrap = document.getElementById("modalImgWrap");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalMeta = document.getElementById("modalMeta");
  const modalBadge = document.getElementById("modalBadge");
  const modalDescription = document.getElementById("modalDescription");

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
    // ImageUrl already contains a domain -> use as is, otherwise prefix BASE_URL
    return /^https?:\/\//i.test(imageUrl) ? imageUrl : `${BASE_URL}${imageUrl}`;
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function shortText(program) {
    return program.ShortDescription && program.ShortDescription.trim()
      ? program.ShortDescription
      : (program.Description || "").slice(0, 130) + ((program.Description || "").length > 130 ? "…" : "");
  }

  function buildCard(program) {
    const img = resolveImage(program.ImageUrl);
    const dateLabel = formatDate(program.UpdatedAt || program.CreatedAt);

    const card = document.createElement("div");
    card.className = "prog-card bg-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant/20";

    card.innerHTML = `
      <div class="img-wrap h-48 overflow-hidden ${img ? "" : "no-image"}">
        ${img
          ? `<img alt="${escapeHtml(program.Title)}" class="w-full h-full object-cover" src="${img}" onerror="this.parentElement.classList.add('no-image'); this.remove();">`
          : `<span class="material-symbols-outlined text-4xl">self_improvement</span>`}
      </div>
      <div class="p-6 flex flex-col flex-1">
        ${dateLabel ? `<span class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-3" style="background:rgba(45,122,79,.12);color:#2d7a4f">🔄 Updated ${dateLabel}</span>` : ""}
        <h4 class="font-headline-md text-headline-md text-on-surface mb-2">${escapeHtml(program.Title)}</h4>
        <p class="text-on-surface-variant text-sm mb-4 card-desc">${escapeHtml(shortText(program))}</p>
        <div class="card-footer">
          <button type="button" class="read-more-btn block text-center w-full py-2.5 bg-primary text-white rounded-xl font-bold text-label-md hover:bg-primary-container transition-colors" data-id="${program.ProgramId}">Read More</button>
        </div>
      </div>
    `;

    card.querySelector(".read-more-btn").addEventListener("click", () => openModal(program));
    return card;
  }

  function renderPrograms(programs) {
    gridEl.innerHTML = "";
    if (!programs || programs.length === 0) {
      showState("empty");
      return;
    }
    const fragment = document.createDocumentFragment();
    programs.forEach((p) => fragment.appendChild(buildCard(p)));
    gridEl.appendChild(fragment);
    showState("grid");
  }

  async function loadPrograms() {
    showState("loading");
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Server error: " + res.status);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Programs fetch nahi ho paye");
      renderPrograms(data.data);
    } catch (err) {
      console.error("Programs load error:", err);
      showState("error");
    }
  }

  function openModal(program) {
    const img = resolveImage(program.ImageUrl);
    if (img) {
      modalImgWrap.classList.remove("no-image");
      modalImg.src = img;
      modalImg.alt = program.Title || "";
    } else {
      modalImgWrap.classList.add("no-image");
      modalImg.src = "";
    }
    modalTitle.textContent = program.Title || "";
    modalBadge.style.background = "rgba(45,122,79,.12)";
    modalBadge.style.color = "#2d7a4f";
    modalBadge.textContent = "Program";
    const dateLabel = formatDate(program.UpdatedAt || program.CreatedAt);
    modalMeta.textContent = dateLabel ? `Last updated: ${dateLabel}` : "";
    modalDescription.textContent = program.Description || "Detail jald hi update kiya jayega.";

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

  retryBtn.addEventListener("click", loadPrograms);

  document.addEventListener("DOMContentLoaded", loadPrograms);
})();
