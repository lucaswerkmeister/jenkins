import tippy from "tippy.js";
import Templates from "./templates.js";
import makeKeyboardNavigable from "@/util/keyboard";

const generateDropdownDetails = (isSubmenu) => {
  return {
    content: "<p class='jenkins-spinner'></p>",
    interactive: true,
    trigger: isSubmenu ? "mouseenter" : "click",
    allowHTML: true,
    placement: isSubmenu ? "right-start" : "bottom-start",
    arrow: false,
    theme: "dropdown",
    appendTo: document.body,
    offset: isSubmenu ? [-8, 0] : [0, 0],
    animation: "dropdown",
    onShow(instance) {
      instance.popper.addEventListener("click", () => {
        instance.hide();
      });
      const href = instance.reference.getAttribute("href");

      if (instance.loaded) {
        return;
      }

      fetch(
        combinePath(
          href,
          !instance.reference.classList.contains("children")
            ? "contextMenu"
            : "childrenContextMenu"
        )
      )
        .then((response) => response.json())
        .then((json) => instance.setContent(generateMenuItems(json.items)))
        .catch((error) => {
          // Fallback if the network request failed
          instance.setContent(`Request failed. ${error}`);
        })
        .finally(() => (instance.loaded = true));
    },
  };
};

const SELECTED_CLASS = "jenkins-dropdown__item--selected";

function generateMenuItems(items) {
  const menuItems = document.createElement("div");

  menuItems.classList.add("jenkins-dropdown");
  menuItems.append(
    ...items.map((item) => {
      if (item.type === "HEADER") {
        return Templates.heading(item.text || item.displayName);
      }

      if (item.type === "SEPARATOR") {
        return Templates.separator();
      }

      const menuItemOptions = {
        url: item.url,
        label: item.text || item.displayName,
        icon: item.icon,
        iconXml: item.iconXml,
        subMenu: item.subMenu,
        type: item.post ? "button" : "link",
      };
      const menuItem = Templates.item(menuItemOptions);

      if (item.post || item.requiresConfirmation) {
        menuItem.addEventListener("click", () => {
          if (item.requiresConfirmation) {
            if (confirm((item.text || item.displayName) + ": are you sure?")) {
              // TODO I18N
              const form = document.createElement("form");
              form.setAttribute("method", item.post ? "POST" : "GET");
              form.setAttribute("action", item.url);
              if (item.post) {
                crumb.appendToForm(form);
              }
              document.body.appendChild(form);
              form.submit();
            }
          } else {
            new Ajax.Request(item.url);
          }
        });
      }

      if (item.subMenu != null) {
        menuItem.items = item.subMenu.items;
        tippy(menuItem, generateDropdownDetails(true));
      }

      return menuItem;
    })
  );

  makeKeyboardNavigable(
    menuItems,
    () => menuItems.querySelectorAll(".jenkins-dropdown__item"),
    SELECTED_CLASS
  );

  return menuItems;
}

function combinePath(a, b) {
  let qs;
  let i = a.indexOf("?");
  if (i >= 0) {
    qs = a.substring(i);
  } else {
    qs = "";
  }

  i = a.indexOf("#");
  if (i >= 0) {
    a = a.substring(0, i);
  }

  if (a.endsWith("/")) {
    return a + b + qs;
  }
  return a + "/" + b + qs;
}

/**
 * Registers dropdowns for the page
 * If called again, destroys existing dropdowns and registers them again (useful for progressive rendering)
 */
function registerDropdowns() {
  document.querySelectorAll("A.model-link").forEach(function (link) {
    const isFirefox = navigator.userAgent.indexOf("Firefox") !== -1;
    // Firefox adds unwanted lines when copying buttons in text, so use a span instead
    const dropdownChevron = document.createElement(
      isFirefox ? "span" : "button"
    );
    dropdownChevron.className = "jenkins-menu-dropdown-chevron";
    dropdownChevron.setAttribute("href", link.href);
    dropdownChevron.addEventListener("click", function (event) {
      event.preventDefault();
    });
    link.appendChild(dropdownChevron);
  });

  tippy(
    "li.children, #menuSelector, .jenkins-menu-dropdown-chevron",
    generateDropdownDetails(false)
  );
}

export default { registerDropdowns };
