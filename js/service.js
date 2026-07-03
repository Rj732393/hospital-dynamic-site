// Apna backend URL yahan set karein (deployment me change kar dena)
const BASE_URL = "http://localhost:5000";
const API_URL = `${BASE_URL}/api/services`;

async function loadServices() {
  const container = document.getElementById("serviceList");
  container.innerHTML = "<p class='loading-text'>Loading services...</p>";

  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    if (!data.success || data.data.length === 0) {
      container.innerHTML = "<p class='loading-text'>Abhi koi service available nahi hai.</p>";
      return;
    }

    container.innerHTML = data.data
      .map(
        (p) => `
      <div class="service-card">
        ${
          p.ImageUrl
            ? `<img src="${BASE_URL}${p.ImageUrl}" alt="${escapeHtml(p.Title)}">`
            : `<div class="no-image">No Image</div>`
        }
        <div class="service-card-body">
          <h3>${escapeHtml(p.Title)}</h3>
          <p>${escapeHtml(p.ShortDescription || "")}</p>
          <button class="read-more-btn" data-id="${p.ServiceId}">Read More</button>
        </div>
      </div>
    `
      )
      .join("");

    attachReadMoreEvents(data.data);
  } catch (err) {
    container.innerHTML = "<p class='loading-text'>Services load nahi ho paye. Baad me try karein.</p>";
    console.error(err);
  }
}

function attachReadMoreEvents(services) {
  document.querySelectorAll(".read-more-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const service = services.find((p) => p.ServiceId == id);
      if (service) openModal(service);
    });
  });
}

function openModal(service) {
  document.getElementById("modalTitle").innerText = service.Title;
  document.getElementById("modalDescription").innerText = service.Description || "";

  const img = document.getElementById("modalImage");
  if (service.ImageUrl) {
    img.src = `${BASE_URL}${service.ImageUrl}`;
    img.style.display = "block";
  } else {
    img.style.display = "none";
  }

  document.getElementById("serviceModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("serviceModal").classList.add("hidden");
}

// Simple XSS-safe text escape
function escapeHtml(str) {
  const div = document.createElement("div");
  div.innerText = str;
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  loadServices();
  document.getElementById("closeModal").addEventListener("click", closeModal);
  document.getElementById("serviceModal").addEventListener("click", (e) => {
    if (e.target.id === "serviceModal") closeModal();
  });
});
