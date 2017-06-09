AFRAME.registerComponent('checkpoint-manager', {
    schema: {
        checkpointClass: {type: 'string'},
        checkpoints: {type: 'string',
            parse: function (value) {
                var trimmed = value.toString().trim();

                console.log(trimmed);
                return JSON.parse(trimmed);
            }
        },
        teleportSoundAsset: {type: 'asset'},
        teleportParticleSpritePath: {type: 'string'},
        checkpointContainerEl: {type: 'selector'},
        particleAnimationLength: {type: 'int', default: 500}
    },
    init: function () {

        this.sceneEl = document.querySelector('a-scene');
        this.soundEl = null;
        this.particleEl = null;
        this.cameraEl = null;
        this.cursorEl = null;

        var self = this;

        this.sceneEl.addEventListener('loaded',function(){

            this.cursorEl = document.querySelector('[cursor]');
            this.cameraEl = document.querySelector('[camera]');

            //this.disableTeleportParticles();

            this.cameraEl.addEventListener('fusing',function(){
                console.log('Fusing...');
            });

            console.log('Checkpoints: ',this.data.checkpoints);

            for(var i in this.data.checkpoints){
                console.log(this.data.checkpoints[i]);

                var checkpointEl = document.createElement('a-entity');

                checkpointEl.setAttribute('look-at', '[camera]');
                checkpointEl.setAttribute('id', 'checkpoint'+i);
                checkpointEl.setAttribute('checkpoint', 'offset', '0 '+this.cameraEl.getAttribute('camera').userHeight+' 0');
                checkpointEl.setAttribute('position', this.data.checkpoints[i].position);
                checkpointEl.setAttribute('auto-scale', {
                    target: '[camera]',
                    size: 1
                });

                //TODO: check how attributes are coming through so we can correctly set additional attributes on checkpoint like physics

                //set any extra checkpoint attributes
                var checkpointAttrs = this.data.checkpoints[i].attributes;
                for(var a in checkpointAttrs){
                    if (checkpointAttrs.hasOwnProperty(a)) {
                        checkpointEl.setAttribute('a', checkpointAttrs[a]);
                    }

                }


                var cylinderEl = document.createElement('a-cylinder');
                cylinderEl.setAttribute('class','checkpoint');
                cylinderEl.setAttribute('rotation','-90 0 0');
                cylinderEl.setAttribute('radius',0.05);
                cylinderEl.setAttribute('height',0);
                cylinderEl.setAttribute('color','#ff0000');
                cylinderEl.setAttribute('material','shader','flat');
                cylinderEl.setAttribute('position','0 0.1 0');

                var planeEl = document.createElement('a-plane');
                planeEl.setAttribute('class','checkpoint');
                planeEl.setAttribute('color','#ff0000');
                planeEl.setAttribute('height',0.2);
                planeEl.setAttribute('width',0.01);
                planeEl.setAttribute('rotation','0 0 0');
                planeEl.setAttribute('material','shader','flat');

                checkpointEl.appendChild(cylinderEl);
                checkpointEl.appendChild(planeEl);

                checkpointEl.addEventListener('click',this.onCheckpointClick.bind(this));

                if(this.data.checkpointContainerEl){
                    this.data.checkpointContainerEl.appendChild(checkpointEl);
                }else{
                    this.sceneEl.appendChild(checkpointEl);
                }

                /*
                <a-entity id="checkpoint1" look-at="#camera" checkpoint="offset: 0 1.6 0" position="-5.990244099867345 0 -9.661835401782431" auto-scale="target: #camera; size: 1; static: false">
                    <a-cylinder class="checkpoint" rotation="-90 0 0" radius="0.05" height="0" color="#ff0000" material="shader: flat" position="0 0.1 0"></a-cylinder>
                    <a-plane class="checkpoint" color="#ff0000" height="0.2" width="0.01" rotation="0 0 0" material="shader: flat"></a-plane>
                </a-entity>
                */
            }

            this.initSoundEmitter();
            this.initParticles();

            setTimeout(function(){
                self.disableParticles();
            },500);





            /*

             <a-entity id="teleport-particles" position="0 0 -0.2" particle-system="blending: 1; texture: assets/img/particles/swirl_white.png; preset: default; type: 1; particleCount: 30; color: #ff0000; randomize: true; opacity: 1; velocityValue: 0 5 0; size: 0.2"></a-entity>


             */



        }.bind(this));

    },
    tick: function (time, timeDelta) {

    },
    remove: function () {

    },
    pause: function () {

    },
    play: function () {

    },
    update: function () {

    },
    onCheckpointClick: function(e){

        console.log('clicked');

        var targetEl = e.detail.target;
        var targetElClass = targetEl.getAttribute('class');

        var self = this;

        if(targetElClass === 'checkpoint'){

            this.enableParticles();

            setTimeout(function(){
                self.disableParticles();
            },this.data.particleAnimationLength);

            this.soundEl.components.sound.playSound();
        }
    },

    initSoundEmitter: function(){
        this.soundEl = document.createElement('a-entity');
        this.soundEl.setAttribute('id','teleport-sound-emitter');
        this.soundEl.setAttribute('sound',{
            src: '#teleport-sound',
            autoplay: false,
            loop: false
        });
        this.soundEl.setAttribute('position','0 0 -1');

        this.cameraEl.appendChild(this.soundEl);
    },

    initParticles: function(){
        this.particleEl = document.createElement('a-entity');
        this.particleEl.setAttribute('id','teleport-particles');
        this.particleEl.setAttribute('position','0 0 -0.2');
        this.particleEl.setAttribute('particle-system',{
            blending: 1,
            texture: 'url('+this.data.teleportParticleSpritePath+')', //workaround as particle system cannot load from a cached asset
            preset: 'default',
            type: 1,
            particleCount: 30,
            color: '#ff0000',
            randomize: true,
            opacity: 1,
            velocityValue: '0 5 0',
            size: 0.2
        });


        this.cameraEl.appendChild(this.particleEl);
    },

    disableParticles: function(){

        console.log('particleel: ',this.particleEl);

        this.particleEl.components['particle-system'].particleGroup.emitters[0].disable();
    },

    enableParticles: function(){
        var particleGroup = this.particleEl.components['particle-system'].particleGroup;
        particleGroup.emitters[0].enable();
    }
});