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
 * ==========================================================
 */

if (typeof state === "undefined") {
  throw new Error("Global runtime state 'state' is not defined.");
}

if (!Array.isArray(state.wishlists)) {
  state.wishlists = [];
}

if (!("selectedWishlistId" in state)) {
  state.selectedWishlistId = null;
}

function generateWishlistId() {
  return `wishlist-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function validateWishlistName(name) {
  const value = String(name).trim();

  if (value.length === 0) {
    return {
      valid: false,
      message: "Wishlist name cannot be empty.",
    };
  }

  if (value.length > 50) {
    return {
      valid: false,
      message: "Wishlist name cannot exceed 50 characters.",
    };
  }

  return {
    valid: true,
    value,
  };
}

function getWishlists() {
  return state.wishlists;
}

function getWishlistById(id) {
  return state.wishlists.find((wishlist) => wishlist.id === id) || null;
}

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

  saveWishlists(state.wishlists);

  return {
    success: true,
    wishlist,
  };
}

function renameWishlist(id, newName) {
  const wishlist = getWishlistById(id);

  if (!wishlist) {
    return {
      success: false,
      message: "Wishlist not found.",
    };
  }

  const validation = validateWishlistName(newName);

  if (!validation.valid) {
    return {
      success: false,
      message: validation.message,
    };
  }

  wishlist.name = validation.value;

  saveWishlists(state.wishlists);

  return {
    success: true,
    wishlist,
  };
}

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

  saveWishlists(state.wishlists);

  return {
    success: true,
  };
}

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

  saveWishlists(state.wishlists);

  return {
    success: true,
    wishlist,
  };
}

function removeProductFromWishlist(wishlistId, productId) {
  const wishlist = getWishlistById(wishlistId);

  if (!wishlist) {
    return {
      success: false,
      message: "Wishlist not found.",
    };
  }

  wishlist.products = wishlist.products.filter((id) => id !== productId);

  saveWishlists(state.wishlists);

  return {
    success: true,
    wishlist,
  };
}
