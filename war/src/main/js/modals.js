import {createElementFromHtml} from "./util/dom";

const defaults = {
  maxWidth: undefined,
  hideCloseButton: false
};

export function showModal(contents, options = {}) {
  options = { ...defaults, ...options };
  const modal = document.createElement("dialog");
  modal.classList.add("jenkins-modal");
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
