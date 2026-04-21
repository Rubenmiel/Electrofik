// ── Datos de productos ────────────────────────────────────────────────────────
const products = [
  {
    id: 1,
    nombre: "Laptop ProBook X15",
    marca: "TechVision",
    precio: "€1.199",
    procesador: "Intel Core i7-13700H",
    ram: "16 GB DDR5",
    almacenamiento: "512 GB NVMe SSD",
    pantalla: '15.6" FHD 144 Hz',
    bateria: "8 horas",
    garantia: "2 años",
    imagen: "https://via.placeholder.com/90/0f3460/ffffff?text=Laptop",
  },
  {
    id: 2,
    nombre: "Laptop UltraSlim S13",
    marca: "AeroTech",
    precio: "€899",
    procesador: "AMD Ryzen 7 7700U",
    ram: "16 GB LPDDR5",
    almacenamiento: "256 GB NVMe SSD",
    pantalla: '13.3" QHD OLED',
    bateria: "12 horas",
    garantia: "1 año",
    imagen: "https://via.placeholder.com/90/16213e/ffffff?text=Laptop",
  },
  {
    id: 3,
    nombre: "Smartphone Nova 12",
    marca: "TechVision",
    precio: "€649",
    procesador: "Snapdragon 8 Gen 2",
    ram: "8 GB",
    almacenamiento: "128 GB",
    pantalla: '6.7" AMOLED 120 Hz',
    bateria: "5000 mAh",
    garantia: "2 años",
    imagen: "https://via.placeholder.com/90/0f3460/ffffff?text=Móvil",
  },
  {
    id: 4,
    nombre: "Smartphone Pixel Ultra",
    marca: "Nexum",
    precio: "€749",
    procesador: "Google Tensor G3",
    ram: "12 GB",
    almacenamiento: "256 GB",
    pantalla: '6.3" LTPO OLED',
    bateria: "4800 mAh",
    garantia: "3 años",
    imagen: "https://via.placeholder.com/90/1a1a2e/ffffff?text=Móvil",
  },
  {
    id: 5,
    nombre: "Tablet MaxPad 10",
    marca: "AeroTech",
    precio: "€429",
    procesador: "Apple M1",
    ram: "8 GB",
    almacenamiento: "64 GB",
    pantalla: '10.9" Liquid Retina',
    bateria: "10 horas",
    garantia: "1 año",
    imagen: "https://via.placeholder.com/90/0f3460/ffffff?text=Tablet",
  },
  {
    id: 6,
    nombre: "Auriculares SoundMax Pro",
    marca: "Nexum",
    precio: "€199",
    procesador: "DSP Nexum V3",
    ram: "–",
    almacenamiento: "–",
    pantalla: "–",
    bateria: "30 horas",
    garantia: "1 año",
    imagen: "https://via.placeholder.com/90/16213e/ffffff?text=Audio",
  },
];

// ── Estado de selección ───────────────────────────────────────────────────────
const MAX_SELECTION = 3;
let selected = []; // array of product ids

// ── Referencias DOM ───────────────────────────────────────────────────────────
const catalog          = document.getElementById("catalog");
const compareCount     = document.getElementById("compare-count");
const compareSlots     = document.getElementById("compare-slots");
const compareBtn       = document.getElementById("compare-btn");
const clearBtn         = document.getElementById("clear-btn");
const comparisonResult = document.getElementById("comparison-result");
const tableWrapper     = document.getElementById("comparison-table-wrapper");
const closeComparison  = document.getElementById("close-comparison");

// ── Renderizar catálogo ───────────────────────────────────────────────────────
function renderCatalog() {
  catalog.innerHTML = "";
  products.forEach((p) => {
    const isSelected = selected.includes(p.id);
    const card = document.createElement("div");
    card.className = "card" + (isSelected ? " selected" : "");
    card.dataset.id = p.id;
    card.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}" />
      <div class="card-name">${p.nombre}</div>
      <div class="card-brand">${p.marca}</div>
      <div class="card-price">${p.precio}</div>
      <button class="btn-select" data-id="${p.id}">
        ${isSelected ? "Quitar" : "Seleccionar"}
      </button>
    `;
    catalog.appendChild(card);
  });
}

// ── Actualizar barra de comparación ──────────────────────────────────────────
function updateCompareBar() {
  const count = selected.length;

  // Contador
  compareCount.textContent = `${count} producto(s) seleccionado(s)`;

  // Slots
  compareSlots.innerHTML = "";
  selected.forEach((id) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    const slot = document.createElement("div");
    slot.className = "compare-slot";
    slot.innerHTML = `
      <span>${p.nombre}</span>
      <span class="remove-slot" data-id="${id}" title="Eliminar">✕</span>
    `;
    compareSlots.appendChild(slot);
  });

  // Botón comparar: requiere al menos 2 productos
  compareBtn.disabled = count < 2;
}

// ── Alternar selección de producto ───────────────────────────────────────────
function toggleProduct(id) {
  id = Number(id);
  if (selected.includes(id)) {
    selected = selected.filter((x) => x !== id);
  } else {
    if (selected.length >= MAX_SELECTION) {
      alert(`Puedes comparar un máximo de ${MAX_SELECTION} productos a la vez.`);
      return;
    }
    selected.push(id);
  }
  renderCatalog();
  updateCompareBar();
}

// ── Construir tabla comparativa ───────────────────────────────────────────────
function buildComparisonTable() {
  const selectedProducts = products.filter((p) => selected.includes(p.id));

  const attributes = [
    { label: "Precio",          key: "precio" },
    { label: "Procesador",      key: "procesador" },
    { label: "Memoria RAM",     key: "ram" },
    { label: "Almacenamiento",  key: "almacenamiento" },
    { label: "Pantalla",        key: "pantalla" },
    { label: "Batería",         key: "bateria" },
    { label: "Garantía",        key: "garantia" },
  ];

  let html = '<table class="comparison-table"><thead><tr><th>Característica</th>';
  selectedProducts.forEach((p) => {
    html += `<th>${p.nombre}<br/><small>${p.marca}</small></th>`;
  });
  html += "</tr></thead><tbody>";

  attributes.forEach(({ label, key }) => {
    html += `<tr><td>${label}</td>`;
    selectedProducts.forEach((p) => {
      html += `<td>${p[key]}</td>`;
    });
    html += "</tr>";
  });

  html += "</tbody></table>";
  return html;
}

// ── Mostrar comparación ───────────────────────────────────────────────────────
function showComparison() {
  tableWrapper.innerHTML = buildComparisonTable();
  comparisonResult.classList.remove("hidden");
  comparisonResult.scrollIntoView({ behavior: "smooth" });
}

// ── Limpiar selección ─────────────────────────────────────────────────────────
function clearSelection() {
  selected = [];
  comparisonResult.classList.add("hidden");
  tableWrapper.innerHTML = "";
  renderCatalog();
  updateCompareBar();
}

// ── Manejadores de eventos ────────────────────────────────────────────────────

// Delegar clics en el catálogo (botones "Seleccionar / Quitar")
catalog.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-select");
  if (btn) toggleProduct(btn.dataset.id);
});

// Eliminar producto desde la barra de comparación
compareSlots.addEventListener("click", (e) => {
  const remove = e.target.closest(".remove-slot");
  if (remove) toggleProduct(remove.dataset.id);
});

// Botón Comparar
compareBtn.addEventListener("click", () => {
  if (selected.length >= 2) showComparison();
});

// Limpiar selección
clearBtn.addEventListener("click", clearSelection);

// Cerrar comparación
closeComparison.addEventListener("click", () => {
  comparisonResult.classList.add("hidden");
});

// ── Inicializar ───────────────────────────────────────────────────────────────
renderCatalog();
updateCompareBar();
