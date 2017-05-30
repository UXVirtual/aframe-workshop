AFRAME.registerComponent("controller-with-cursor-if-present", {
    schema: {type: 'string'},
    init: function() {
        this.el.setAttribute('controller-model-if-present', this.data);

        // Create ray as visible guide for selection.
        // NOTE: make sure cursor/raycaster won't intersect!
        var ray = document.createElement('a-box');
        ray.setAttribute('class', 'not-clickable');
        ray.setAttribute('width', 0.001);
        ray.setAttribute('height', 0.001);
        ray.setAttribute('depth', 100);
        ray.setAttribute('position', {x:0, y:0, z: -50});
        ray.setAttribute('color', 'green');
        ray.setAttribute('opacity', 0.95);
        this.el.appendChild(ray);

        this.el.addEventListener('controllerconnected', function (evt) {
            // if we had a raycaster, cursor, etc., attach here
            evt.target.setAttribute('controller-cursor', '');
            // need to make ray NOT an intersection target for raycaster!
            evt.target.setAttribute('raycaster', 'interval:100; objects:.clickable');

            // Since we have a controller, remove gaze cursor.
            var cameraCursorEl = document.querySelector('a-camera a-entity[cursor]');
            if (cameraCursorEl) {
                cameraCursorEl.parentElement.removeChild(cameraCursorEl);
            }
        });
    }
});