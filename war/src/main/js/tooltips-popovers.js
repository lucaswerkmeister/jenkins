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
    content: "Loading...",
    interactive: true,
    trigger: 'click',
    allowHTML: true,
    placement: "bottom-start",
    arrow: false,
    theme: 'popover',
    offset: [0, 0],
    animation: 'popover',
    onShow(instance) {
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
    },
    onHidden(instance) {
        instance.setContent('Loading...')
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
