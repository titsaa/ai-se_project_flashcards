const baseUrl = "https://se-flashcards-api.en.tripleten-services.com/v1";

const headers = {
  "Content-Type": "application/json",
  Authorization: "019e6e22-74c5-742e-9ac3-c21d35433351",
};

/**
 * Parses a fetch response or rejects with an HTTP error message.
 *
 * @param {Response} response - The response returned from fetch.
 * @returns {Promise<object|object[]>} Parsed JSON from the response.
 */
function processResponse(response) {
  if (response.ok) {
    return response.json();
  }

  return Promise.reject(`Error: ${response.status}`);
}

/**
 * Fetches all decks for the authenticated user.
 *
 * @returns {Promise<object[]>} A promise that resolves to an array of decks.
 */
function getDecks() {
  return fetch(`${baseUrl}/decks`, { headers }).then(processResponse);
}

/**
 * Creates a deck in the remote database.
 *
 * @param {object} deck - The deck to create.
 * @param {string} deck.name - The deck name.
 * @param {string} deck.color - The deck color as a hex string.
 * @param {object[]} deck.cards - The deck's cards.
 * @returns {Promise<object>} A promise that resolves to the created deck.
 */
function addDeck(deck) {
  return fetch(`${baseUrl}/decks`, {
    method: "POST",
    headers,
    body: JSON.stringify(deck),
  }).then(processResponse);
}

/**
 * Deletes a deck from the remote database.
 *
 * @param {string} deckId - The database ID of the deck to delete.
 * @returns {Promise<object>} A promise that resolves to the delete response.
 */
function deleteDeck(deckId) {
  return fetch(`${baseUrl}/decks/${deckId}`, {
    method: "DELETE",
    headers,
  }).then(processResponse);
}

/**
 * Creates a card in a deck.
 *
 * @param {string} deckId - The database ID of the deck receiving the card.
 * @param {object} card - The card to create.
 * @param {string} card.question - The card question.
 * @param {string} card.answer - The card answer.
 * @returns {Promise<object>} A promise that resolves to the created card.
 */
function createCard(deckId, card) {
  return fetch(`${baseUrl}/cards/${deckId}`, {
    method: "POST",
    headers,
    body: JSON.stringify(card),
  }).then(processResponse);
}

/**
 * Deletes a card from the remote database.
 *
 * @param {string} cardId - The database ID of the card to delete.
 * @returns {Promise<object>} A promise that resolves to the delete response.
 */
function deleteCard(cardId) {
  return fetch(`${baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers,
  }).then(processResponse);
}

export { addDeck, createCard, deleteCard, deleteDeck, getDecks };
