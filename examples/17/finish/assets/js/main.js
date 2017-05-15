AFRAME.registerSystem('main', {
    schema: {},  // System schema. Parses into `this.data`.

    init: function () {
        // Called on scene initialization.
        //do stuff here after scene initializes

        var self = this;

        var scene = document.querySelector('a-scene');
        var camera = document.querySelector('[camera]');

        camera.addEventListener('fusing',function(){
           console.log('Fusing...');
        });

        var checkpoint1 = document.querySelector('#checkpoint1');
        var checkpoint2 = document.querySelector('#checkpoint2');
        var checkpoint3 = document.querySelector('#checkpoint3');

        //wait for scene to be loaded before accessing objects
        scene.addEventListener('loaded',function(){
            self.disableParticles();
        });

        checkpoint1.addEventListener('click',self.onCheckpointClick.bind(this));
        checkpoint2.addEventListener('click',self.onCheckpointClick.bind(this));
        checkpoint3.addEventListener('click',self.onCheckpointClick.bind(this));
    },

    onCheckpointClick: function(e){

        var targetEl = e.detail.target;
        var targetElClass = targetEl.getAttribute('class');
        var self = this;

        if(targetElClass === 'hotspot'){
            var teleportSoundEmitter = document.querySelector('#teleport-sound-emitter');

            self.enableParticles();

            setTimeout(function(){
                self.disableParticles();
            },500);

            teleportSoundEmitter.components.sound.playSound();
        }
    },

    disableParticles: function(){
        var teleportParticles = document.querySelector('#teleport-particles');
        teleportParticles.components['particle-system'].particleGroup.emitters[0].disable();
    },

    enableParticles: function(){
        var teleportParticles = document.querySelector('#teleport-particles');
        var particleGroup = teleportParticles.components['particle-system'].particleGroup;
        particleGroup.emitters[0].enable();
    },

    tick: function (t, dt) {


    }
});

