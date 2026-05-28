import { decks, getDeckByID, loadDecks } from "./gallery.js";
import { deleteDeck, createCard } from "./api.js";
import { hexToString } from "./colorMap.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";
import { disableSubmitBtn } from "./new-deck-view.js";
import { openModal } from "./modal.js";

let currentDeck = null;

document.addEventListener("DOMContentLoaded", async () => {
  // Load decks from API first
  await loadDecks();
  
  const deckTemplate = document.querySelector("#deck-template");
  const decksList = document.querySelector("#home .gallery__list");
  const homeSection = document.querySelector("#home");
  const newDeckViewSection = document.querySelector("#new-deck-view");
  const deckViewSection = document.querySelector("#deck-view");
  const notFoundSection = document.querySelector("#not-found");
  const carouselSection = document.querySelector("#carousel");
  const pageEl = document.querySelector(".page");
  const mainEl = document.querySelector(".page__main-content");
  const practiceBtn = deckViewSection.querySelector(".gallery__practice-btn");
  const newDeckBtn = document.querySelector("#home .gallery__new-card-btn");
  const newCardBtn = deckViewSection.querySelector(".gallery__new-card-btn_location_deck-view");

  function showView(currentSection, displayValue) {
    const sections = [
      homeSection,
      newDeckViewSection,
      deckViewSection,
      notFoundSection,
      carouselSection,
    ];
    sections.forEach((section) => {
      section.style.display = "none";
    });
    currentSection.style.display = displayValue;
  }

  function createDeckEl(item) {
    const deckEl = deckTemplate.content.cloneNode(true);
    const deckLi = deckEl.querySelector(".card");

    deckEl.querySelector(".card__title").textContent = item.name;

    // Set the card count
    const cardCount = item.cards.length;
    deckEl.querySelector(".card__count").textContent = `${cardCount} cards`;

    // Get the color name from hex and add the BEM modifier to the <li>
    const color = hexToString(item.color);
    if (color) {
      deckLi.classList.add(`card_color_${color}`);
    }

    // Set the deck link href
    const deckLink = deckEl.querySelector(".card__link");
    if (deckLink) {
      deckLink.href = `#deck/${item._id}`;
    }

    // Add delete button functionality
    const deleteBtn = deckEl.querySelector(".card__btn_type_delete");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        openModal(
          "Delete Deck",
          "Are you sure you want to delete this deck?",
          async () => {
            try {
              await deleteDeck(item._id);
              deckLi.remove();
              // Reload decks after deletion
              await loadDecks();
            } catch (error) {
              console.error("Failed to delete deck:", error);
              alert("Failed to delete deck. Please try again.");
            }
          },
        );
      });
    }

    return deckEl;
  }

  function renderDeckEl(item) {
    const deckEl = createDeckEl(item);
    decksList.prepend(deckEl);
  }

  practiceBtn.addEventListener("click", () => {
    if (currentDeck) {
      window.location.hash = `#carousel/${currentDeck._id}`;
    }
  });

  newDeckBtn.addEventListener("click", () => {
    window.location.hash = "#new-deck-view";
  });

  newCardBtn.addEventListener("click", async () => {
    if (!currentDeck) return;
    
    const question = prompt("Enter the question:");
    if (!question) return;
    
    const answer = prompt("Enter the answer:");
    if (!answer) return;
    
    try {
      await createCard(currentDeck._id, { question, answer });
      // Reload the current deck
      await loadDecks();
      const updatedDeck = getDeckByID(currentDeck._id);
      if (updatedDeck) {
        currentDeck = updatedDeck;
        renderDeckView(updatedDeck);
      }
    } catch (error) {
      console.error("Failed to create card:", error);
      alert("Failed to create card. Please try again.");
    }
  });

  // Router function
  function router() {
    const hash = window.location.hash.slice(1);

    if (hash === "home" || hash === "") {
      showView(homeSection, "block");
      mainEl.classList.remove("page__main-content_location_carousel");
      pageEl.classList.remove("page_no-mobile-bar");
      currentDeck = null;
    } else if (hash === "new-deck-view") {
      showView(newDeckViewSection, "block");
      mainEl.classList.remove("page__main-content_location_carousel");
      pageEl.classList.add("page_no-mobile-bar");
      currentDeck = null;
      disableSubmitBtn();
    } else if (hash.startsWith("deck/")) {
      const deckID = hash.split("/")[1];
      const deck = getDeckByID(deckID);

      if (deck) {
        showView(deckViewSection, "block");
        mainEl.classList.remove("page__main-content_location_carousel");
        pageEl.classList.remove("page_no-mobile-bar");
        currentDeck = deck;
        renderDeckView(deck);
      } else {
        showView(notFoundSection, "block");
        mainEl.classList.remove("page__main-content_location_carousel");
        pageEl.classList.add("page_no-mobile-bar");
        currentDeck = null;
      }
    } else if (hash.startsWith("carousel/")) {
      const deckID = hash.split("/")[1];
      const deck = getDeckByID(deckID);

      if (deck) {
        showView(carouselSection, "flex");
        mainEl.classList.add("page__main-content_location_carousel");
        pageEl.classList.add("page_no-mobile-bar");
        currentDeck = deck;
        renderCarouselView(deck);
      } else {
        showView(notFoundSection, "block");
        mainEl.classList.remove("page__main-content_location_carousel");
        pageEl.classList.add("page_no-mobile-bar");
        currentDeck = null;
      }
    } else {
      showView(notFoundSection, "block");
      mainEl.classList.remove("page__main-content_location_carousel");
      pageEl.classList.add("page_no-mobile-bar");
      currentDeck = null;
    }
  }

  // Render initial decks
  decks.forEach(renderDeckEl);

  // Set up router
  window.addEventListener("hashchange", router);
  router();
});
