AFRAME.registerSystem('main', {
    schema: {},  // System schema. Parses into `this.data`.
    init: function () {
        // Called on scene initialization.

        //do stuff here after scene initializes

        this.lastInspectorState = 'closed';

        var self = this;

        this.camera = document.querySelector('#camera');

        this.particlesEl = document.querySelector('#particles');

        this.defaultParticlesAttr = this.particlesEl.getAttribute('particle-system');


        this.sceneEl = document.querySelector('a-scene');

        this.modelEl = document.querySelector('#model');
        this.defaultModel = this.modelEl.getAttribute('obj-model');

        var rotating = false;

        this.camera.addEventListener('click',function(e){

            var targetEl = e.detail.target;

            var targetElClass = targetEl.getAttribute('class');

            if(targetElClass === 'hotspot'){

                if(!rotating){

                }
            }
        });

        this.sceneEl.addEventListener('enter-vr',this.onEnterVR.bind(this));
        this.sceneEl.addEventListener('exit-vr',this.onExitVR.bind(this));

    },

    onEnterVR: function(){
        console.log('Entered VR');

        this.removeScanlines();

        if(AFRAME.utils.device.isMobile()){
            this.setLQParticules();
            this.setLQModel();
        }


    },

    onExitVR: function(){
        console.log('Exited VR');

        this.addScanlines();
        this.setDefaultParticles();
        this.setDefaultModel();
    },

    addScanlines: function(){
        //this.sceneEl.setAttribute('film','speed:0.01; nIntensity:1; sIntensity:0.95; sCount: 1024');
        this.sceneEl.setAttribute('effects','bloom,film');
    },

    removeScanlines: function(){
        //this.sceneEl.setAttribute('film','speed:0; nIntensity:0; sIntensity:0; sCount: 0');
        this.sceneEl.setAttribute('effects','bloom');
    },

    setLQParticules: function(){
        //this.particlesEl.setAttribute('particle-system','maxParticleCount',16);

        this.particlesEl.parentNode.removeChild(this.particlesEl);
    },

    setDefaultParticles: function(){

        this.particlesEl.setAttribute('particle-system',this.defaultParticlesAttr);
    },

    setDefaultModel: function(){
        this.modelEl.setAttribute('obj-model',this.defaultModel);
    },

    setLQModel: function(){
        this.modelEl.setAttribute('obj-model','obj: #foetus-lq-obj');
    },

    tick: function (t, dt) {



    }
});

