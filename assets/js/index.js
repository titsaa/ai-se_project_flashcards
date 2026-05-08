import { decks, getDeckByID } from "./decks.js";
import { stringToHex, hexToString, removeColorClasses } from "./colorMap.js";
import { renderCarouselView } from "./carousel.js";


document.addEventListener("DOMContentLoaded", () => {
  const deckTemplate = document.querySelector("#deck-template");
  const decksList = document.querySelector(".decks__list");
  const homeSection = document.querySelector("#home");
  const notFoundSection = document.querySelector("#not-found");
  const carouselSection = document.querySelector("#carousel");
  const mainEl = document.querySelector(".page__main-content");

  function createDeckEl(item) {
    const deckEl = deckTemplate.content.cloneNode(true);
    const deckLi = deckEl.querySelector(".deck");
    
    deckEl.querySelector(".deck__title").textContent = item.name;
    
    // Set the card count
    const cardCount = item.cards.length;
    deckEl.querySelector(".deck__count").textContent = `${cardCount} cards`;
    
    // Get the color name from hex and add the BEM modifier to the <li>
    const color = hexToString(item.color);
    if (color) {
      deckLi.classList.add(`deck_color_${color}`);
    }
    
    // Set the deck link href
    const deckLink = deckEl.querySelector(".deck__link");
    if (deckLink) {
      deckLink.href = `#carousel/${item.id}`;
    }
    
    // Add delete button functionality
    const deleteBtn = deckEl.querySelector(".deck__delete-btn");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent triggering the deck link
        deckLi.remove(); // Remove the deck element from the DOM
      });
    }
    
    return deckEl;
  }

  function renderDeckEl(item) {
    const deckEl = createDeckEl(item);
    decksList.prepend(deckEl);
  }

  // Router function
  function router() {
    const hash = window.location.hash.slice(1); // Remove the # symbol
    
    if (hash === "home" || hash === "") {
      homeSection.style.display = "block";
      notFoundSection.style.display = "none";
      carouselSection.style.display = "none";
    } else if (hash.startsWith("carousel/")) {
      const deckID = hash.split("/")[1];
      const deck = getDeckByID(deckID);
      
      if (deck) {
        homeSection.style.display = "none";
        notFoundSection.style.display = "none";
        carouselSection.style.display = "flex";
        mainEl.classList.add("page__main-content_location_carousel");
        renderCarouselView(deck);
      } else {
        homeSection.style.display = "none";
        notFoundSection.style.display = "block";
        carouselSection.style.display = "none";
        mainEl.classList.remove("page__main-content_location_carousel");
      }
    } else {
      homeSection.style.display = "none";
      notFoundSection.style.display = "block";
      carouselSection.style.display = "none";
      mainEl.classList.remove("page__main-content_location_carousel");
    }
  }

  // Render initial decks
  decks.forEach(renderDeckEl);
  
  // Set up router
  window.addEventListener("hashchange", router);
  router();
});