import Utils from "@/components/dropdowns/utils";
import behaviorShim from "@/util/behavior-shim";

/**
 * Does something
 */
function init() {
  behaviorShim.specify(
    "[dropdown]",
    "-dropdown-123-",
    1000,
    (element) => {
      Utils.generateDropdown(element, (instance) => {
        instance.setContent(document.getElementById(element.getAttribute("menu")).innerHTML)
      })
    });
}

export default { init };
