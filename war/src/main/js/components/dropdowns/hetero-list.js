import tippy from "tippy.js";
import Templates from "@/components/dropdowns/templates";
import makeKeyboardNavigable from "@/util/keyboard";
import { toId } from "@/util/dom";
import {createElementFromHtml} from "../../util/dom";
import {registerSortableDragDrop} from "../../sortable-drag-drop";

/*
 * Generates a jump list for the active breadcrumb to jump to
 * sections on the page (if using <f:breadcrumb-config-outline />)
 */
function init() {
  document.querySelectorAll(".hetero-list-add").forEach((button) => {
    // Templates for hetero-lists are stored in a div on load (.prototypes), so we
    // need to take them and translate them into template objects we can use for our dropdown menu
    const prototypes = button.parentElement.previousSibling
    const insertionPoint = button.parentElement.previousSibling.previousSibling

    // Initialize drag and drop
    const supportsDragDrop = registerSortableDragDrop(insertionPoint.parentElement);

    // Translate the .prototypes div children into templates for the dropdown menu
    const templates = [];
    [...prototypes.children].forEach(function (n) {
      const name = n.getAttribute("name");
      const title = n.getAttribute("title");
      const descriptorId = n.getAttribute("descriptorId");
      templates.push({html: n.innerHTML, name, title, descriptorId});
    });

    // Remove the .prototypes div to prevent tampering
    Element.remove(prototypes);

    // Generate a list of menu items for the dropdown to use
    let menuItems = document.createElement("div")
    menuItems.classList.add("jenkins-dropdown")
    menuItems.append(...templates.map(function (templateItem) {
      const menuItem = createElementFromHtml(`<button type="button" class="jenkins-dropdown__item">
                        ${templateItem.title}
                      </button>`)

      menuItem.addEventListener("click", () => {
        const card = document.createElement("div");
        card.className = "repeated-chunk";
        card.setAttribute("name", templateItem.name);
        card.setAttribute("descriptorId", templateItem.descriptorId);
        card.innerHTML = templateItem.html;

        insertionPoint.parentElement.insertBefore(card, insertionPoint)

        renderOnDemand(findElementsBySelector(card,"div.config-page")[0],() => {});

        Behaviour.applySubtree(card,true);
        ensureVisible(card);
        layoutUpdateCallback.call();

        if (supportsDragDrop) {
          registerSortableDragDrop(insertionPoint.parentElement)
        }
      });

      return menuItem
    }))

    // Add the tippy dropdown to the .hetero-list-add button
    tippy(button, {
      ...Templates.dropdown(),
      content: menuItems,
      onShow(instance) {
        instance.popper.addEventListener("click", () => {
          instance.hide();
        });
      },
    })
  })
}

/*
 * Generates the Tippy dropdown for the in-page jump list
 */
function generateDropdown() {
  return {
    ...Templates.dropdown(),
    onShow(instance) {
      instance.popper.addEventListener("click", () => {
        instance.hide();
      });
      const items = [];
      document
        .querySelectorAll(
          "form > div > div > .jenkins-section > .jenkins-section__title"
        )
        .forEach((section) => {
          const id = toId(section.textContent);
          section.id = id;
          items.push({ label: section.textContent, id: id });
        });
      instance.setContent(generateDropdownItems(items));
    },
  };
}

/*
 * Generates the contents for the dropdown
 */
function generateDropdownItems(items) {
  const menuItems = document.createElement("div");

  menuItems.classList.add("jenkins-dropdown");
  menuItems.append(
    ...items.map((item) => {
      const menuItemOptions = {
        url: "#" + item.id,
        label: item.label,
      };
      return Templates.item(menuItemOptions);
    })
  );

  makeKeyboardNavigable(
    menuItems,
    () => menuItems.querySelectorAll(".jenkins-dropdown__item"),
    Templates.SELECTED_ITEM_CLASS
  );

  return menuItems;
}

export default { init };
