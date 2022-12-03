import hotkeys from "hotkeys-js";

const init = () => {
  const searchBar = document.querySelector("#search-box");
  if (searchBar) {
    searchBar.placeholder =
      searchBar.placeholder +
      ` (${translateModifierKeysForUsersPlatform("CMD+K").replace(
        "CMD",
        "⌘"
      )})`;

    hotkeys(translateModifierKeysForUsersPlatform("CMD+K"), () => {
      searchBar.focus();

      // Returning false stops the event and prevents default browser events
      return false;
    });
  }

  const pageSearchBar = document.querySelectorAll(".jenkins-search__input");
  if (pageSearchBar.length === 1) {
    hotkeys("/", () => {
      pageSearchBar[0].focus();

      // Returning false stops the event and prevents default browser events
      return false;
    });
  }

  const breadcrumbs = document.querySelectorAll(
    ".jenkins-breadcrumbs__list-item .model-link"
  );
  if (breadcrumbs.length !== 0) {
    const breadcrumb = breadcrumbs[breadcrumbs.length - 1];
    breadcrumb.dataset.htmlTooltip = `Press <span class="jenkins-tooltip__keyboard-shortcut">U</span> to jump up to ${breadcrumb.textContent}`;
    breadcrumb.dataset.tooltipDelay = "500";

    hotkeys("u", () => {
      breadcrumb.click();

      // Returning false stops the event and prevents default browser events
      return false;
    });
  }
};

/**
 * Given a keyboard shortcut, e.g. CMD+K, replace any included modifier keys for the user's
 * platform e.g. output will be CMD+K for macOS/iOS, CTRL+K for Windows/Linux
 * @param {string} keyboardShortcut The shortcut to translate
 */
function translateModifierKeysForUsersPlatform(keyboardShortcut) {
  const useCmdKey =
    navigator.platform.toUpperCase().indexOf("MAC") >= 0 ||
    navigator.platform.toUpperCase() === "IPHONE" ||
    navigator.platform.toUpperCase() === "IPAD";
  return keyboardShortcut.replace(/CMD|CTRL/gi, useCmdKey ? "CMD" : "CTRL");
}

export default { init };
