/**
 * ==========================================================
 * wishlist.js
 * ----------------------------------------------------------
 * Wishlist business logic.
 *
 * Responsibilities:
 * - Maintain the runtime wishlist state.
 * - Perform wishlist CRUD operations.
 * - Manage products within wishlists.
 *
 * Notes:
 * - This module updates runtime state only.
 * - Persistence (LocalStorage) is handled elsewhere.
 * - Merge functionality is intentionally excluded.
 * ==========================================================
 */

/**
 * Ensure the shared runtime state exists.
 */
if (typeof state === "undefined") {
  throw new Error("Global runtime state 'state' is not defined.");
}

if (!Array.isArray(state.wishlists)) {
  state.wishlists = [];
}

if (!Object.prototype.hasOwnProperty.call(state, "selectedWishlistId")) {
  state.selectedWishlistId = null;
}

/**
 * Generate a unique wishlist ID.
 *
 * @returns {string}
 */
function generateWishlistId() {
  return `wishlist-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Validate and normalize a wishlist name.
 *
 * @param {string} name
 * @returns {{ valid: boolean, value: string, message: string }}
 */
function validateWishlistName(name) {
  const value = String(name).trim();

  if (value.length === 0) {
    return {
      valid: false,
      value: "",
      message: "Wishlist name cannot be empty.",
    };
  }

  if (value.length > 50) {
    return {
      valid: false,
      value: "",
      message: "Wishlist name cannot exceed 50 characters.",
    };
  }

  return {
    valid: true,
    value,
    message: "",
  };
}

/**
 * Return all wishlists.
 *
 * @returns {Array}
 */
function getWishlists() {
  return state.wishlists;
}

/**
 * Find a wishlist by ID.
 *
 * @param {string} id
 * @returns {Object|null}
 */
function getWishlistById(id) {
  return state.wishlists.find((wishlist) => wishlist.id === id) || null;
}

/**
 * Create a new wishlist.
 *
 * @param {string} name
 * @returns {{success:boolean, wishlist?:Object, message?:string}}
 */
function createWishlist(name) {
  const validation = validateWishlistName(name);

  if (!validation.valid) {
    return {
      success: false,
      message: validation.message,
    };
  }

  const wishlist = {
    id: generateWishlistId(),
    name: validation.value,
    createdAt: new Date().toISOString(),
    products: [],
  };

  state.wishlists.push(wishlist);

  return {
    success: true,
    wishlist,
  };
}

/**
 * Rename an existing wishlist.
 *
 * @param {string} id
 * @param {string} name
 * @returns {{success:boolean, wishlist?:Object, message?:string}}
 */
function renameWishlist(id, name) {
  const wishlist = getWishlistById(id);

  if (!wishlist) {
    return {
      success: false,
      message: "Wishlist not found.",
    };
  }

  const validation = validateWishlistName(name);

  if (!validation.valid) {
    return {
      success: false,
      message: validation.message,
    };
  }

  wishlist.name = validation.value;

  return {
    success: true,
    wishlist,
  };
}

/**
 * Delete a wishlist.
 *
 * @param {string} id
 * @returns {{success:boolean, message?:string}}
 */
function deleteWishlist(id) {
  const index = state.wishlists.findIndex((wishlist) => wishlist.id === id);

  if (index === -1) {
    return {
      success: false,
      message: "Wishlist not found.",
    };
  }

  state.wishlists.splice(index, 1);

  if (state.selectedWishlistId === id) {
    state.selectedWishlistId = null;
  }

  return {
    success: true,
  };
}

/**
 * Select the active wishlist.
 *
 * @param {string} id
 * @returns {{success:boolean, wishlist?:Object, message?:string}}
 */
function selectWishlist(id) {
  const wishlist = getWishlistById(id);

  if (!wishlist) {
    return {
      success: false,
      message: "Wishlist not found.",
    };
  }

  state.selectedWishlistId = id;

  return {
    success: true,
    wishlist,
  };
}

/**
 * Add a product to a wishlist.
 *
 * Product IDs remain unique and insertion order is preserved.
 *
 * @param {string} wishlistId
 * @param {string} productId
 * @returns {{success:boolean, wishlist?:Object, message?:string}}
 */
function addProductToWishlist(wishlistId, productId) {
  const wishlist = getWishlistById(wishlistId);

  if (!wishlist) {
    return {
      success: false,
      message: "Wishlist not found.",
    };
  }

  if (!wishlist.products.includes(productId)) {
    wishlist.products.push(productId);
  }

  return {
    success: true,
    wishlist,
  };
}

/**
 * Remove a product from a wishlist.
 *
 * @param {string} wishlistId
 * @param {string} productId
 * @returns {{success:boolean, wishlist?:Object, message?:string}}
 */
function removeProductFromWishlist(wishlistId, productId) {
  const wishlist = getWishlistById(wishlistId);

  if (!wishlist) {
    return {
      success: false,
      message: "Wishlist not found.",
    };
  }

  wishlist.products = wishlist.products.filter((id) => id !== productId);

  return {
    success: true,
    wishlist,
  };
}
