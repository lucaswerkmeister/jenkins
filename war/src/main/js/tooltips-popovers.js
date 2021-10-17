// import tippy from 'tippy.js';

tippy('#myButton', {
    content: 'My tooltip!',
    interactive: true,
    trigger: 'click'
});

tippy('[tooltip]', {
    content: element => element.getAttribute('tooltip')
});

tippy('[html-tooltip]', {
    content: element => element.getAttribute('html-tooltip'),
    allowHTML: true
});
