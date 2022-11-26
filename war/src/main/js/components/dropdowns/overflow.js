import tippy from "tippy.js";
import Templates from "@/components/dropdowns/templates";

/*
 * Generates dropdowns for overflow menu buttons
 */
function init() {
  tippy("[dropdown]", {
    ...Templates.dropdown(),
    content: (element) =>
      document.getElementById(element.getAttribute("menu")).innerHTML,
  });
}

export default { init };
