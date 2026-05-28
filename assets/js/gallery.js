const fetchedDecks = [];

/**
 * Retrieves a deck object by its ID from the fetched decks cache.
 * Note: The API returns decks with _id property instead of id.
 *
 * @param {string} deckId - The unique identifier of the deck to retrieve
 * @returns {object|undefined} The deck object if found, undefined otherwise
 */
function getDeckByID(deckId) {
  return fetchedDecks.find((deck) => deck._id === deckId);
}

/**
 * Removes the deck matching the given ID from the local cache.
 *
 * @param {string} deckId - The unique identifier of the deck to remove.
 * @returns {void}
 */
function removeDeckByID(deckId) {
  const index = fetchedDecks.findIndex((deck) => deck._id === deckId);

  if (index !== -1) {
    fetchedDecks.splice(index, 1);
  }
}

export { fetchedDecks, getDeckByID, removeDeckByID };
