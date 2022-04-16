import {createElementFromHtml} from "./util/dom";

const defaults = {
  background: "var(--modal-background)",
  padding: "1.5rem",
  minWidth: undefined,
  maxWidth: undefined,
  hideCloseButton: false
};

export function showModal(contents, options = {}) {
  options = { ...defaults, ...options };
  const modal = document.createElement("dialog");
  modal.classList.add("jenkins-modal");
  modal.style.background = options.background;
  modal.style.padding = options.padding;
  modal.style.minWidth = options.minWidth;
  modal.style.maxWidth = options.maxWidth;
  modal.innerHTML = contents;

  if (options.hideCloseButton !== true) {
    modal.appendChild(createElementFromHtml(`
    <form method="dialog">
      <button class="jenkins-modal__close-button"><span class="jenkins-visually-hidden">Close</span></button>
    </form>`))
  }

  document.querySelector("body").appendChild(modal);
  window.disableShortcuts = true;
  modal.addEventListener('close', () => {
    window.disableShortcuts = false;
  });

  modal.showModal();
}

const confirmationDefaults = {
  background: "transparent",
  padding: "0",
  minWidth: "500px",
  maxWidth: "525px",
  hideCloseButton: true
};

export function showConfirmationModal(options = {}) {
  options = { ...confirmationDefaults, ...options };

  const html = `
    <form method="dialog">
        <div class="longhorn-container">
            <p class="jenkins-modal__title">${options.title}</p>
            <p class="jenkins-modal__label">${options.description}</p>
        </div>
        <div class="jenkins-buttons-row jenkins-buttons-row--invert jenkins-buttons-row--equal-buttons longhorn-container-2">
            <button class="jenkins-button jenkins-button--primary jenkins-button--destructive">Yes</button>
            <button class="jenkins-button">Cancel</button>
        </div>
    </form>
  `

  showModal(html, options)
}

window.showConfirmationModal = showConfirmationModal
