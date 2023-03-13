import tippy from "tippy.js";
import Templates from "@/components/dropdowns/templates";
import { createElementFromHtml } from "@/util/dom";
import { registerSortableDragDrop } from "@/sortable-drag-drop";
import {SEARCH} from "../../util/symbols";

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

    // Templates for hetero-lists are stored in a div on load (.prototypes), so we
    // need to take them and translate them into template objects we can use for our dropdown menu
    const prototypes = button.closest(".hetero-list-container").querySelector(".prototypes");
    const insertionPoint = prototypes.previousSibling;

    // Initialize drag and drop
    const supportsDragDrop = registerSortableDragDrop(
      insertionPoint.parentElement
    );

    // Translate the .prototypes div children into templates for the dropdown menu
    const templates = [];
    [...prototypes.children].forEach(function (n) {
      const name = n.getAttribute("name");
      const title = n.getAttribute("title");
      const descriptorId = n.getAttribute("descriptorId");
      templates.push({ html: n.innerHTML, name, title, descriptorId });
    });

    // Remove the .prototypes div to prevent tampering
    Element.remove(prototypes);

    if (templates.length === 1) {
      button.addEventListener("click", () => {
        clickItem(templates[0], insertionPoint, supportsDragDrop);
      })
      return;
    }

    button.innerHTML += `...`;

    // Generate a list of menu items for the dropdown to use
    let menuItems = document.createElement("div");
    menuItems.classList.add("jenkins-dropdown");
    if (templates.length > 0) {
      const filterBar = createElementFromHtml(
        `<div class="jenkins-dropdown__filter">
            <input class="jenkins-search__input" type="search" placeholder="Filter">
            ${SEARCH}
          </div>
      `);
      const itemsPlaceholder = createElementFromHtml(
        `<p class="jenkins-dropdown__placeholder" style="display: none">No items</p>`
      )
      const filterBarInput = filterBar.querySelector("input");
      menuItems.append(filterBar);
      menuItems.append(itemsPlaceholder);

      filterBarInput.addEventListener("input", () => {
        const itemList = filterBarInput.parentElement.parentElement;
        itemsPlaceholder.style.display = "";
        for (const item of itemList.querySelectorAll(".jenkins-dropdown__item")) {
          const match = item.innerText.toLowerCase().includes(filterBarInput.value.toLowerCase());
          item.style.display = match ? "" : "none";
          if (match) {
            itemsPlaceholder.style.display = "none";
          }
        }
      })
    }
    menuItems.append(
      ...templates.map((templateItem) => {
        const menuItem =
          createElementFromHtml(`<button type="button" class="jenkins-dropdown__item">
                        ${templateItem.title}
                      </button>`);

        menuItem.addEventListener("click", () => clickItem(templateItem, insertionPoint, supportsDragDrop));

        return menuItem;
      })
    );

    // Add the tippy dropdown to the .hetero-list-add button
    tippy(button, {
      ...Templates.dropdown(),
      content: menuItems,
      onShow(instance) {
        const filterBar = instance.popper.querySelector("input");
        if (filterBar) {
          filterBar.value = "";
          filterBar.dispatchEvent(new Event('input', { bubbles: true }));
        }
        instance.popper.addEventListener("click", () => {
          instance.hide();
        });
      },
      onShown(instance) {
        const filterBar = instance.popper.querySelector("input");
        if (filterBar) {
          filterBar.focus();

          // console.log()
          instance.popper.style.minWidth = instance.popper.offsetWidth + "px";
        }
      }
    });
  });
}

function clickItem(templateItem, insertionPoint, supportsDragDrop) {
  const card = document.createElement("div");
  card.className = "repeated-chunk";
  card.setAttribute("name", templateItem.name);
  card.setAttribute("descriptorId", templateItem.descriptorId);
  card.innerHTML = templateItem.html;

  insertionPoint.parentElement.insertBefore(card, insertionPoint);

  renderOnDemand(
    findElementsBySelector(card, "div.config-page")[0],
    () => {}
  );

  Behaviour.applySubtree(card, true);
  ensureVisible(card);
  layoutUpdateCallback.call();

  if (supportsDragDrop) {
    registerSortableDragDrop(insertionPoint.parentElement);
  }
}

export default { init };
