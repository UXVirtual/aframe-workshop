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
        smoothing: {type: 'int', default: 100}
    },

    /**
     * Set if component needs multiple instancing.
     */
    multiple: false,

    tickCount: 0,

    rotationSamples: [],
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
        this.setTargetRotation(t);

        //this.setTargetRotationSmoothed();
    },

    setTargetRotation: function(t){

        if(this.tickCount < 10){
            this.tickCount++;
        }else{
            this.tickCount = 0;
            const rotation = this.el.getAttribute('rotation');
            this.targetEl.setAttribute('rotation',rotation.x*-10+' '+rotation.y*-10+' 0');
        }


    },

    setTargetRotationSmoothed: function(){

        const rotation = this.el.getAttribute('rotation');

        //sample current camera rotation
        this.rotationSamples.push([Number(rotation.x),Number(rotation.y)]);

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

            this.targetEl.setAttribute('rotation',Number(coords[0])*-10+' '+Number(coords[1])*-10+' 0');
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