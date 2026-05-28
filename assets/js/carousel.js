import { hexToString, removeColorClasses } from "./colorMap.js";

/**
 * Renders the carousel view for a given deck.
 *
 * @param {object} deck - The deck object to render.
 * @returns {void}
 */
function renderCarouselView(deck) {
  const carouselSection = document.querySelector("#carousel");
  const carouselTitle = carouselSection.querySelector(".carousel__title");
  const carouselCard = carouselSection.querySelector(".carousel__card");
  const carouselCardText = carouselSection.querySelector(
    ".carousel__card-text",
  );
  const leftBtn = carouselSection.querySelector(".carousel__btn_type_left");
  const rightBtn = carouselSection.querySelector(".carousel__btn_type_right");
  const flipBtn = carouselSection.querySelector(".carousel__btn_type_flip");

  let currentIndex = 0;
  let showingQuestion = true;

  /**
   * Builds the carousel title for the current card position.
   *
   * @param {object} deck - The deck currently being practiced.
   * @param {number} currentIndex - The current card index.
   * @returns {string} The carousel title text.
   */
  function getCarouselTitleString(deck, currentIndex) {
    return `${deck.name} · ${currentIndex + 1}/${deck.cards.length}`;
  }

  /**
   * Updates carousel text, color, and navigation button states.
   *
   * @returns {void}
   */
  function updateDisplay() {
    const currentCard = deck.cards[currentIndex];

    if (!currentCard) {
      carouselTitle.textContent = `${deck.name} · 0/0`;
      carouselCardText.textContent = "No cards in this deck yet.";
      leftBtn.classList.add("carousel__btn_disabled");
      rightBtn.classList.add("carousel__btn_disabled");
      return;
    }

    // Update title
    carouselTitle.textContent = getCarouselTitleString(deck, currentIndex);

    // Update card text
    if (showingQuestion) {
      carouselCardText.textContent = currentCard.question;
      carouselCard.classList.remove("carousel__card_color_white");
    } else {
      carouselCardText.textContent = currentCard.answer;
      carouselCard.classList.add("carousel__card_color_white");
    }

    // Update button states
    if (currentIndex === 0) {
      leftBtn.classList.add("carousel__btn_disabled");
    } else {
      leftBtn.classList.remove("carousel__btn_disabled");
    }

    if (currentIndex === deck.cards.length - 1) {
      rightBtn.classList.add("carousel__btn_disabled");
    } else {
      rightBtn.classList.remove("carousel__btn_disabled");
    }
  }

  // Set up card color
  removeColorClasses(carouselCard);
  const color = hexToString(deck.color);
  if (color) {
    carouselCard.classList.add(`carousel__card_color_${color}`);
  }

  // Button event listeners
  leftBtn.onclick = () => {
    if (currentIndex > 0) {
      currentIndex--;
      showingQuestion = true;
      updateDisplay();
    }
  };

  rightBtn.onclick = () => {
    if (currentIndex < deck.cards.length - 1) {
      currentIndex++;
      showingQuestion = true;
      updateDisplay();
    }
  };

  flipBtn.onclick = () => {
    showingQuestion = !showingQuestion;
    updateDisplay();
  };

  // Display the first card
  updateDisplay();
}

export { renderCarouselView };
