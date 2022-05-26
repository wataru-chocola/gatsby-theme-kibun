import 'whatwg-fetch';

const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);
