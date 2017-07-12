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

        this.gridEl = document.querySelector('#grid');

        this.defaultGridMaterial = this.gridEl.getAttribute('material');
        this.defaultGridTexture = this.gridEl.getAttribute('src');

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

        //disable effects if debug mode is enabled in the scene as they are incompatible with the inspector
        if(this.sceneEl.hasAttribute('debug')){
            this.removeEffects();
        }

        this.initModals();
    },

    isPortrait: function(){
        return (window.matchMedia("(orientation: portrait)").matches);
    },

    isLandscape: function(){
        return (window.matchMedia("(orientation: landscape)").matches);
    },

    /*updateModals: function(viewport){

        if(this.isPortrait()){
            $('.instructions__description').addClass('col-xs-offset-1').addClass('col-xs-9').removeClass('col-xs-10');
        }

        if(this.isLandscape()){
            $('.instructions__description').removeClass('col-xs-offset-1').removeClass('col-xs-9').addClass('col-xs-10');
        }

        // Executes only in XS breakpoint
        if(viewport.is('xs')) {
            // ...

        }

        // Executes in SM, MD and LG breakpoints
        if(viewport.is('>=sm')) {
            // ...
            $('.instructions__description').removeClass('col-xs-offset-1').removeClass('col-xs-9').addClass('col-xs-10');
        }

        // Executes in XS and SM breakpoints
        if(viewport.is('<md')) {
            // ...
        }
    },*/

    initModals: function(){

        var $modal;

        if(AFRAME.utils.device.isMobile()) {
            $modal = $('#mobile-instructions-modal');
            $modal.modal();
            $modal.on('hidden.bs.modal', function (e) {
                this.sceneEl.setAttribute('vr-mode-ui','enabled',true);
            }.bind(this));
        }else{
            $modal = $('#desktop-instructions-modal');
            $modal.modal();
        }



        this.$originalModal = $modal.clone();

        //wait for inspector to open / close
        setInterval(this.onInspector.bind(this),1000);

        /*(function($, viewport){
            $(document).ready(function() {

                //this.updateModals(viewport);



                //$(window).bind("orientationchange", function() {
                //    this.updateModals(viewport);
                //}.bind(this), false);

                //$(window).bind("resize", function() {
                    //viewport.changed(function() {
                //        this.updateModals(viewport);
                    //}.bind(this))
                //}.bind(this),false);

            }.bind(this));
        }.bind(this))(jQuery, ResponsiveBootstrapToolkit);*/
    },

    onEnterVR: function(){
        console.log('Entered VR');

        this.removeScanlines();

        this.addAlternateControls();

        if(AFRAME.utils.device.isMobile()){
            this.setLQParticules();
            this.setAlternateGridMaterial();
            this.setLQModel();
        }


    },

    onExitVR: function(){
        console.log('Exited VR');

        this.removeAlternateControls();
        this.addScanlines();
        this.setDefaultGridMaterial();
        this.setDefaultParticles();
        this.setDefaultModel();
    },

    setAlternateGridMaterial: function(){
        //this.gridEl.setAttribute('material','opacity',1);
        //this.gridEl.setAttribute('material','transparent',false);
        this.gridEl.setAttribute('visible',false);
        //this.gridEl.setAttribute('src','#grid-opaque-img');
    },

    setDefaultGridMaterial: function(){
        this.gridEl.setAttribute('material',this.defaultGridMaterial);
        this.gridEl.setAttribute('src',this.defaultGridTexture);
        this.gridEl.setAttribute('visible',true);
    },

    removeEffects: function(){

        //window.AFRAME.Effects.remove();

        this.sceneEl.setAttribute('effects','');
        //this.sceneEl.removeAttribute('bloom');
        //this.sceneEl.removeAttribute('film');
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
        this.particlesEl.setAttribute('particle-system','maxParticleCount',1);
        this.particlesEl.components['particle-system'].particleGroup.emitters[0].disable();
        /*if(this.particlesEl){
            this.particlesEl.parentNode.removeChild(this.particlesEl);
        }*/

    },

    setDefaultParticles: function(){
        this.particlesEl.components['particle-system'].particleGroup.emitters[0].enable();
        this.particlesEl.setAttribute('particle-system',this.defaultParticlesAttr);
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
            this.cameraEl.setAttribute('position','0 0.5 2.5'); //TODO: camera position must be set in orbit component as it will overwrite any other value set

        }.bind(this),250);
    },

    removeAlternateControls: function(){

        console.log('Removing alternate controls');

        //this.modelEl.setAttribute('sound',this.defaultModelSound);

        //this.cameraEl.setAttribute('orbit-controls',this.defaultOrbitControls);
        this.cameraEl.removeAttribute('look-controls-entity-rotator');
        setTimeout(function() {
            this.modelEl.setAttribute('rotation', this.defaultModelRotation);
            this.cameraEl.setAttribute('rotation', this.defaultCameraRotation);
            this.cameraEl.setAttribute('position', this.defaultCameraPosition);
        }.bind(this));

    },

    // Other handlers and methods.

    onInspector: function() {

        console.log('Inspector opened');

        /*if(this.sceneEl.getAttribute('inspector')){
            this.removeEffects();
        }*/

        if(typeof AFRAME.INSPECTOR !== 'undefined' && AFRAME.INSPECTOR.opened){



            if(this.lastInspectorState !== 'opened'){

                console.log('Removed modals');
                $('.instructions-modal').remove();
                this.lastInspectorState = 'opened';
                var hs = document.querySelectorAll('link[rel=stylesheet]');
                for (var i = 0, max = hs.length; i < max - 1; i++) {
                    hs[i].parentNode.removeChild(hs[i]);
                }
            }

        }else{
            if(this.lastInspectorState !== 'closed'){

                this.addScanlines();

                /*var $body = $('body');

                var hs = document.querySelectorAll('style');
                for (var i = 0, max = hs.length; i < max - 1; i++) {
                    hs[i].parentNode.removeChild(hs[i]);
                }
                $body.append(this.$originalModal);
                this.$modal = $('.instructions-modal');*/
                this.lastInspectorState = 'closed';

            }

        }
    },

    tick: function (t, dt) {

    }
});

