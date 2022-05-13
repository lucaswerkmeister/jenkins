import hotkeys from "hotkeys-js"

const ADD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 112v288M400 256H112"/></svg>`

window.addEventListener("load", () => {
  hotkeys("*", ({key}) => {
    if (key === "Meta") {
      key = "CMD";
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
      // Small delay to show animation
      setTimeout(function() {
        switch (element.tagName) {
          case "A":
            element.click()
            break;
          case "INPUT":
            element.focus()
            break;
        }

        // Returning false stops the event and prevents default browser events
        return false
      }, 50);
    })
  })
})

/**
 * Translates a given keyboard shortcut, e.g. CMD+K, into an OS neutral version, e.g. CTRL+K
 * @param {string} keyboardShortcut The shortcut for translation
 */
function translateKeyboardShortcutForOS(keyboardShortcut) {
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0
  return keyboardShortcut.replace("CMD", isMac ? "CMD" : "CTRL")
}
