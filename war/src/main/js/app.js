import Dropdowns from "@/components/dropdowns";
import Notifications from "@/components/notifications";
import SearchBar from "@/components/search-bar";
import Tooltips from "@/components/tooltips";

Dropdowns.init();
Notifications.init();
SearchBar.init();
Tooltips.init();

const buildButton = document.querySelector("#button-build");

buildButton.addEventListener("click", () => {
  buildButton.classList.add("longhorn-on");

  setTimeout(() => {
    buildButton.classList.remove("longhorn-on");
  }, 3500)

  new Ajax.Request(buildButton.dataset.href);
})
