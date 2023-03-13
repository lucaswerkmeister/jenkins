import { createElementFromHtml } from "@/util/dom";
import { registerSortableDragDrop } from "@/sortable-drag-drop";
import { SEARCH } from "@/util/symbols";
import Utils from "@/components/dropdowns/utils";

const MINIMUM_FILTER_OPTIONS_FOR_FILTER = 5;

/*
 * Generates a jump list for the active breadcrumb to jump to
 * sections on the page (if using <f:breadcrumb-config-outline />)
 */
function init() {
  document.querySelectorAll(".hetero-list-add").forEach((button) => {
    // Temporary
    if (button.classList.contains("credentials-add-menu")) {
      return;
    }

    // Templates for hetero-lists are stored in a div on load (.prototypes), we need to
    // take them and translate them into template objects we can use them for our dropdown menu
    const prototypes = button
      .closest(".hetero-list-container")
      .querySelector(".prototypes");
    const insertionPoint = prototypes.previousSibling;

    // Initialize drag and drop
    registerSortableDragDrop(insertionPoint.parentElement);

    // Translate the .prototypes div children into templates for the dropdown menu
    const templates = [];
    [...prototypes.children].forEach(function (n) {
      const name = n.getAttribute("name");
      const title = n.getAttribute("title");
      const descriptorId = n.getAttribute("descriptorId");
      templates.push({ html: n.innerHTML, name, title, descriptorId });
    });

    // Remove the .prototypes div to prevent tampering
    prototypes.remove();

    // If there's only one item, skip the dropdown and add the item click event directly to the button
    if (templates.length === 1) {
      button.addEventListener("click", () => {
        itemClickEvent(templates[0], insertionPoint);
      });
      return;
    }

    button.innerHTML += `...`;

    Utils.generateDropdown(button, (instance) => {
      const container = document.createElement("div");
      container.classList.add("jenkins-!-display-contents");

      // Add a filter bar if there are more than N items
      if (templates.length >= MINIMUM_FILTER_OPTIONS_FOR_FILTER) {
        generateFilterBar(container);
      }

      // Map the templates into a format suitable for the dropdown list
      const items = [...templates].map((templateItem) => ({
        label: templateItem.title,
        type: "button",
        onClick: () => itemClickEvent(templateItem, insertionPoint),
      }));

      container.appendChild(Utils.generateDropdownItems(items));

      instance.setContent(container);
      instance.setProps({
        onShow(instance) {
          const filterBar = instance.popper.querySelector("input");

          if (filterBar) {
            filterBar.value = "";
            filterBar.dispatchEvent(new Event("input", { bubbles: true }));
          }
        },
        onShown(instance) {
          const filterBar = instance.popper.querySelector("input");

          if (filterBar) {
            filterBar.focus();

            // Set a minimum width on the dropdown so that it doesn't resize when filtering
            instance.popper.style.minWidth = instance.popper.offsetWidth + "px";
          }
        },
      });
    });
  });
}

function generateFilterBar(container) {
  const filterBar = createElementFromHtml(
    `<div class="jenkins-dropdown__filter">
            <input class="jenkins-search__input" type="search" placeholder="Filter">
            ${SEARCH}
          </div>
      `
  );
  const itemsPlaceholder = createElementFromHtml(
    `<p class="jenkins-dropdown__placeholder jenkins-!-display-none">No items</p>`
  );
  const filterBarInput = filterBar.querySelector("input");
  container.append(filterBar);
  container.append(itemsPlaceholder);

  filterBarInput.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
    }
  });

  filterBarInput.addEventListener("input", () => {
    const itemList = filterBarInput.parentElement.parentElement;
    itemsPlaceholder.classList.remove("jenkins-!-display-none");

    itemList.querySelectorAll(".jenkins-dropdown__item").forEach((item) => {
      const match = item.innerText
        .toLowerCase()
        .includes(filterBarInput.value.toLowerCase());

      item.classList.remove("jenkins-dropdown__item--selected");
      item.classList.toggle("jenkins-!-display-none", !match);
      if (match) {
        itemsPlaceholder.classList.add("jenkins-!-display-none");
      }
    });

    itemList
      .querySelector(".jenkins-dropdown__item:not(.jenkins-\\!-display-none)")
      .classList.add("jenkins-dropdown__item--selected");
  });
}

function itemClickEvent(templateItem, insertionPoint) {
  const card = document.createElement("div");
  card.className = "repeated-chunk";
  card.setAttribute("name", templateItem.name);
  card.setAttribute("descriptorId", templateItem.descriptorId);
  card.innerHTML = templateItem.html;

  insertionPoint.parentElement.insertBefore(card, insertionPoint);

  renderOnDemand(card.querySelector("div.config-page"), () => {}, false);

  Behaviour.applySubtree(card, true);
  ensureVisible(card);
  layoutUpdateCallback.call();
}

export default { init };
