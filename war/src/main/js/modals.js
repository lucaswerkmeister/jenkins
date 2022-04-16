import {createElementFromHtml} from "./util/dom";

export function showModal(contents, options = {}) {
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

export function showConfirmationModal(title, description = undefined) {
  const html = `
    <p>${title}</p>
    <p>${description}</p>
    <div>
        <button class="jenkins-button jenkins-button--primary">Yes</button>
        <button class="jenkins-button">No</button>
    </div>
  `;
  showModal(html)
}

// export default { showModal, showConfirmationModal }
