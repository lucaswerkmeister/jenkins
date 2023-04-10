import Templates from "@/components/dropdowns/templates";
import tippy from "tippy.js";

/*
 * Generates the dropdowns for the given element
 * Preloads the data on hover for speed
 * @param element - the element to generate the dropdown for
 * @param callback - called to retrieve the list of dropdown items
 */
function generateDropdown(element, callback) {
  tippy(
    element,
    Object.assign({}, Templates.dropdown(), {
      onCreate(instance) {
        instance.reference.addEventListener("mouseenter", () => {
          if (instance.loaded) {
            return;
          }

          instance.popper.addEventListener("click", () => {
            instance.hide();
          });

          callback(instance);
        });
      },
    })
  );
}

export default {
  generateDropdown,
};
