/* global AFRAME */

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Example component for A-Frame.
 */
AFRAME.registerComponent('look-controls-entity-rotator', {
    schema: {
        target: {type: 'selector', required: true}
    },

    /**
     * Set if component needs multiple instancing.
     */
    multiple: false,

    rotation: null,
    /**
     * Called once when component is attached. Generally for initial setup.
     */
    init: function () {
        this.targetEl = this.data.target;
    },

    /**
     * Called when component is attached and when component data changes.
     * Generally modifies the entity based on the data.
     */
    update: function (oldData) { },

    /**
     * Called when a component is removed (e.g., via removeAttribute).
     * Generally undoes all modifications to the entity.
     */
    remove: function () { },

    /**
     * Called on each scene tick.
     */
    tick: function (t) {
        //this.debounce(this.setTargetRotation.bind(this),1000);

        this.setTargetRotation();
    },

    setTargetRotation: function(){
        console.log('Setting target rotation');
        this.rotation = this.el.getAttribute('rotation');
        this.targetEl.setAttribute('rotation',this.rotation.x*-10+' '+this.rotation.y*-10+' 0');
    },

    debounce: function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },

    /**
     * Called when entity pauses.
     * Use to stop or remove any dynamic or background behavior such as events.
     */
    pause: function () { },

    /**
     * Called when entity resumes.
     * Use to continue or add any dynamic or background behavior such as events.
     */
    play: function () { }
});