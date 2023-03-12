import {showModal} from "@/components/modals";

document.querySelector("#button-icon-legend").addEventListener("click", () => {
  const content = document.querySelector("#template-icon-legend").content;

  showModal(content);
});
