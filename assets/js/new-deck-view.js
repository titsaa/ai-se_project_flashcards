import { addDeck } from "./api.js";
import { fetchedDecks } from "./gallery.js";
import { showError } from "./modal.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

const formEl = document.querySelector("#new-deck-form");
const submitBtn = formEl.querySelector(".new-deck-view__submit-btn");
const textareaEl = formEl.querySelector(".new-deck-view__textarea");
let renderDeckCallback = null;

/**
 * Validates that a deck name is a string with a supported length.
 *
 * @param {*} name - The value to validate.
 * @returns {string|null} The valid name, or null if invalid.
 */
function validateName(name) {
  if (typeof name !== "string" || name.length < 2 || name.length > 80) {
    return null;
  }

  return name;
}

/**
 * Safely parses a JSON string.
 *
 * @param {string} jsonString - The JSON string to parse.
 * @returns {object|null} Parsed JSON data, or null if invalid.
 */
function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

/**
 * Returns a consistent lowercase hex color string with a leading "#".
 * Accepts values with or without a leading "#". Returns "#64d583" as a
 * fallback if the value is missing or not a valid 6-digit hex.
 *
 * @param {string|undefined} color
 * @returns {string}
 */
function normalizeColor(color) {
  if (!color) return "#64d583";
  const hex = color.startsWith("#") ? color.slice(1) : color;
  if (!HEX_DIGITS.test(hex)) return "#64d583";
  return "#" + hex.toLowerCase();
}

/**
 * Updates the submit button state from the textarea value.
 *
 * @returns {void}
 */
function updateSubmitBtn() {
  submitBtn.disabled = textareaEl.value.trim().length === 0;
}

/**
 * Refreshes the new deck submit button disabled state.
 *
 * @returns {void}
 */
function disableSubmitBtn() {
  updateSubmitBtn();
}

/**
 * Stores the deck renderer used after a deck is created.
 *
 * @param {Function} renderDeckEl - The function that renders a deck card.
 * @returns {void}
 */
function setupNewDeckForm(renderDeckEl) {
  renderDeckCallback = renderDeckEl;
}

textareaEl.addEventListener("input", updateSubmitBtn);

formEl.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const values = Object.fromEntries(formData);
  const jsonData = parseJSON(textareaEl.value);
  const color = normalizeColor(values.color);

  if (!jsonData) {
    showError("Please enter valid JSON and try again.");
    return;
  }

  const name = validateName(jsonData.name);

  if (!name) {
    showError("Deck name must be a string between 2 and 80 characters.");
    return;
  }

  if (!Array.isArray(jsonData.cards)) {
    showError("Deck cards must be provided as an array.");
    return;
  }

  if (
    typeof jsonData.color === "string" &&
    jsonData.color.toLowerCase() !== color
  ) {
    showError("The JSON color must match the color selected in the picker.");
    return;
  }

  const deck = {
    name,
    color,
    cards: jsonData.cards,
  };

  submitBtn.disabled = true;

  addDeck(deck)
    .then((newDeck) => {
      fetchedDecks.push(newDeck);
      if (renderDeckCallback) {
        renderDeckCallback(newDeck);
      }
      formEl.reset();
      updateSubmitBtn();
      window.location.hash = `#deck/${newDeck._id}`;
    })
    .catch(() => {
      showError(
        "Could not create the deck. Please check the JSON and try again.",
      );
      updateSubmitBtn();
    });
});

export { disableSubmitBtn, setupNewDeckForm };
