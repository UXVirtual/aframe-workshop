AFRAME.registerComponent('entity-movement-controls', {
    init: function () {

        var data = this.data;

        this.cactus = document.querySelector('a-entity#cactus');

        this.tweens = {};

        this.moving = false;

        var self = this;

        $(document).keydown(function(e) {

            //find keycodes here: http://keycode.info/

            //don't do anything if already moving
            if(self.moving){
                return;
            }

            switch(e.which) {
                case 74: // left
                    console.log('left');
                    // Create a tween
                    self.moveEntity(self.cactus,'left');
                    break;

                case 73: // up
                    console.log('up');
                    self.moveEntity(self.cactus,'up');
                    break;

                case 76: // right
                    console.log('right');
                    self.moveEntity(self.cactus,'right');
                    break;

                case 75: // down
                    console.log('down');
                    self.moveEntity(self.cactus,'down');
                    break;

                default: return; // exit this handler for other keys
            }
            e.preventDefault(); // prevent the default action (scroll / move caret)
        });

    },

    /**
     * Move Entity
     * @param entity A-Frame entity to move
     * @param dir (string) Direction to move. Valid values are 'left', 'right', 'up' 'down'
     */
    moveEntity: function (entity,dir) {

        var data = this.data;

        var object3D = entity.object3D;

        var pos = object3D.position;

        var self = this;

        self.moving = true;

        entity.components['collada-animation-mixer'].stopAnim();

        entity.components['collada-animation-mixer'].playAnim();

        if(this.tweens[entity.attributes.id+'_tween']){
            this.tweens[entity.attributes.id+'_tween'].stop();
        }
        if(this.tweens[entity.attributes.id+'_tween2']){
            this.tweens[entity.attributes.id+'_tween2'].stop();
        }
        if(this.tweens[entity.attributes.id+'_tween3']){
            this.tweens[entity.attributes.id+'_tween3'].stop();
        }

        //TWEEN reference: https://github.com/tweenjs/tween.js/blob/master/docs/user_guide.md

        var tween = this.tweens[entity.attributes.id+'_tween'] = new TWEEN.Tween(pos);

        switch(dir){
            case 'left':
                tween.to({ x: pos.x-1 }, data.moveDuration);
                break;
            case 'right':
                tween.to({ x: pos.x+1 }, data.moveDuration);
                break;
            case 'up':
                tween.to({ z: pos.z-1 }, data.moveDuration);
                break;
            case 'down':
                tween.to({ z: pos.z+1 }, data.moveDuration);
                break;
        }

        tween.easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function() {

                var pos = object3D.position;

                pos.x = this.x;
                pos.z = this.z;

            })
            .onComplete(function(){
                self.el.dispatchEvent(new CustomEvent('animation-complete'));
                self.moving = false;
            })
            .start();

        pos = object3D.position;

        self.tweens[entity.attributes.id+'_tween2'] = new TWEEN.Tween(pos)
            .to({ y: pos.y+1 }, data.jumpDuration)
            .delay(data.jumpDelay)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(function() {

                var pos = object3D.position;
                pos.y = this.y;

            })
            .onComplete(function(){
                self.tweens[entity.attributes.id+'_tween3'] = new TWEEN.Tween(pos)
                    .to({ y: pos.y-1 }, data.jumpDuration)
                    .easing(TWEEN.Easing.Quadratic.In)
                    .onUpdate(function() {

                        var pos = object3D.position;
                        pos.y = this.y;

                    })
                    .start();
            })
            .start();

    },


    tick: function (t, dt) {
        THREE.AnimationHandler.update( dt / 1000 );
    },

    schema: {
        moveDuration: {type: 'int', default: 1750},
        jumpDuration: {type: 'int', default: 500},
        jumpDelay: {type: 'int', default: 750}
    },

    multiple: true
});