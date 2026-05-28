const API_BASE_URL = "https://se-flashcards-api.en.tripleten-services.com/v1";
const TOKEN = "019e6e03-9ffb-7592-b5ee-0cc0cef20e41";

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      "Authorization": TOKEN,
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function getAllDecks() {
  return apiRequest("/decks");
}

async function createDeck(deck) {
  return apiRequest("/decks", {
    method: "POST",
    body: JSON.stringify(deck),
  });
}

async function deleteDeck(deckId) {
  return apiRequest(`/decks/${deckId}`, {
    method: "DELETE",
  });
}

async function createCard(deckId, card) {
  return apiRequest("/cards", {
    method: "POST",
    body: JSON.stringify({
      deckId,
      ...card,
    }),
  });
}

export { getAllDecks, createDeck, deleteDeck, createCard };
