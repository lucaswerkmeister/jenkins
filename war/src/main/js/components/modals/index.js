import {createElementFromHtml} from "@/util/dom";

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
  modal.appendChild(contents);

  crumb.appendToForm(modal.children[0]);

  if (options.hideCloseButton !== true) {
    modal.appendChild(createElementFromHtml(`
    <form method="dialog">
      <button class="jenkins-modal__close-button"><span class="jenkins-visually-hidden">Close</span></button>
    </form>`))
  }

  document.querySelector("body").appendChild(modal);

  modal.showModal();
}

const confirmationDefaults = {
  background: "transparent",
  padding: "0",
  minWidth: "425px",
  maxWidth: "425px",
  hideCloseButton: true,
  submitText: 'Yes',
  cancelText: 'Cancel',
  type: 'default'
};

const typeClassMap = {
  default: '',
  destructive: 'jenkins-!-destructive-color',
}

export function showConfirmationModal(options) {
  options = { ...confirmationDefaults, ...options };

  const html = createElementFromHtml(`
    <form method="${options.post === 'true' ? 'POST' : 'GET'}" action="${options.action}">
        <div class="longhorn-container">
            <p class="jenkins-modal__title">${options.title}</p>
            ${options.description ? `<p class="jenkins-modal__label">${options.description}</p>` : ``}
        </div>
        <div class="longhorn-container-2">
            <button type="button" class="jenkins-button">
                ${options.cancelText}
            </button>
            <button type="submit" class="jenkins-button jenkins-button--primary ${typeClassMap[options.type]}">
                ${options.submitText}
            </button>
        </div>
    </form>
  `);

  showModal(html, options)

  html.querySelector(".jenkins-button").addEventListener("click", (event) => {
    const dialog = event.target.closest('dialog');

    dialog.classList.add('jenkins-modal--hidden');
    dialog.addEventListener('animationend', function() {
      dialog.classList.remove('hide');
      dialog.close();
    }, false);
  })
}

function init() {
  window.showConfirmationModal = showConfirmationModal;
}

export default { init };
