/**
 * auto-scale component
 *
 * Automatically scales the entity this component is placed on to be the same size, no matter what the distance to the target object (e.g. camera) is
 */
AFRAME.registerComponent('auto-scale', {
    init: function () {

        this.target = this.el.sceneEl.querySelector(this.data.target);
        this.originalScale = this.el.components.scale.data;

        if (!this.target) {
            throw new Error('Target not found');
        }

        this.updateScale();

    },

    tick: function (t, dt) {
        if (!this.data.static) {
            this.updateScale();
        }
    },

    updateScale: function () {

        var vector = new THREE.Vector3();
        vector.setFromMatrixPosition( this.el.object3D.matrixWorld );

        var vectorTarget = new THREE.Vector3();
        vectorTarget.setFromMatrixPosition( this.target.object3D.matrixWorld );

        var distance = vector.distanceTo( vectorTarget );
        var newScale = this.originalScale.x*(distance/this.data.size);
        this.el.object3D.scale.set(newScale,newScale,newScale);
    },

    schema: {
        target: {type: 'string', required: true},
        size: { type: 'number', default: 1 },
        static: { type: 'boolean', default: false}
    },

    multiple: true
});