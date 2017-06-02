
// Define custom schema for syncing avatar color, set by random-color
var avatarSchema = {
    template: '#avatar-template',
    components: [
        'position',
        'rotation',
        {
            selector: '.head',
            component: 'material'
        }
    ]
};
NAF.schemas.add(avatarSchema);

function randomPointOnCircle(radius, angleRad) {
    x = Math.cos(angleRad)*radius;
    y = Math.sin(angleRad)*radius;
    return {x: x, y: y};
}

// Called by Networked-Aframe when connected to server
function onConnect(e) {

    // Get random angle
    var angleRad = Math.random()*Math.PI*2;

    // Get position around a circle
    var position = randomPointOnCircle(3, angleRad);
    var positionStr = position.x + ' 1.3 ' + position.y;

    // Get rotation towards center of circle
    var angleDeg = angleRad * 180 / Math.PI;
    var angleToCenter = -1 * angleDeg + 90;
    var rotationStr = '0 ' + angleToCenter + ' 0';

    // Create avatar with this position and rotation
    NAF.entities.createAvatar('#avatar-template', positionStr, rotationStr);
    NAF.connection.isConnected();
}

AFRAME.registerSystem('main', {
    schema: {},  // System schema. Parses into `this.data`.
    init: function () {
        // Called on scene initialization.

        //do stuff here after scene initializes

        var self = this;

        function checkConnected() {
            return new Promise(function (resolve, reject) {
                (function waitForConnection(){
                    console.log('Waiting for connection...');
                    if (NAF.connection.isConnected()) return resolve();
                    setTimeout(waitForConnection, 500);
                })();
            });
        }

        checkConnected(function(){
            console.log('Connected to server. Can begin') ;
            self.beginNetwork();
        },function(e){
            console.log('An error ocurred',e);
        });

        var scene = document.querySelector('a-scene');

        scene.addEventListener('loaded',function(){

            var cursor = document.querySelector('#cursor');
            var blockHand = document.querySelector('#blockHand');

            // On mobile remove elements that are resource heavy
            var isMobile = AFRAME.utils.device.isMobile();
            var isGearVR = AFRAME.utils.device.isGearVR();
            if (isMobile || isGearVR) {
                var $particles = $('#particles');
                $particles.remove();
                var $cursorMenu = $('#cursor-menu');
                if($cursorMenu.length > 0){
                    $cursorMenu.remove();
                }


            }else{
                //fuse only works on mobile as desktop supports click events

                cursor.setAttribute('cursor', 'fuse', false);
            }

            cursor.addEventListener('spawnEvent',self.onBlockSpawned);

            self.disableTeleportParticles();

            var camera = document.querySelector('#camera');

            camera.addEventListener('fusing',function(){
                console.log('Fusing...');
            });

            var checkpoint1 = document.querySelector('#checkpoint1');
            var checkpoint2 = document.querySelector('#checkpoint2');
            var checkpoint3 = document.querySelector('#checkpoint3');

            //TODO dynamically select checkpoints by class then apply listener to all
            checkpoint1.addEventListener('click',self.onCheckpointClick.bind(this));
            checkpoint2.addEventListener('click',self.onCheckpointClick.bind(this));
            checkpoint3.addEventListener('click',self.onCheckpointClick.bind(this));
            checkpoint4.addEventListener('click',self.onCheckpointClick.bind(this));
            checkpoint5.addEventListener('click',self.onCheckpointClick.bind(this));


            var handMenu = document.querySelector('#hand-menu');
            var cursorMenu = document.querySelector('#cursor-menu');


            //TODO: remove cursorMenu if vive controls are available

            //TODO: remove hand controls if vive controls are not available

            if(cursorMenu){
                document.addEventListener("mousewheel", function(e){
                    // cross-browser wheel delta
                    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

                    //console.log('Mousewheel ',delta);

                    if(delta > 0){
                        cursorMenu.components['select-bar'].onOptionPrevious();
                    }else{
                        cursorMenu.components['select-bar'].onOptionNext();
                    }

                    cursor.setAttribute('intersection-spawn-multi','currenttemplate',cursorMenu.components['select-bar'].selectedOptionValue);

                }, false);
            }



            if(handMenu){
                handMenu.addEventListener("menuSelected",function(){
                    blockHand.setAttribute('intersection-spawn-multi','currenttemplate',handMenu.components['select-bar'].selectedOptionValue);
                });
            }



        }.bind(this));
    },

    beginNetwork: function() {
        console.log('Beginning network functionality...');
    },

    onBlockSpawned: function(e){
        var target = e.detail.target;

        var blockSoundEmitter = document.querySelector('#block-sound-emitter');

        var soundArray = ['#pop1-sound','#pop2-sound','#pop3-sound','#pop4-sound','#pop5-sound','#pop6-sound','#pop7-sound'];
        var randomKey = Math.floor(Math.random() * (soundArray.length - 1 + 1)) + 0;

        blockSoundEmitter.setAttribute('sound','src',soundArray[randomKey]);

        blockSoundEmitter.components.sound.playSound();
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


    }
    // Other handlers and methods.
});

