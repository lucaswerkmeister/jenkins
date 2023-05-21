import behaviorShim from "@/util/behavior-shim";

function init() {
  behaviorShim.specify(
    ".jenkins-section__title--collapsible",
    "-tooltip-",
    1000,
    (element) => {
      element.addEventListener("click", () => {
        element.classList.toggle("jenkins-section__title--collapsed");
        element.nextSibling.classList.toggle("section-body-hidden--hidden");
      });
    }
  );
}

export default { init };
