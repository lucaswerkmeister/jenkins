import tippy from "tippy.js";
import New from "./new.js";

let dropdownInstances = [];
const globalPlugin = {
  fn() {
    return {
      onCreate(instance) {
        dropdownInstances = dropdownInstances.concat(instance);
      },
      onDestroy(instance) {
        dropdownInstances = dropdownInstances.filter((i) => i !== instance);
      },
    };
  },
};

tippy.setDefaultProps({
  plugins: [globalPlugin],
});

/**
 * Registers dropdowns for the page
 * If called again, destroys existing dropdowns and registers them again (useful for progressive rendering)
 */
function init() {
  dropdownInstances.forEach((instance) => {
    instance.destroy();
  });

  // tippy("[dropdown]", {
  //   content: (element) =>
  //     document.getElementById(element.getAttribute("menu")).innerHTML,
  //   interactive: true,
  //   trigger: "click",
  //   allowHTML: true,
  //   placement: "bottom-start",
  //   arrow: false,
  //   theme: "dropdown",
  //   offset: [0, 0],
  //   animation: "dropdown",
  // });

  New.registerDropdowns();
}

export default { init };
