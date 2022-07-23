import hotkeys from "hotkeys-js"

window.addEventListener("load", () => {
  // Register search bar shortcut
  const searchBar = document.querySelector("#search-box")
  searchBar.placeholder = searchBar.placeholder + ` (${translateModifierKeysForUsersPlatform("CMD+K")
    .replace("CMD", "⌘")})`
  registerShortcut("CMD+K", searchBar)

  // Register last breadcrumb bar link shortcut
  const breadcrumbLinks = document.querySelectorAll(".jenkins-breadcrumbs__list-item a")
  if (breadcrumbLinks.length > 0) {
    const lastClickableBreadcrumb = breadcrumbLinks[breadcrumbLinks.length - 1]
    registerShortcut("U", lastClickableBreadcrumb)
  }
})

function registerShortcut(keyboardShortcut, element) {
  hotkeys(translateModifierKeysForUsersPlatform(keyboardShortcut), () => {
    setTimeout(function () {
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
    })
  })
}

/**
 * Given a keyboard shortcut, e.g. CMD+K, replace any included modifier keys for the user's
 * platform e.g. output will be CMD+K for macOS/iOS, CTRL+K for Windows/Linux
 * @param {string} keyboardShortcut The shortcut to translate
 */
function translateModifierKeysForUsersPlatform(keyboardShortcut) {
  const useCmdKey = navigator.platform.toUpperCase().indexOf("MAC") >= 0 ||
    navigator.platform.toUpperCase() === "IPHONE" ||
    navigator.platform.toUpperCase() === "IPAD"
  return keyboardShortcut.replace(/CMD|CTRL/ig, useCmdKey ? "CMD" : "CTRL")
}
