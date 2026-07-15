/**
 * ==========================================================
 * app.js
 * ----------------------------------------------------------
 * Application entry point.
 *
 * Responsibilities:
 * - Render the predefined product catalog.
 * - Initialize the storefront UI.
 *
 * Notes:
 * - Product data is provided by the global `products` array
 *   defined in data.js.
 * - Wishlist functionality is intentionally not implemented
 *   in this file.
 * ==========================================================
 */

/**
 * Format a numeric price as Indian Rupees.
 *
 * @param {number} price
 * @returns {string}
 */
function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Create a product card element.
 *
 * @param {Object} product
 * @returns {HTMLElement}
 */
function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const image = document.createElement("img");
  image.className = "product-image";
  image.src = product.image;
  image.alt = product.name;
  image.loading = "lazy";

  image.onerror = () => {
    image.src = "assets/images/placeholder.png";
  };

  const content = document.createElement("div");
  content.className = "product-content";

  const title = document.createElement("h3");
  title.className = "product-name";
  title.textContent = product.name;

  const category = document.createElement("p");
  category.className = "product-category";
  category.textContent = product.category;

  const description = document.createElement("p");
  description.className = "product-description";
  description.textContent = product.description;

  const footer = document.createElement("div");
  footer.className = "product-footer";

  const price = document.createElement("p");
  price.className = "product-price";
  price.textContent = formatPrice(product.price);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn btn-primary add-to-wishlist-btn";
  button.textContent = "Add to Wishlist";
  button.dataset.productId = product.id;

  footer.appendChild(price);
  footer.appendChild(button);

  content.appendChild(title);
  content.appendChild(category);
  content.appendChild(description);
  content.appendChild(footer);

  card.appendChild(image);
  card.appendChild(content);

  return card;
}

/**
 * Render all products into the product grid.
 */
function renderProducts() {
  const productGrid = document.getElementById("product-grid");

  if (!productGrid) {
    console.error('Element with id "product-grid" was not found.');
    return;
  }

  productGrid.innerHTML = "";

  if (!Array.isArray(products)) {
    console.error("Product catalog is unavailable.");
    return;
  }

  products.forEach((product) => {
    productGrid.appendChild(createProductCard(product));
  });
}

/**
 * Initialize the application.
 */
function initializeApp() {
  renderProducts();
}

document.addEventListener("DOMContentLoaded", initializeApp);
