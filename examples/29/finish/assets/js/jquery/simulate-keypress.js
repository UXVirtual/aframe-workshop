// jQuery plugin. Called on a jQuery object, not directly.
jQuery.fn.simulateKeyPress = function (character) {
    // Internally calls jQuery.event.trigger with arguments (Event, data, elem).
    // That last argument, 'elem', is very important!
    jQuery(this).trigger({ type: 'keypress', which: character.charCodeAt(0) });
};