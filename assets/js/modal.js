const modal = document.querySelector(".modal");
const modalTitle = modal.querySelector(".modal__title");
const modalText = modal.querySelector(".modal__text");
const confirmBtn = modal.querySelector(".modal__confirm-btn");
const cancelBtn = modal.querySelector(".modal__cancel-btn");

let currentConfirmCallback = null;

/**
 * Opens the confirmation modal with a title, message, and confirm callback.
 *
 * @param {string} title - The modal title text.
 * @param {string} text - The modal message text.
 * @param {Function} confirmCallback - The function to run when confirmed.
 * @returns {void}
 */
function openModal(title, text, confirmCallback) {
  modalTitle.textContent = title;
  modalText.textContent = text;
  currentConfirmCallback = confirmCallback;
  cancelBtn.style.display = "";
  confirmBtn.textContent = "Confirm";
  modal.style.display = "flex";
}

/**
 * Opens the modal as an error message with a dismiss button.
 *
 * @param {string} message - The error message to display.
 * @returns {void}
 */
function showError(message) {
  modalTitle.textContent = "Something went wrong";
  modalText.textContent = message;
  currentConfirmCallback = null;
  cancelBtn.style.display = "none";
  confirmBtn.textContent = "Dismiss";
  modal.style.display = "flex";
}

/**
 * Closes the active modal.
 *
 * @returns {void}
 */
function closeModal() {
  modal.style.display = "none";
  currentConfirmCallback = null;
  cancelBtn.style.display = "";
  confirmBtn.textContent = "Confirm";
}

confirmBtn.addEventListener("click", () => {
  if (currentConfirmCallback) {
    currentConfirmCallback();
  }
  closeModal();
});

cancelBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal__overlay")) {
    closeModal();
  }
});

export { closeModal, openModal, showError };
