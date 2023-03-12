import { createElementFromHtml } from "@/util/dom";
import { CLOSE } from "@/util/symbols";

const defaults = {
  background: "var(--modal-background)",
  padding: "1.5rem",
  minWidth: undefined,
  maxWidth: undefined,
  hideCloseButton: false,
};

export function showModal(contents, options = {}) {
  options = { ...defaults, ...options };
  const modal = document.createElement("dialog");
  modal.classList.add("jenkins-modal");
  modal.style.background = options.background;
  modal.style.padding = options.padding;
  modal.style.minWidth = options.minWidth;
  modal.style.maxWidth = options.maxWidth;
  modal.appendChild(contents);

  if (options.hideCloseButton !== true) {
    modal.appendChild(
      createElementFromHtml(`
    <form method="dialog">
      <button class="jenkins-modal__close-button jenkins-button" tooltip="Close" data-tooltip-append-to="parent">
        ${CLOSE}
      </button>
    </form>`)
    );
  }

  document.querySelector("body").appendChild(modal);

  modal.showModal();

  Behaviour.applySubtree(modal, true);
}
