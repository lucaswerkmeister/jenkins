import { createElementFromHtml } from "@/util/dom";
import { CLOSE } from "@/util/symbols";

const defaults = {
  maxWidth: undefined,
  hideCloseButton: false,
};

function showModal(contents, options = {}) {
  options = Object.assign({}, defaults, options);
  const modal = createElementFromHtml(
    `<dialog class='jenkins-modal'>
      <div class='jenkins-modal__contents'></div>
    </dialog>`
  );
  modal.style.maxWidth = options.maxWidth;

  if (options.hideCloseButton !== true) {
    modal.appendChild(createElementFromHtml(`
        <button class="jenkins-modal__close-button jenkins-button close-modal">
          <span class="jenkins-visually-hidden">Close</span>
          ${CLOSE}
        </button>
      `));
  }

  modal.querySelector("div").appendChild(contents);

  document.querySelector("body").appendChild(modal);

  modal.querySelectorAll(".close-modal").forEach((closeButton) => {
    closeButton.addEventListener("click", () => closeModal());
    closeButton?.blur();
  })

  modal.addEventListener("cancel", (e) => {
    e.preventDefault();

    closeModal();
  });

  modal.addEventListener("click", function (e) {
    if (e.target !== e.currentTarget) {
      return;
    }

    closeModal();
  });

  function closeModal() {
    modal.classList.add("jenkins-modal--hidden");

    modal.addEventListener("webkitAnimationEnd", () => {
      modal.remove();
    });
  }

  modal.showModal();
}

const confirmationDefaults = {
  maxWidth: "475px",
  hideCloseButton: true,
  submitText: "Yes",
  cancelText: "Cancel",
  type: "default",
};

const typeClassMap = {
  default: "",
  destructive: "jenkins-!-destructive-color",
};

export function showConfirmationModal(options) {
  options = { ...confirmationDefaults, ...options };

  const html = createElementFromHtml(`
    <form method="${options.post === "true" ? "POST" : "GET"}" action="${
    options.action
  }">
            <p class="jenkins-modal__title">${options.title}</p>
            ${
              options.description
                ? `<p class="jenkins-modal__description">${options.description}</p>`
                : ``
            }
        <div class="jenkins-modal__controls">
            <button type="button" class="jenkins-button close-modal">
                ${options.cancelText}
            </button>
            <button type="submit" class="jenkins-button jenkins-button--primary ${
              typeClassMap[options.type]
            }">
                ${options.submitText}
            </button>
        </div>
    </form>
  `);

  crumb.appendToForm(html);

  showModal(html, options);
}

function init() {
  window.showConfirmationModal = showConfirmationModal;
}

export default { init, showModal };
