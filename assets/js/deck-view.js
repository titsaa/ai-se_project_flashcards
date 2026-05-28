import { deleteCard } from "./api.js";
import { hexToString } from "./colorMap.js";
import { openModal, showError } from "./modal.js";

const deckViewSection = document.querySelector("#deck-view");
const deckViewTitle = deckViewSection.querySelector(".gallery__title");
const deckViewCardsList = deckViewSection.querySelector(".gallery__list");
const flashcardTemplate = document.querySelector("#flashcard-template");

/**
 * Creates a flashcard element for the open deck view.
 *
 * @param {object} card - The card data to render.
 * @param {string|null} deckColor - The deck color name.
 * @param {object} deck - The deck that owns the card.
 * @returns {DocumentFragment} A populated flashcard template.
 */
function createFlashcardEl(card, deckColor, deck) {
  const flashcardEl = flashcardTemplate.content.cloneNode(true);
  const cardLi = flashcardEl.querySelector(".card");
  const cardTitle = flashcardEl.querySelector(".card__title");
  const flipBtn = flashcardEl.querySelector(".card__btn_type_flip");
  const deleteBtn = flashcardEl.querySelector(".card__btn_type_delete");

  let showingQuestion = true;
  cardTitle.textContent = card.question;

  /**
   * Updates the card background color based on flip state.
   *
   * @returns {void}
   */
  function updateCardBackground() {
    cardLi.classList.remove(`card_color_${deckColor}`, "card_color_white");
    if (showingQuestion && deckColor) {
      cardLi.classList.add(`card_color_${deckColor}`);
    } else {
      cardLi.classList.add("card_color_white");
    }
  }

  updateCardBackground();

  if (flipBtn) {
    flipBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      showingQuestion = !showingQuestion;
      cardTitle.textContent = showingQuestion ? card.question : card.answer;
      updateCardBackground();
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      openModal(
        "Delete Card",
        "Are you sure you want to delete this card?",
        async () => {
          try {
            await deleteCard(card._id);
            const cardIndex = deck.cards.findIndex((item) => item._id === card._id);
            if (cardIndex !== -1) {
              deck.cards.splice(cardIndex, 1);
            }
            cardLi.remove();
          } catch (error) {
            showError("Could not delete the card. Please try again.");
          }
        },
      );
    });
  }

  return flashcardEl;
}

/**
 * Renders the deck view for a selected deck.
 *
 * @param {object} deck - The deck to render.
 * @returns {void}
 */
function renderDeckView(deck) {
  deckViewTitle.textContent = deck.name;
  deckViewCardsList.innerHTML = "";
  const deckColor = hexToString(deck.color);

  deck.cards.forEach((card) => {
    const flashcardEl = createFlashcardEl(card, deckColor, deck);
    deckViewCardsList.appendChild(flashcardEl);
  });
}

export { renderDeckView };
