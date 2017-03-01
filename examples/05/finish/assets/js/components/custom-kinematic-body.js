/**
 * Kinematic body.
 *
 * See: http://www.learn-cocos2d.com/2013/08/physics-engine-platformer-terrible-idea/
 * And: http://oxleygamedev.blogspot.com/2011/04/player-physics-part-2.html
 */
var CANNON = window.CANNON;
var EPS = 0.000001;

AFRAME.registerComponent('custom-kinematic-body', {
    dependencies: ['velocity'],

    /*******************************************************************
     * Schema
     */

    schema: {
        mass:           { default: 5 },
        radius:         { default: 1.3 },
        height:         { default: 1.764 },
        linearDamping:  { default: 0.05 },
        enableSlopes:   { default: true }
    },

    /*******************************************************************
     * Lifecycle
     */

    init: function () {
        this.system = this.el.sceneEl.systems.physics;
        this.system.addBehavior(this, this.system.Phase.SIMULATE);

        var el = this.el,
            data = this.data,
            position = (new CANNON.Vec3()).copy(el.getAttribute('position'));

        this.body = new CANNON.Body({
            material: this.system.material,
            position: position,
            mass: data.mass,
            linearDamping: data.linearDamping,
            fixedRotation: true
        });
        this.body.addShape(
            new CANNON.Sphere(data.radius),
            new CANNON.Vec3(0, data.radius - data.height, 0)
        );

        this.body.el = this.el;
        this.el.body = this.body;
        this.system.addBody(this.body);
    },

    remove: function () {
        this.system.removeBody(this.body);
        this.system.removeBehavior(this, this.system.Phase.SIMULATE);
        delete this.el.body;
    },

    step: (function () {
        var velocity = new THREE.Vector3(),
            normalizedVelocity = new THREE.Vector3(),
            currentSurfaceNormal = new THREE.Vector3(),
            groundNormal = new THREE.Vector3();

        return function (t, dt) {
            if (!dt) return;
        };
    }()),
});