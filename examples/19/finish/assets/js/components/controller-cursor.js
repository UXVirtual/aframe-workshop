AFRAME.registerComponent('controller-cursor', {
    // dependencies: ['cursor'],

    // daydream-controller doesn't have a trigger.
    schema: {
        downEvents: {type: 'array', default: ['triggerdown', 'trackpaddown', 'thumbstickdown']},
        upEvents: {type: 'array', default: ['triggerup', 'trackpadup', 'thumbstickup']},
    },

    init: function () {
        // We want to use controller buttons, so don't fuse.
        this.el.setAttribute('cursor', 'fuse', false);
        this.onDown = this.onDown.bind(this);
        this.onUp = this.onUp.bind(this);
    },

    play: function () {
        var el = this.el;
        // Samsung Internet doesn't like ES6 syntax!
        var self = this;
        this.data.downEvents.forEach(function (eventName) {
            el.addEventListener(eventName, self.onDown);
        });
        this.data.upEvents.forEach(function (eventName) {
            el.addEventListener(eventName, self.onUp);
        });
    },

    pause: function () {
        var el = this.el;
        // Samsung Internet doesn't like ES6 syntax!
        var self = this;
        this.data.downEvents.forEach(function (eventName) {
            el.removeEventListener(eventName, self.onDown);
        });
        this.data.upEvents.forEach(function (eventName) {
            el.removeEventListener(eventName, self.onUp);
        });
    },

    onDown: function (evt) {
        this.el.components.cursor.onMouseDown();
    },
    onUp: function (evt) {
        this.el.components.cursor.onMouseUp();
    }
});