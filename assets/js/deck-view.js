import { hexToString } from "./colorMap.js";

const deckViewSection = document.querySelector("#deck-view");
const deckViewTitle = deckViewSection.querySelector(".gallery__title");
const deckViewCardsList = deckViewSection.querySelector(".gallery__list");
const flashcardTemplate = document.querySelector("#flashcard-template");

function createFlashcardEl(card, deckColor) {
  const flashcardEl = flashcardTemplate.content.cloneNode(true);
  const cardLi = flashcardEl.querySelector(".card");
  const cardTitle = flashcardEl.querySelector(".card__title");
  const flipBtn = flashcardEl.querySelector(".card__btn_type_flip");
  const deleteBtn = flashcardEl.querySelector(".card__btn_type_delete");

  let showingQuestion = true;
  cardTitle.textContent = card.question;

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
      cardLi.remove();
    });
  }

  return flashcardEl;
}

function renderDeckView(deck) {
  deckViewTitle.textContent = deck.name;
  deckViewCardsList.innerHTML = "";
  const deckColor = hexToString(deck.color);

  deck.cards.forEach((card) => {
    const flashcardEl = createFlashcardEl(card, deckColor);
    deckViewCardsList.appendChild(flashcardEl);
  });
}

export { renderDeckView };
