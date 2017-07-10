AFRAME.registerSystem('main', {
    schema: {},  // System schema. Parses into `this.data`.
    init: function () {
        // Called on scene initialization.

        //do stuff here after scene initializes

        this.lastInspectorState = 'closed';

        var self = this;

        this.cameraEl = document.querySelector('#camera');

        this.defaultOrbitControls = this.cameraEl.getAttribute('orbit-controls');
        this.defaultCameraPosition = this.cameraEl.getAttribute('position');
        this.defaultCameraRotation = this.cameraEl.getAttribute('rotation');

        this.particlesEl = document.querySelector('#particles');

        this.defaultParticlesAttr = this.particlesEl.getAttribute('particle-system');


        this.sceneEl = document.querySelector('a-scene');

        this.modelEl = document.querySelector('#model');
        this.defaultModel = this.modelEl.getAttribute('obj-model');
        this.defaultModelSound = this.modelEl.getAttribute('sound');

        this.defaultModelRotation = this.modelEl.getAttribute('rotation');

        var rotating = false;

        this.cameraEl.addEventListener('click',function(e){

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

        this.addAlternateControls();

        if(AFRAME.utils.device.isMobile()){
            this.setLQParticules();
            this.setLQModel();
        }


    },

    onExitVR: function(){
        console.log('Exited VR');

        this.removeAlternateControls();
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
        this.particlesEl.components['particle-system'].particleGroup.emitters[0].disable();
        /*if(this.particlesEl){
            this.particlesEl.parentNode.removeChild(this.particlesEl);
        }*/

    },

    setDefaultParticles: function(){

        this.particlesEl.components['particle-system'].particleGroup.emitters[0].enable();
        //this.particlesEl.setAttribute('particle-system',this.defaultParticlesAttr);
    },

    setDefaultModel: function(){
        this.modelEl.setAttribute('obj-model',this.defaultModel);
    },

    setLQModel: function(){
        this.modelEl.setAttribute('obj-model','obj: #foetus-lq-obj');
    },

    addAlternateControls: function(){

        console.log('Adding alternate controls');

        //this.modelEl.setAttribute('sound','positional',false);
        //this.modelEl.setAttribute('sound','volume',1);

        //this.cameraEl.removeAttribute('orbit-controls');

        setTimeout(function(){
            console.log('Resetting camera position');
            this.cameraEl.setAttribute('look-controls-entity-rotator','target:#model');
            this.cameraEl.setAttribute('rotation','0 0 0');
            this.cameraEl.setAttribute('position','0 -0.2 2.5'); //TODO: camera position must be set in orbit component as it will overwrite any other value set

        }.bind(this),250);
    },

    removeAlternateControls: function(){

        console.log('Removing alternate controls');

        //this.modelEl.setAttribute('sound',this.defaultModelSound);

        //this.cameraEl.setAttribute('orbit-controls',this.defaultOrbitControls);
        this.cameraEl.removeAttribute('look-controls-entity-rotator');
        /*setTimeout(function() {
            this.modelEl.setAttribute('rotation', this.defaultModelRotation);
            this.cameraEl.setAttribute('rotation', this.defaultCameraRotation);
            this.cameraEl.setAttribute('position', this.defaultCameraPosition);
        });*/

    },

    tick: function (t, dt) {



    }
});

