AFRAME.registerSystem('main', {
    schema: {},  // System schema. Parses into `this.data`.

    init: function () {
        // Called on scene initialization.
        //do stuff here after scene initializes

        var self = this;

        var camera = document.querySelector('[camera]');

        camera.addEventListener('fusing',function(){
           console.log('Fusing...');
        });

        var checkpoint1 = document.querySelector('#checkpoint1');
        var checkpoint2 = document.querySelector('#checkpoint2');
        var checkpoint3 = document.querySelector('#checkpoint3');

        checkpoint1.addEventListener('click',self.onCheckpointClick);
        checkpoint2.addEventListener('click',self.onCheckpointClick);
        checkpoint3.addEventListener('click',self.onCheckpointClick);

    },

    onCheckpointClick: function(e){

        var targetEl = e.detail.target;

        var targetElClass = targetEl.getAttribute('class');

        if(targetElClass === 'hotspot'){
            var teleportSoundEmitter = document.querySelector('#teleport-sound-emitter');
            var teleportParticles = document.querySelector('#teleport-particles');
            teleportParticles.setAttribute('visible',true);
            setTimeout(function(){
                teleportParticles.setAttribute('visible',false);
            },500);

            teleportSoundEmitter.components.sound.playSound();
        }
    },

    tick: function (t, dt) {


    }
});

