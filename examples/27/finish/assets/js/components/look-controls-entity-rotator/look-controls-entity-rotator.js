/* global AFRAME */

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Look Controls Entity Rotator
 *
 * Depends on Smooth.js 0.1.7 -
 */
AFRAME.registerComponent('look-controls-entity-rotator', {
    schema: {
        target: {type: 'selector', required: true},
        smoothing: {type: 'int', default: 10}
    },

    /**
     * Set if component needs multiple instancing.
     */
    multiple: false,

    tickCount: 0,
    lastRotation: {x:0,y:0},
    rotationSamples: [],
    /**
     * Called once when component is attached. Generally for initial setup.
     */
    init: function () {
        this.targetEl = this.data.target;

        var lastRotation = this.el.getAttribute('rotation');

        this.lastRotation = {
            x: lastRotation.x,
            y: lastRotation.y
        };
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
        //this.setTargetRotation(t);

        this.setTargetRotationSmoothed();
    },

    rotate: function(el, rotation, options) {
        options || (options = {duration: 300});

        var object = el.object3D;

        //var origpos = new THREE.Vector3().copy(camera.position); // original position
        var origrot = new THREE.Euler().copy(object.rotation); // original rotation

        //camera.position.set(dstpos.x, dstpos.y, dstpos.z);
        //object.lookAt(dstlookat);
        var dstrot = new THREE.Euler().copy(rotation)

        // reset original position and rotation
        //camera.position.set(origpos.x, origpos.y, origpos.z);
        object.rotation.set(origrot.x, origrot.y, origrot.z);

        //
        // Tweening
        //

        // position
        /*new TWEEN.Tween(camera.position).to({
            x: dstpos.x,
            y: dstpos.y,
            z: dstpos.z
        }, options.duration).start();;*/

        // rotation (using slerp)
        (function () {
            var qa = object.quaternion; // src quaternion
            var qb = new THREE.Quaternion().setFromEuler(dstrot); // dst quaternion
            var qm = new THREE.Quaternion();

            var o = {t: 0};
            new TWEEN.Tween(o).to({t: 1}, options.duration).onUpdate(function () {
                THREE.Quaternion.slerp(qa, qb, qm, o.t);
                object.quaternion.set(qm.x, qm.y, qm.z, qm.w);
            }).onComplete(function(){
                //el.setAttribute('rotation',rotation.x+' '+rotation.y+' '+rotation.z);
            }).start();
        }).call(this);
    },

    setTargetRotation: function(t){

        const currentModelRotation = this.targetEl.getAttribute('rotation');
        const currentCameraRotation = this.el.getAttribute('rotation');

        const newRotation = {
            x: Math.abs(currentCameraRotation.x*-10),
            y: Math.abs(currentCameraRotation.y*-10),
            z: 0
        };

        //console.log(currentModelRotation,currentCameraRotation);

        if(this.tickCount < 20){
            this.tickCount++;
        }else{
            this.tickCount = 0;

            console.log('Updating rotation');

            //this.rotate(this.targetEl,newRotation,{duration:250});

            setTimeout(function(){
                this.targetEl.setAttribute('rotation',currentCameraRotation.x*-10+' '+currentCameraRotation.y*-10+' 0');
            }.bind(this),1000);


        }


    },

    setTargetRotationSmoothed: function(){

        const rotation = this.el.getAttribute('rotation');

        //sample current camera rotation
        this.rotationSamples.push([Math.round(Number(rotation.x) * 100) / 100,Math.round(Number(rotation.y) * 100) / 100]);

        //only allow a max of 10 samples in array
        if(this.rotationSamples.length > this.data.smoothing){
            this.rotationSamples.splice(0, 1);
        }

        //console.log(this.rotationSamplesX,this.rotationSamplesY);

        if(this.rotationSamples.length === this.data.smoothing && this.rotationSamples.length === this.data.smoothing){
            const smooth = Smooth(this.rotationSamples,{
                method: Smooth.METHOD_CUBIC,
                clip: Smooth.CLIP_PERIODIC,
                cubicTension: Smooth.CUBIC_TENSION_CATMULL_ROM
            });

            const coords = smooth(1);

            //console.log(coords);

            //console.log('x: '+(Math.round(this.lastRotation.x * 10) / 10)+' x2: '+(Math.round(coords[0] * 10) / 10));

            if(Math.round(this.lastRotation.x * 50) / 50 !== Math.round(coords[0] * 50) / 50 && Math.round(this.lastRotation.y * 50) / 50 !== Math.round(coords[1] * 50) / 50){
                this.targetEl.setAttribute('rotation',Number(coords[0])*-10+' '+Number(coords[1])*-10+' 0');

            }

            this.lastRotation = {
                x: coords[0],
                y: coords[1]
            };


        }


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