/**
 * ==========================================================
 * storage.js
 * ----------------------------------------------------------
 * LocalStorage persistence layer.
 *
 * Responsibilities:
 * - Load wishlist data from LocalStorage.
 * - Save wishlist data to LocalStorage.
 *
 * Notes:
 * - Only wishlist data is stored.
 * - Product data is NEVER stored in LocalStorage.
 * - This module contains no UI or business logic.
 * ==========================================================
 */

const STORAGE_KEY = "wishlists";

/**
 * Loads wishlists from LocalStorage.
 *
 * Returns an empty array when:
 * - No data exists.
 * - Stored data is invalid JSON.
 * - Stored data is not in the expected top-level array format.
 *
 * @returns {Array}
 */
function loadWishlists() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored === null) {
      return [];
    }

    const wishlists = JSON.parse(stored);

    if (!Array.isArray(wishlists)) {
      return [];
    }

    return wishlists;
  } catch (error) {
    return [];
  }
}

/**
 * Saves the complete wishlist collection to LocalStorage.
 *
 * Expected schema:
 * [
 *   {
 *     id: String,
 *     name: String,
 *     createdAt: ISO8601 String,
 *     products: Array<String>
 *   }
 * ]
 *
 * @param {Array} wishlists
 */
function saveWishlists(wishlists) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlists));
}
