import tippy from 'tippy.js'

let dropdownInstances = []
const globalPlugin = {
  fn() {
    return {
      onCreate(instance) {
        dropdownInstances = dropdownInstances.concat(instance);
      },
      onDestroy(instance) {
        dropdownInstances = dropdownInstances.filter(i => i !== instance);
      }
    }
  }
}

tippy.setDefaultProps({
  plugins: [globalPlugin]
})

const generateDropdownDetails = (isSubmenu) => {
  return {
    content: "<p class='jenkins-spinner'></p>",
    interactive: true,
    trigger: isSubmenu ? "mouseenter" : "click",
    allowHTML: true,
    placement: isSubmenu ? "right-start" : "bottom-start",
    arrow: false,
    theme: 'dropdown',
    appendTo: document.body,
    offset: isSubmenu ? [-7, 0] : [0, 0],
    animation: 'dropdown',
    onShow(instance) {
      instance.popper.addEventListener("click", () => {
        instance.hide();
      });

      // If the instance already has existing items, render those instead
      if (instance.reference.items || (instance.reference.target && instance.reference.target.items)) {
        generateMenuItems(instance.reference.items || instance.reference.target.items())
      } else {
        const href = instance.reference.target ? instance.reference.target.href : instance.reference.getAttribute('href')

        fetch(combinePath(href, "contextMenu"))
          .then((response) => response.json())
          .then((json) => generateMenuItems(json.items))
          .catch((error) => {
            // Fallback if the network request failed
            instance.setContent(`Request failed. ${error}`)
          })
      }

      function generateMenuItems(items) {
        let menuItems = document.createElement("div")
        menuItems.append(...items.map(function (x) {
          if (x.type === "HEADER") {
            return createElementFromHTML(`<p class="jenkins-dropdown__header">${x.text || x.displayName}</p>`)
          }

          if (x.type === "SEPARATOR") {
            return createElementFromHTML(`<div class="jenkins-dropdown__separator"></div>`)
          }

          const tagName = x.post ? "button" : "a";

          const menuItem = createElementFromHTML(`<${tagName} class="jenkins-dropdown__item" href="${x.url}">
                                      ${x.icon ? `<div class="jenkins-dropdown__item__icon">${x.iconXml ? x.iconXml : '<img src="${x.icon}" alt="" />'}</div>` : ``}
                                      ${x.text || x.displayName}
                                      ${x.subMenu != null ? `<span class="jenkins-dropdown__item__chevron"></span>` : ``}
                                  </${tagName}>`)

          if (x.post || x.requiresConfirmation) {
            menuItem.addEventListener("click", () => {
              if (x.requiresConfirmation) {
                if (confirm((x.text || x.displayName) + ": are you sure?")) { // TODO I18N
                  var form = document.createElement('form');
                  form.setAttribute('method', x.post ? 'POST' : 'GET');
                  form.setAttribute('action', x.url);
                  if (x.post) {
                    crumb.appendToForm(form);
                  }
                  document.body.appendChild(form);
                  form.submit();
                }
              } else {
                new Ajax.Request(x.url);
              }
            })
          }

          if (x.subMenu != null) {
            menuItem.items = x.subMenu.items
            tippy(menuItem, generateDropdownDetails(true))
          }

          return menuItem
        }))

        instance.setContent(menuItems)
      }

    },
    onHidden(instance) {
      instance.setContent("<p class='jenkins-spinner'></p>")
    }
  }
}

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
}

function combinePath(a,b) {
  var qs
  var i = a.indexOf('?')
  if (i >= 0) {
    qs=a.substring(i);
  } else {
    qs=""
  }

  i = a.indexOf('#')
  if (i >= 0) {
    a=a.substring(0, i)
  }

  if (a.endsWith('/')) {
    return a + b + qs
  }
  return a + '/' + b + qs
}

registerDropdowns()

/**
 * Registers dropdowns for the page
 * If called again, destroys existing dropdowns and registers them again (useful for progressive rendering)
 */
function registerDropdowns() {
  dropdownInstances.forEach(instance => {
    instance.destroy()
  })

  tippy('[dropdown]', {
    content: element => document.getElementById(element.getAttribute('menu')).innerHTML,
    interactive: true,
    trigger: 'click',
    allowHTML: true,
    placement: "bottom-start",
    arrow: false,
    theme: 'dropdown',
    offset: [0, 0],
    animation: 'dropdown'
  })
}
