import { getAllDecks } from "./api.js";

let decks = [];

/**
 * Load decks from API on app start
 * @returns {Promise<array>} Array of decks from the API
 */
async function loadDecks() {
  try {
    decks = await getAllDecks();
  } catch (error) {
    console.error("Failed to load decks:", error);
    decks = [];
  }
  return decks;
}

/**
 * Retrieves a deck object by its ID from the decks array.
 * Note: The API returns decks with _id property instead of id
 *
 * @param {string} deckId - The unique identifier of the deck to retrieve
 * @returns {object|undefined} The deck object if found, undefined otherwise
 */
function getDeckByID(deckId) {
  return decks.find((deck) => deck._id === deckId);
}

export { decks, getDeckByID, loadDecks };
