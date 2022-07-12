import hotkeys from "hotkeys-js"

const registeredShortcuts = {}

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
    const shortcut = translateKeyboardShortcutForOS(element.dataset.keyboardShortcut)

    if (registeredShortcuts[shortcut]) {
      console.warn(`Shortcut '${shortcut}' is already registered by`, element)
      return
    }

    registeredShortcuts[shortcut] = element

    hotkeys(shortcut, () => {
      // Small delay to show animation
      setTimeout(function() {
        switch (element.tagName) {
          case "A":
          case "BUTTON":
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
