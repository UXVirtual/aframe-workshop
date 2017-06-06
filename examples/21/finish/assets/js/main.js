AFRAME.registerSystem('main', {
    schema: {},  // System schema. Parses into `this.data`.
    init: function () {
        // Called on scene initialization.

        //do stuff here after scene initializes

        var self = this;

        var scene = document.querySelector('a-scene');

        scene.addEventListener('loaded',function(){

            var cursor = document.querySelector('#cursor');
            self.camera = document.querySelector('#camera');

            // On mobile remove elements that are resource heavy
            var isMobile = AFRAME.utils.device.isMobile();
            var isGearVR = AFRAME.utils.device.isGearVR();
            if (!isMobile && !isGearVR) {
                //fuse only works on mobile as desktop supports click events
                cursor.setAttribute('cursor', 'fuse', false);
            }

            self.disableTeleportParticles();

            var camera = document.querySelector('#camera');

            camera.addEventListener('fusing',function(){
                console.log('Fusing...');
            });

            var checkpoint1 = document.querySelector('#checkpoint1');
            var checkpoint2 = document.querySelector('#checkpoint2');
            var checkpoint3 = document.querySelector('#checkpoint3');
            var checkpoint5 = document.querySelector('#checkpoint5');
            var checkpoint6 = document.querySelector('#checkpoint6');

            //TODO dynamically select checkpoints by class then apply listener to all
            checkpoint1.addEventListener('click',self.onCheckpointClick.bind(this));
            checkpoint2.addEventListener('click',self.onCheckpointClick.bind(this));
            checkpoint3.addEventListener('click',self.onCheckpointClick.bind(this));
            checkpoint5.addEventListener('click',self.onCheckpointClick.bind(this));
            checkpoint6.addEventListener('click',self.onCheckpointClick.bind(this));


        }.bind(this));
    },

    onCheckpointClick: function(e){

        var targetEl = e.detail.target;
        var targetElClass = targetEl.getAttribute('class');
        var self = this;

        if(targetElClass === 'checkpoint'){
            var teleportSoundEmitter = document.querySelector('#teleport-sound-emitter');

            self.enableTeleportParticles();

            setTimeout(function(){
                self.disableTeleportParticles();
            },500);

            teleportSoundEmitter.components.sound.playSound();
        }
    },

    disableTeleportParticles: function(){
        var teleportParticles = document.querySelector('#teleport-particles');
        teleportParticles.components['particle-system'].particleGroup.emitters[0].disable();
    },

    enableTeleportParticles: function(){
        var teleportParticles = document.querySelector('#teleport-particles');
        var particleGroup = teleportParticles.components['particle-system'].particleGroup;
        particleGroup.emitters[0].enable();
    },

    tick: function (t, dt) {
        //console.log(self.camera.getAttribute('position'));

    }
    // Other handlers and methods.
});

