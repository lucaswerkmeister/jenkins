import Utils from "@/components/dropdowns/utils";

/**
 * Does something
 */
function init() {
  behaviorShim.specify(
    "[dropdown]",
    "-dropdown-",
    1000,
    (element) => {
      Utils.generateDropdown(element, (instance) => {
        instance.setContent(document.getElementById(element.getAttribute("menu")).innerHTML)
      })
    });
}

export default { init };
