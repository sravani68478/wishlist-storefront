/**
 * ==========================================================
 * merge.js
 * ----------------------------------------------------------
 * Wishlist merge business logic.
 *
 * Responsibilities:
 * - Merge two existing wishlists into a new wishlist.
 * - Preserve Wishlist A product order.
 * - Append only unique product IDs from Wishlist B.
 * - Leave original wishlists unchanged.
 * - Persist the updated wishlist collection.
 *
 * Dependencies:
 * - state
 * - getWishlistById(id)
 * - getWishlists()
 * - saveWishlists(wishlists)
 *
 * Notes:
 * - This module contains no UI logic.
 * - Product IDs are treated as unique identifiers.
 * ==========================================================
 */

/**
 * Generate a unique wishlist ID.
 *
 * @returns {string}
 */
function generateMergedWishlistId() {
  return `wishlist-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Validate and normalize the merged wishlist name.
 *
 * @param {string} name
 * @returns {{ valid: boolean, value: string, message: string }}
 */
function validateMergedWishlistName(name) {
  const value = String(name).trim();

  if (value.length === 0) {
    return {
      valid: false,
      value: "",
      message: "Merged wishlist name cannot be empty.",
    };
  }

  if (value.length > 50) {
    return {
      valid: false,
      value: "",
      message: "Merged wishlist name cannot exceed 50 characters.",
    };
  }

  return {
    valid: true,
    value,
    message: "",
  };
}

/**
 * Merge two wishlists into a new wishlist.
 *
 * @param {string} wishlistAId
 * @param {string} wishlistBId
 * @param {string} mergedName
 *
 * @returns {{
 *   success: boolean,
 *   wishlist?: Object,
 *   message?: string
 * }}
 */
function mergeWishlists(wishlistAId, wishlistBId, mergedName) {
  // Validate wishlist selection
  if (!wishlistAId || !wishlistBId) {
    return {
      success: false,
      message: "Please select two wishlists.",
    };
  }

  if (wishlistAId === wishlistBId) {
    return {
      success: false,
      message: "Please select two different wishlists.",
    };
  }

  // Validate merged wishlist name
  const validation = validateMergedWishlistName(mergedName);

  if (!validation.valid) {
    return {
      success: false,
      message: validation.message,
    };
  }

  // Retrieve source wishlists
  const wishlistA = getWishlistById(wishlistAId);
  const wishlistB = getWishlistById(wishlistBId);

  if (!wishlistA || !wishlistB) {
    return {
      success: false,
      message: "One or both selected wishlists do not exist.",
    };
  }

  // Merge product IDs while preserving order
  const mergedProducts = [];
  const seen = new Set();

  // Preserve Wishlist A order
  wishlistA.products.forEach((productId) => {
    mergedProducts.push(productId);
    seen.add(productId);
  });

  // Append unique products from Wishlist B
  wishlistB.products.forEach((productId) => {
    if (!seen.has(productId)) {
      mergedProducts.push(productId);
      seen.add(productId);
    }
  });

  // Create new wishlist
  const mergedWishlist = {
    id: generateMergedWishlistId(),
    name: validation.value,
    createdAt: new Date().toISOString(),
    products: mergedProducts,
  };

  // Update runtime state
  state.wishlists.push(mergedWishlist);

  // Persist wishlist collection
  saveWishlists(state.wishlists);

  return {
    success: true,
    wishlist: mergedWishlist,
  };
}
