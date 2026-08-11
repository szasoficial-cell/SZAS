/*
===========================================================
SZAS — CATÁLOGO
===========================================================
CONFIGURACIÓN SIN INVENTARIO / SIN STOCK.

CATÁLOGO PRINCIPAL:
1. SACO 3RD DROP
2. CAMISA 3RD DROP
3. CONJUNTO NIGHT SHIFT

NIGHT SHIFT:
- Conjunto: $145.000
- Chaqueta: $80.000
- Sudadera: $75.000
- Ahorro del conjunto: $10.000

Las piezas individuales existen como opciones de compra,
pero NO aparecen como productos principales del catálogo.
===========================================================
*/

const CONFIG = {
  BRAND: "SZAS",
  WHATSAPP: "573224982212", // CAMBIA ESTE NÚMERO SI ES NECESARIO
  INSTAGRAM: "https://instagram.com/",
  TIKTOK: "https://tiktok.com/",
  CURRENCY: "COP",
  SIZES: ["S", "M", "L", "XL", "XXL"]
};

const PRODUCTS = [
  {
    id: "saco-3rd-drop",
    name: "SACO 3RD DROP",
    category: "SACOS",
    price: 75000,
    images: ["imagenes/saco-3rd-drop-1.jpg", "imagenes/saco-3rd-drop-2.jpg"],
    description: "SACO 3RD DROP. Agrega aquí la descripción definitiva de la prenda.",
    sizes: CONFIG.SIZES,
    guide: "superior",
    available: true
  },
  {
    id: "camisa-3rd-drop",
    name: "CAMISA 3RD DROP",
    category: "CAMISAS",
    price: 35000,
    images: ["imagenes/camisa-3rd-drop-1.jpg", "imagenes/camisa-3rd-drop-2.jpg"],
    description: "CAMISA 3RD DROP. Agrega aquí la descripción definitiva de la prenda.",
    sizes: CONFIG.SIZES,
    guide: "superior",
    available: true
  },
  {
    id: "night-shift",
    name: "CONJUNTO NIGHT SHIFT",
    category: "CONJUNTOS",
    price: 145000,
    images: ["imagenes/night-shift-1.jpg", "imagenes/night-shift-2.jpg", "imagenes/night-shift-3.jpg"],
    description: "Chaqueta + sudadera. Puedes comprar el conjunto completo o elegir cada pieza por separado.",
    sizes: CONFIG.SIZES,
    bundle: true,
    guide: "superior",
    available: true
  }
];

const NIGHT_SHIFT = {
  bundle: { id: "night-shift", name: "CONJUNTO NIGHT SHIFT", price: 145000 },
  jacket: { id: "night-shift-chaqueta", name: "CHAQUETA NIGHT SHIFT", price: 80000, guide: "superior", images: ["imagenes/night-shift-chaqueta-1.jpg", "imagenes/night-shift-chaqueta-2.jpg"] },
  pants: { id: "night-shift-sudadera", name: "SUDADERA NIGHT SHIFT", price: 75000, guide: "inferior", images: ["imagenes/night-shift-sudadera-1.jpg", "imagenes/night-shift-sudadera-2.jpg"] }
};

const SIZE_GUIDES = {
  superior: {
    title: "GUÍA DE TALLAS — PARTE SUPERIOR",
    headers: ["TALLA", "PECHO", "LARGO", "HOMBRO", "MANGA"],
    rows: [
      ["S", "92–96 cm", "68 cm", "44 cm", "22 cm"],
      ["M", "96–100 cm", "70 cm", "46 cm", "23 cm"],
      ["L", "100–105 cm", "72 cm", "48 cm", "24 cm"],
      ["XL", "105–110 cm", "74 cm", "50 cm", "25 cm"],
      ["XXL", "110–115 cm", "76 cm", "52 cm", "26 cm"]
    ]
  },
  inferior: {
    title: "GUÍA DE TALLAS — PARTE INFERIOR",
    headers: ["TALLA", "CINTURA", "CADERA", "LARGO"],
    rows: [
      ["S", "76–80 cm", "92–96 cm", "100 cm"],
      ["M", "80–84 cm", "96–100 cm", "102 cm"],
      ["L", "84–89 cm", "100–105 cm", "104 cm"],
      ["XL", "89–94 cm", "105–110 cm", "106 cm"],
      ["XXL", "94–99 cm", "110–115 cm", "108 cm"]
    ]
  }
};

let cart = JSON.parse(localStorage.getItem("szasCart") || "[]");
let currentProduct = null;
let currentMode = "bundle";
let quantity = 1;

const $ = id => document.getElementById(id);
const money = value => new Intl.NumberFormat("es-CO", {
  style: "currency", currency: CONFIG.CURRENCY, maximumFractionDigits: 0
}).format(value);

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function saveCart() {
  localStorage.setItem("szasCart", JSON.stringify(cart));
  renderCart();
}

function getProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

function renderCategories() {
  // No filtros ni categorías innecesarias: el catálogo principal son exactamente 3 referencias.
  $("categoryList").innerHTML = "";
}

function renderProducts() {
  $("products").innerHTML = PRODUCTS.map((product, index) => `
    <article class="product-card" style="animation-delay:${index * 70}ms">
      <button class="product-photo" data-open-product="${escapeHtml(product.id)}" type="button">
        <img src="${escapeHtml(product.images?.[0] || "")}" alt="${escapeHtml(product.name)}"
          onerror="this.style.display='none';this.nextElementSibling.hidden=false">
        <span class="photo-placeholder" hidden>
          COLOCA TU FOTO<br><small>${escapeHtml(product.images?.[0] || "")}</small>
        </span>
        <span class="product-number">${String(index + 1).padStart(2, "0")}</span>
      </button>
      <div class="product-info">
        <div>
          <span class="product-category">${escapeHtml(product.category)}</span>
          <h3>${escapeHtml(product.name)}</h3>
        </div>
        <strong>${product.price ? money(product.price) : "PRECIO POR CONFIGURAR"}</strong>
      </div>
      <button class="product-link" data-open-product="${escapeHtml(product.id)}" type="button">
        VER PRODUCTO <span>↗</span>
      </button>
    </article>
  `).join("");
  $("productCount").textContent = "3 PRODUCTOS";
  $("emptyState").hidden = true;
}

function renderGallery(images, name) {
  const list = images?.length ? images : [""];
  $("mainPhoto").innerHTML = `
    <img src="${escapeHtml(list[0])}" alt="${escapeHtml(name)}"
      onerror="this.style.display='none';this.nextElementSibling.hidden=false">
    <span class="photo-placeholder" hidden>COLOCA TU FOTO</span>
  `;
  $("thumbs").innerHTML = list.map((image, i) => `
    <button type="button" class="${i === 0 ? "active" : ""}" data-thumb="${i}">
      <img src="${escapeHtml(image)}" alt="">
    </button>
  `).join("");

  document.querySelectorAll("[data-thumb]").forEach(button => {
    button.onclick = () => {
      document.querySelectorAll("[data-thumb]").forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      const image = list[Number(button.dataset.thumb)];
      $("mainPhoto").innerHTML = `
        <img src="${escapeHtml(image)}" alt="${escapeHtml(name)}"
          onerror="this.style.display='none';this.nextElementSibling.hidden=false">
        <span class="photo-placeholder" hidden>COLOCA TU FOTO</span>
      `;
    };
  });
}

function openLayer(id) {
  $(id).classList.add("open");
  $("modalBackdrop").classList.add("open");
  document.body.classList.add("no-scroll");
}

function closeLayer(id) {
  $(id).classList.remove("open");
  if (![ "productModal", "guideModal", "checkoutModal" ].some(x => $(x).classList.contains("open"))) {
    $("modalBackdrop").classList.remove("open");
    document.body.classList.remove("no-scroll");
  }
}

function setSizeOptions(selectId, sizes = CONFIG.SIZES) {
  $(selectId).innerHTML = sizes.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join("");
}

function showBundleUI() {
  $("singleSizeField").hidden = true;
  $("bundleOptions").hidden = false;
  $("bundleChoiceFull").classList.add("active");
  $("bundleChoiceJacket").classList.remove("active");
  $("bundleChoicePants").classList.remove("active");
  $("bundleFullSizes").hidden = false;
  $("bundleSingleSize").hidden = true;
  $("detailPrice").textContent = money(145000);
  $("bundleSavings").hidden = false;
  setSizeOptions("bundleJacketSize");
  setSizeOptions("bundlePantsSize");
}

function showSingleBundlePiece(type) {
  const piece = type === "jacket" ? NIGHT_SHIFT.jacket : NIGHT_SHIFT.pants;
  currentMode = type;
  $("bundleChoiceFull").classList.remove("active");
  $("bundleChoiceJacket").classList.toggle("active", type === "jacket");
  $("bundleChoicePants").classList.toggle("active", type === "pants");
  $("bundleFullSizes").hidden = true;
  $("bundleSingleSize").hidden = false;
  $("bundleSavings").hidden = true;
  $("detailPrice").textContent = money(piece.price);
  $("singleBundleSize").innerHTML = (CONFIG.SIZES).map(s => `<option>${s}</option>`).join("");
}

function openProduct(id) {
  currentProduct = getProduct(id);
  if (!currentProduct) return;

  quantity = 1;
  currentMode = currentProduct.bundle ? "bundle" : "single";
  $("qty").textContent = "1";
  $("detailCategory").textContent = currentProduct.category;
  $("detailName").textContent = currentProduct.name;
  $("detailDescription").textContent = currentProduct.description || "";
  renderGallery(currentProduct.images, currentProduct.name);

  if (currentProduct.bundle) {
    showBundleUI();
  } else {
    $("singleSizeField").hidden = false;
    $("bundleOptions").hidden = true;
    $("detailPrice").textContent = currentProduct.price ? money(currentProduct.price) : "PRECIO POR CONFIGURAR";
    setSizeOptions("detailSize", currentProduct.sizes);
  }

  openLayer("productModal");
}

function addItem(item) {
  const old = cart.find(x => x.key === item.key);
  if (old) old.qty += item.qty || 1;
  else cart.push({ ...item, qty: item.qty || 1 });
  saveCart();
}

function addCurrent(openCartAfter = true) {
  if (!currentProduct) return;

  if (currentProduct.bundle) {
    if (currentMode === "bundle") {
      const jacketSize = $("bundleJacketSize").value;
      const pantsSize = $("bundlePantsSize").value;
      addItem({
        key: `night-shift|bundle|${jacketSize}|${pantsSize}`,
        type: "bundle",
        productId: "night-shift",
        name: "CONJUNTO NIGHT SHIFT",
        price: 145000,
        jacketSize,
        pantsSize,
        qty: quantity
      });
    } else {
      const piece = currentMode === "jacket" ? NIGHT_SHIFT.jacket : NIGHT_SHIFT.pants;
      const size = $("singleBundleSize").value;
      addItem({
        key: `${piece.id}|${size}`,
        type: currentMode,
        productId: piece.id,
        name: piece.name,
        price: piece.price,
        size,
        qty: quantity
      });
    }
  } else {
    const size = $("detailSize").value;
    addItem({
      key: `${currentProduct.id}|${size}`,
      type: "single",
      productId: currentProduct.id,
      name: currentProduct.name,
      price: currentProduct.price,
      size,
      qty: quantity
    });
  }

  closeLayer("productModal");
  if (openCartAfter) openCart();
}

function renderCart() {
  $("cartCount").textContent = cart.reduce((s, i) => s + i.qty, 0);

  if (!cart.length) {
    $("cartItems").innerHTML = `
      <div class="empty-cart">
        <span>EL CARRITO ESTÁ VACÍO.</span>
        <p>Selecciona una de las tres referencias de SZAS.</p>
      </div>`;
    $("cartTotal").textContent = money(0);
    return;
  }

  let total = 0;

  $("cartItems").innerHTML = cart.map((item, index) => {
    total += item.price * item.qty;

    let detail = "";
    if (item.type === "bundle") {
      detail = `<p>Chaqueta: ${escapeHtml(item.jacketSize)}</p>
                <p>Sudadera: ${escapeHtml(item.pantsSize)}</p>`;
    } else {
      detail = `<p>Talla: ${escapeHtml(item.size)}</p>`;
    }

    const image = item.type === "bundle"
      ? PRODUCTS.find(p => p.id === "night-shift")?.images?.[0]
      : item.type === "jacket" ? NIGHT_SHIFT.jacket.images[0]
      : item.type === "pants" ? NIGHT_SHIFT.pants.images[0]
      : getProduct(item.productId)?.images?.[0];

    return `
      <article class="cart-row">
        <img src="${escapeHtml(image || "")}" alt="">
        <div>
          <span>${item.type === "bundle" ? "CONJUNTO" : "PIEZA"}</span>
          <h3>${escapeHtml(item.name)}</h3>
          ${detail}
          <strong>${money(item.price * item.qty)}</strong>
        </div>
        <button class="remove" data-remove="${index}" type="button">×</button>
      </article>
    `;
  }).join("");

  $("cartTotal").textContent = money(total);
}

function openCart() {
  $("cart").classList.add("open");
  $("overlay").classList.add("open");
  renderCart();
}

function closeCart() {
  $("cart").classList.remove("open");
  $("overlay").classList.remove("open");
}

function openGuide(type = currentProduct?.guide || "superior") {
  const guide = SIZE_GUIDES[type] || SIZE_GUIDES.superior;
  $("guideTitle").textContent = guide.title;
  $("guideTabs").innerHTML = Object.keys(SIZE_GUIDES).map(key => `
    <button type="button" class="${key === type ? "active" : ""}" data-guide="${key}">
      ${key === "superior" ? "SUPERIOR" : "INFERIOR"}
    </button>
  `).join("");
  $("guideContent").innerHTML = `
    <table>
      <thead><tr>${guide.headers.map(h => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead>
      <tbody>${guide.rows.map(row => `<tr>${row.map(c => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`).join("")}</tbody>
    </table>`;
  openLayer("guideModal");
  document.querySelectorAll("[data-guide]").forEach(b => b.onclick = () => openGuide(b.dataset.guide));
}

function checkout() {
  if (!cart.length) return;
  let total = 0;

  $("checkoutSummary").innerHTML = cart.map(item => {
    total += item.price * item.qty;
    const details = item.type === "bundle"
      ? `Chaqueta: ${escapeHtml(item.jacketSize)} · Sudadera: ${escapeHtml(item.pantsSize)}`
      : `Talla: ${escapeHtml(item.size)}`;
    return `${escapeHtml(item.name)} · ${details} · x${item.qty} · ${money(item.price * item.qty)}`;
  }).join("<br>") + `<hr><strong>TOTAL: ${money(total)}</strong>`;

  closeCart();
  openLayer("checkoutModal");
}

function sendOrder(event) {
  event.preventDefault();
  if (!cart.length) return;

  const name = $("customerName").value.trim();
  const phone = $("customerPhone").value.trim();
  const city = $("customerCity").value.trim();
  const neighborhood = $("customerNeighborhood").value.trim();
  const address = $("customerAddress").value.trim();
  const notes = $("customerNotes").value.trim();

  let total = 0;
  const lines = cart.map(item => {
    total += item.price * item.qty;
    const details = item.type === "bundle"
      ? `Chaqueta: ${item.jacketSize} / Sudadera: ${item.pantsSize}`
      : `Talla: ${item.size}`;
    return `• ${item.name} — ${details} — x${item.qty} — ${money(item.price * item.qty)}`;
  }).join("\n");

  const text = `Hola ${CONFIG.BRAND}, quiero realizar este pedido:

${lines}

TOTAL: ${money(total)}

DATOS DEL CLIENTE
Nombre: ${name}
WhatsApp: ${phone}
Ciudad: ${city}
Barrio: ${neighborhood}
Dirección: ${address}${notes ? `\nNotas: ${notes}` : ""}`;

  window.open(`https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank");
}

document.addEventListener("click", event => {
  const productButton = event.target.closest("[data-open-product]");
  if (productButton) openProduct(productButton.dataset.openProduct);

  const remove = event.target.closest("[data-remove]");
  if (remove) {
    cart.splice(Number(remove.dataset.remove), 1);
    saveCart();
  }
});

$("openCart").onclick = openCart;
$("closeCart").onclick = closeCart;
$("overlay").onclick = closeCart;
$("closeProduct").onclick = () => closeLayer("productModal");
$("closeGuide").onclick = () => closeLayer("guideModal");
$("closeCheckout").onclick = () => closeLayer("checkoutModal");
$("openGuide").onclick = () => openGuide();
$("addDetail").onclick = () => addCurrent(true);
$("buyNow").onclick = () => addCurrent(true);

$("bundleChoiceFull").onclick = () => { currentMode = "bundle"; showBundleUI(); };
$("bundleChoiceJacket").onclick = () => showSingleBundlePiece("jacket");
$("bundleChoicePants").onclick = () => showSingleBundlePiece("pants");

$("minus").onclick = () => {
  quantity = Math.max(1, quantity - 1);
  $("qty").textContent = quantity;
};
$("plus").onclick = () => {
  quantity++;
  $("qty").textContent = quantity;
};

$("checkout").onclick = checkout;
$("checkoutForm").onsubmit = sendOrder;

$("menuToggle").onclick = () => $("mobileMenu").classList.add("open");
$("mobileClose").onclick = () => $("mobileMenu").classList.remove("open");
document.querySelectorAll(".mobile-menu a").forEach(a => a.onclick = () => $("mobileMenu").classList.remove("open"));

$("footerInstagram").href = CONFIG.INSTAGRAM;
$("footerTikTok").href = CONFIG.TIKTOK;

$("modalBackdrop").onclick = () => {
  ["productModal", "guideModal", "checkoutModal"].forEach(id => $(id).classList.remove("open"));
  $("modalBackdrop").classList.remove("open");
  document.body.classList.remove("no-scroll");
};

document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  $("mobileMenu").classList.remove("open");
  closeCart();
  ["productModal", "guideModal", "checkoutModal"].forEach(id => $(id).classList.remove("open"));
  $("modalBackdrop").classList.remove("open");
  document.body.classList.remove("no-scroll");
});

renderCategories();
renderProducts();
renderCart();
