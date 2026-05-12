const modal = document.querySelector(".modal");
const modalTitle = modal.querySelector(".modal__title");
const modalText = modal.querySelector(".modal__text");
const confirmBtn = modal.querySelector(".modal__confirm-btn");
const cancelBtn = modal.querySelector(".modal__cancel-btn");

let currentConfirmCallback = null;

function openModal(title, text, confirmCallback) {
  modalTitle.textContent = title;
  modalText.textContent = text;
  currentConfirmCallback = confirmCallback;
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
  currentConfirmCallback = null;
}

confirmBtn.addEventListener("click", () => {
  if (currentConfirmCallback) {
    currentConfirmCallback();
  }
  closeModal();
});

cancelBtn.addEventListener("click", closeModal);

export { openModal, closeModal };