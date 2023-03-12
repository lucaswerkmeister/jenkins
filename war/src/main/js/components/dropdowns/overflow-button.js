import Utils from "@/components/dropdowns/utils";
import behaviorShim from "@/util/behavior-shim";
import BehaviorShim from "@/util/behavior-shim";
import Templates from "@/components/dropdowns/templates";

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
        // console.log(instance.popper)
        BehaviorShim.applySubtree(instance.popper, false);
      })
    });

  behaviorShim.specify(
    `[data-menu-item-type]`,
    "-dropdown-123567-",
    1000,
    (element) => {
      Utils.generateDropdown(element, (instance) => {
        instance.setContent(element.nextSibling.innerHTML)
        instance.props.trigger = "mouseenter"
        instance.props.placement = "right-start"
        instance.props.offset = [-8, 0]
      })
    });
}

export default { init };
