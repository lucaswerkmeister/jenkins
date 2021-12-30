import tippy from 'tippy.js'

function combinePath(a,b) {
    var qs
    var i = a.indexOf('?')
    if (i >= 0) {
        qs=a.substring(i);
        a=a.substring(0, i)
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

tippy('[popover]', {
    content: element => document.getElementById(element.getAttribute('menu')).innerHTML,
    interactive: true,
    trigger: 'click',
    allowHTML: true,
    placement: "bottom-start",
    arrow: false,
    theme: 'popover',
    offset: [0, 0],
    animation: 'popover'
})

tippy('li.children, #menuSelector', {
    content: "<p class='jenkins-spinner'></p>",
    interactive: true,
    trigger: 'click',
    allowHTML: true,
    placement: "bottom-start",
    arrow: false,
    theme: 'popover',
    offset: [0, 0],
    animation: 'popover',
    onShow(instance) {
        // If the instance already has existing items, render those instead
        if (instance.reference.target && instance.reference.target.items) {
            let content = instance.reference.target.items().map(function (x) {
                return `<a class="jenkins-popover__item" href="${x.url}">
                            ${x.text}
                        </a>`
            }).join('')
            instance.setContent(content)
        } else {
            const href = instance.reference.target ? instance.reference.target.href : instance.reference.getAttribute('href')
            const contextMenuSuffix = instance.reference.target ? 'contextMenu' : 'childrenContextMenu'

            fetch(combinePath(href, contextMenuSuffix))
                .then((response) => response.json())
                .then((json) => {
                    let content = json.items.map(function (x) {
                        return `<a class="jenkins-popover__item" href="${x.url}">
                                    ${x.icon ? `<div class="jenkins-popover__item__icon"><img src="${x.icon}" alt="" /></div>` : ``}
                                    ${x.displayName}
                                </a>`
                    }).join('')
                    instance.setContent(content)
                })
                .catch((error) => {
                    // Fallback if the network request failed
                    instance.setContent(`Request failed. ${error}`)
                })
        }
    },
    onHidden(instance) {
        instance.setContent("<p class='jenkins-spinner'></p>")
    },
})

tippy('[tooltip]', {
    content: element => element.getAttribute('tooltip'),
    arrow: false,
    theme: 'tooltip',
    animation: 'tooltip'
})

tippy('[html-tooltip]', {
    content: element => element.getAttribute('html-tooltip'),
    allowHTML: true,
    arrow: false,
    theme: 'tooltip',
    animation: 'tooltip'
})

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
}

document.querySelectorAll(".hetero-list-add").forEach(function(e) {
  // Templates for hetero-lists are stored in a div on load (.prototypes), so we
  // need to take them and translate them into template objects we can use for our dropdown menu
  const prototypes = e.parentElement.previousSibling
  const insertionPoint = e.parentElement.previousSibling.previousSibling

  // Initialize drag and drop
  var withDragDrop = registerSortableDragDrop(insertionPoint.parentElement);

  // Translate the .prototypes div children into templates for the dropdown menu
  const templates = [];
  [...prototypes.children].forEach(function (n) {
    const name = n.getAttribute("name");
    const descriptorId = n.getAttribute("descriptorId");
    const title = n.getAttribute("title");
    const icon = `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Ellipse</title><circle cx="256" cy="256" r="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>`
    templates.push({html: n.innerHTML, name, title, descriptorId, icon});
  });

  // Remove the .prototypes div to prevent tampering
  Element.remove(prototypes);

  // Generate a list of menu items for the dropdown to use
  let menuItems = document.createElement("div")
  menuItems.append(...templates.map(function (x) {
    const menuItem = createElementFromHTML(`<button type="button" class="jenkins-popover__item">
                        <div class="jenkins-popover__item__icon">${x.icon}</div>
                        ${x.title}
                      </button>`)

    menuItem.addEventListener("click", () => {
      const nc = document.createElement("div");
      nc.className = "repeated-chunk";
      nc.setAttribute("name", x.name);
      nc.setAttribute("descriptorId", x.descriptorId);
      nc.innerHTML = x.html;

      insertionPoint.parentElement.insertBefore(nc, insertionPoint)

      renderOnDemand(findElementsBySelector(nc,"div.config-page")[0],function() {
      });

      Behaviour.applySubtree(nc,true);
      ensureVisible(nc);
      layoutUpdateCallback.call();

      // Initialize drag & drop for this component
      if(withDragDrop) alert(registerSortableDragDrop(insertionPoint.parentElement))
    });

    return menuItem
  }))

  // Add the tippy dropdown to the .hetero-list-add button
  tippy(e, {
    interactive: true,
    trigger: 'click',
    allowHTML: true,
    placement: "bottom-start",
    arrow: false,
    theme: 'popover',
    offset: [0, 0],
    animation: 'popover',
    content: menuItems,
    onShow(instance) {
      instance.popper.addEventListener("click", () => {
        instance.hide();
      });
    },
  })
})


