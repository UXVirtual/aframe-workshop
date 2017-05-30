AFRAME.registerComponent("controller-model-if-present", {
    controllerComponents: ['oculus-touch-controls', 'vive-controls', 'daydream-controls', 'gearvr-controls'],
    schema: { type: 'string' },
    init: function () {
        var el = this.el;
        // install event handler
        el.addEventListener('controllerconnected', function (evt) {
            // we've got something, make it visible
            el.setAttribute('visible', true);
            // undo hand-model rotation offset
            el.setAttribute('tracked-controls', 'rotationOffset', 0);
            el.setAttribute(evt.detail.name, 'rotationOffset', 0);
            // use controller model
            el.setAttribute(evt.detail.name, 'model', true);
            // setAttribute doesn't make model appear, so force
            evt.detail.component.updateControllerModel();
        });

        // Use various controller components,
        this.controllerComponents.forEach(function(name) { this.el.setAttribute(name, 'hand', this.data); }.bind(this));
        // but hide by default.
        this.el.setAttribute('visible', false);
    }
});