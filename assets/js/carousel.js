import { hexToString, removeColorClasses } from "./colorMap.js";

/**
 * Renders the carousel view for a given deck
 * @param {object} deck - The deck object to render
 */
function renderCarouselView(deck) {
  const carouselSection = document.querySelector("#carousel");
  const carouselTitle = carouselSection.querySelector(".carousel__title");
  const carouselCard = carouselSection.querySelector(".carousel__card");
  const carouselCardText = carouselSection.querySelector(".carousel__card-text");
  const leftBtn = carouselSection.querySelector(".carousel__btn_type_left");
  const rightBtn = carouselSection.querySelector(".carousel__btn_type_right");
  const flipBtn = carouselSection.querySelector(".carousel__btn_type_flip");

  let currentIndex = 0;
  let showingQuestion = true;

  function getCarouselTitleString(deck, currentIndex) {
    return `${deck.name} · ${currentIndex + 1}/${deck.cards.length}`;
  }

  function updateDisplay() {
    const currentCard = deck.cards[currentIndex];
    
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
  const color = hexToString(deck.color);
  if (color) {
    carouselCard.classList.add(`carousel__card_color_${color}`);
  }

  // Button event listeners
  leftBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      showingQuestion = true;
      updateDisplay();
    }
  });

  rightBtn.addEventListener("click", () => {
    if (currentIndex < deck.cards.length - 1) {
      currentIndex++;
      showingQuestion = true;
      updateDisplay();
    }
  });

  flipBtn.addEventListener("click", () => {
    showingQuestion = !showingQuestion;
    updateDisplay();
  });

  // Display the first card
  updateDisplay();
}

export { renderCarouselView };
