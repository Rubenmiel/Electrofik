/**
 * Electrofik - Main Application Logic
 * Comparative application for electronic products
 */

const MAX_COMPARE = 3;
let selectedProducts = [];
let currentCategory = "all";
let searchQuery = "";

// ── Initialisation ─────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderProducts(products);
  bindSearch();
});

// ── Category Tabs ───────────────────────────────────────────────────────────
function renderCategories() {
  const container = document.getElementById("category-tabs");
  container.innerHTML = categories
    .map(
      (cat) => `
      <button
        class="category-tab ${cat.id === currentCategory ? "active" : ""}"
        data-category="${cat.id}"
        onclick="filterByCategory('${cat.id}')"
      >
        <span class="cat-icon">${cat.icon}</span>
        <span>${cat.label}</span>
      </button>`
    )
    .join("");
}

function filterByCategory(categoryId) {
  currentCategory = categoryId;
  renderCategories();
  applyFilters();
}

// ── Search ──────────────────────────────────────────────────────────────────
function bindSearch() {
  const input = document.getElementById("search-input");
  input.addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    applyFilters();
  });
}

// ── Filter & Render Products ────────────────────────────────────────────────
function applyFilters() {
  let filtered = products;

  if (currentCategory !== "all") {
    filtered = filtered.filter((p) => p.category === currentCategory);
  }

  if (searchQuery) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery) ||
        p.brand.toLowerCase().includes(searchQuery)
    );
  }

  renderProducts(filtered);
}

function renderProducts(list) {
  const container = document.getElementById("product-grid");

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p class="empty-icon">🔍</p>
        <p>No se encontraron productos.</p>
      </div>`;
    return;
  }

  container.innerHTML = list
    .map((p) => {
      const isSelected = selectedProducts.some((s) => s.id === p.id);
      const isDisabled = !isSelected && selectedProducts.length >= MAX_COMPARE;
      return `
        <div class="product-card ${isSelected ? "selected" : ""} ${isDisabled ? "disabled" : ""}"
             id="card-${p.id}">
          <div class="product-emoji">${p.image}</div>
          <div class="product-brand">${p.brand}</div>
          <h3 class="product-name">${p.name}</h3>
          <div class="product-price">€${p.price.toLocaleString("es-ES")}</div>
          <div class="product-rating">
            ${renderStars(p.rating)}
            <span class="review-count">(${p.reviews.toLocaleString("es-ES")})</span>
          </div>
          <button
            class="btn-compare ${isSelected ? "btn-remove" : ""}"
            onclick="toggleCompare(${p.id})"
            ${isDisabled ? "disabled" : ""}
          >
            ${isSelected ? "✓ Seleccionado" : isDisabled ? "Máx. alcanzado" : "+ Comparar"}
          </button>
        </div>`;
    })
    .join("");
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let stars = "";
  for (let i = 0; i < full; i++) stars += "★";
  if (half) stars += "½";
  const empty = 5 - full - (half ? 1 : 0);
  for (let i = 0; i < empty; i++) stars += "☆";
  return `<span class="stars">${stars}</span> <span class="rating-value">${rating}</span>`;
}

// ── Compare Selection ───────────────────────────────────────────────────────
function toggleCompare(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const idx = selectedProducts.findIndex((p) => p.id === productId);
  if (idx >= 0) {
    selectedProducts.splice(idx, 1);
  } else {
    if (selectedProducts.length >= MAX_COMPARE) return;
    selectedProducts.push(product);
  }

  updateCompareTray();
  applyFilters();
}

function updateCompareTray() {
  const tray = document.getElementById("compare-tray");
  const count = document.getElementById("compare-count");
  const items = document.getElementById("compare-items");

  count.textContent = selectedProducts.length;

  items.innerHTML = selectedProducts
    .map(
      (p) => `
      <div class="tray-item">
        <span>${p.image} ${p.name}</span>
        <button class="tray-remove" onclick="toggleCompare(${p.id})" title="Quitar">✕</button>
      </div>`
    )
    .join("");

  if (selectedProducts.length >= 2) {
    tray.classList.add("visible");
  } else if (selectedProducts.length === 0) {
    tray.classList.remove("visible");
    // hide comparison panel if open
    document.getElementById("comparison-panel").classList.remove("visible");
  } else {
    tray.classList.add("visible");
  }
}

function clearCompare() {
  selectedProducts = [];
  updateCompareTray();
  applyFilters();
  document.getElementById("comparison-panel").classList.remove("visible");
}

// ── Comparison Panel ────────────────────────────────────────────────────────
function openComparison() {
  if (selectedProducts.length < 2) {
    alert("Selecciona al menos 2 productos para comparar.");
    return;
  }
  renderComparisonTable();
  document.getElementById("comparison-panel").classList.add("visible");
  document.getElementById("comparison-panel").scrollIntoView({ behavior: "smooth" });
}

function closeComparison() {
  document.getElementById("comparison-panel").classList.remove("visible");
}

function renderComparisonTable() {
  const panel = document.getElementById("comparison-panel");

  // Collect all spec keys from selected products
  const allSpecKeys = [
    ...new Set(selectedProducts.flatMap((p) => Object.keys(p.specs)))
  ];

  const headerCols = selectedProducts
    .map(
      (p) => `
      <th>
        <div class="compare-header-emoji">${p.image}</div>
        <div class="compare-header-brand">${p.brand}</div>
        <div class="compare-header-name">${p.name}</div>
        <div class="compare-header-price">€${p.price.toLocaleString("es-ES")}</div>
      </th>`
    )
    .join("");

  const specRows = allSpecKeys
    .map((key) => {
      const cells = selectedProducts
        .map((p) => {
          const val = p.specs[key] || "—";
          return `<td>${val}</td>`;
        })
        .join("");
      return `<tr><th class="spec-label">${key}</th>${cells}</tr>`;
    })
    .join("");

  const ratingRow = selectedProducts
    .map(
      (p) => `<td>${renderStars(p.rating)} <small>(${p.reviews.toLocaleString("es-ES")} reseñas)</small></td>`
    )
    .join("");

  panel.innerHTML = `
    <div class="comparison-header">
      <h2>Comparativa de Productos</h2>
      <button class="btn-close" onclick="closeComparison()">✕ Cerrar</button>
    </div>
    <div class="table-wrapper">
      <table class="comparison-table">
        <thead>
          <tr>
            <th class="spec-label-header">Especificación</th>
            ${headerCols}
          </tr>
        </thead>
        <tbody>
          <tr class="rating-row">
            <th class="spec-label">Valoración</th>
            ${ratingRow}
          </tr>
          ${specRows}
        </tbody>
      </table>
    </div>`;
}
