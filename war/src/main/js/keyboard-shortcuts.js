import hotkeys from "hotkeys-js"
import {showModal} from "./modals";

const ADD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 112v288M400 256H112"/></svg>`

window.disableShortcuts = false;

window.addEventListener("load", () => {
  hotkeys("*", ({key}) => {
    if (key === "Meta") {
      key = "⌘";
    }

    [...document.querySelectorAll(".jenkins-keyboard-shortcut__item")]
      .filter(shortcut => shortcut.textContent.toLowerCase() === key.toLowerCase())
      .forEach(shortcut => {
        shortcut.classList.add("jenkins-keyboard-shortcut__item--chosen")

        setTimeout(function() {
          shortcut.classList.remove("jenkins-keyboard-shortcut__item--chosen");
        }, 500);
      })
  })

  document.querySelectorAll("[data-keyboard-shortcut]").forEach(function(element) {
    hotkeys(translateKeyboardShortcutForOS(element.dataset.keyboardShortcut), () => {
      if (!window.disableShortcuts) {
        // Small delay to show animation
        setTimeout(function() {
          switch (element.tagName) {
            case "INPUT":
              element.focus()
              break;
            default:
              element.click()
              break;
          }
        }, 50);
      }

      // Returning false stops the event and prevents default browser events
      return false
    })
  })

  document.querySelector("#button-show-keyboard-shortcuts-modal").addEventListener("click", function() {
    const shortcuts = [...document.querySelectorAll("[data-keyboard-shortcut]")]
      .map(e => new Map([
        ['label', e.dataset.keyboardShortcutTitle || e.textContent],
        ['shortcut', translateKeyboardShortcutForOS(e.dataset.keyboardShortcut)]
      ])
    );

    const html = `
      <p class="jenkins-modal__title">Keyboard shortcuts</p>
      <p class="jenkins-modal__label">Shortcuts are disabled when this modal is open, feel free to try any of the combinations.</p>
      ${shortcuts.map(e => `<div class="jenkins-keyboard-shortcut__list"><p>${e.get("label")}</p>${generateKeyboardShortcutUI(e.get("shortcut"))}</div>`).join("")}
    `;

    const options = {
      maxWidth: "450px"
    }
    showModal(html, options);
  });
})

/**
 * Translates a given keyboard shortcut, e.g. CMD+K, into an OS friendly version, e.g. CTRL+K
 * @param {string} keyboardShortcut The shortcut for translation
 */
function translateKeyboardShortcutForOS(keyboardShortcut) {
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0
  return keyboardShortcut.replace("CMD", isMac ? "CMD" : "CTRL")
}

/**
 * Translates a given keyboard shortcut, e.g. CMD+K, into a UI friendly version, e.g. ⌘+K
 * @param {string} keyboardShortcut The shortcut for translation
 */
function translateKeyboardShortcutForUI(keyboardShortcut) {
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0
  return keyboardShortcut.replace("CMD", isMac ? "⌘" : "CTRL")
}

/**
 * Generates a UI representation of the given keyboard shortcut
 * @param {string} keyboardShortcut The shortcut for generation
 */
export function generateKeyboardShortcutUI(keyboardShortcut) {
  return "<div class='jenkins-keyboard-shortcut'>" + translateKeyboardShortcutForUI(keyboardShortcut)
    .split("+")
    .map(shortcut => `<span class="jenkins-keyboard-shortcut__item">${shortcut}</span>`)
    .join(ADD_SVG) + "</div>"
}

export default { generateKeyboardShortcutUI }
