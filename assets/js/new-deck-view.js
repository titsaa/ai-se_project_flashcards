import { createDeck } from "./api.js";
import { loadDecks } from "./gallery.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

const formEl = document.querySelector("#new-deck-form");
const submitBtn = formEl.querySelector(".new-deck-view__submit-btn");
const textareaEl = formEl.querySelector(".new-deck-view__textarea");

/**
 * Converts a string to a URL-safe slug: lowercase with any run of
 * non-alphanumeric characters replaced by a single hyphen, and no leading or
 * trailing hyphens.
 *
 * @param {string} str
 * @returns {string}
 */
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

function disableSubmitBtn() {
  submitBtn.disabled = false;
  submitBtn.removeAttribute("disabled");
}

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const values = Object.fromEntries(formData);
  const jsonData = JSON.parse(textareaEl.value);
  
  const deck = {
    name: jsonData.name,
    color: normalizeColor(values.color),
    cards: jsonData.cards,
  };

  try {
    submitBtn.disabled = true;
    const createdDeck = await createDeck(deck);
    await loadDecks();
    window.location.hash = `#deck/${createdDeck._id}`;
  } catch (error) {
    console.error("Failed to create deck:", error);
    alert("Failed to create deck. Please try again.");
    submitBtn.disabled = false;
  }
});

export { disableSubmitBtn };
