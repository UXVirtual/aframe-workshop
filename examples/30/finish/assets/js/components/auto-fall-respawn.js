AFRAME.registerComponent('auto-fall-respawn', {
    schema: {
        fallHeight: {type: 'int', default: -50},
        respawnPosition: {type: 'vec3', default: {x: 0, y: 20, z: 0}},
        respawnRotation: {type: 'vec3', default: {x: 0, y: 0, z: 0}}
    },

    originalPhysicsType: '',

    init: function() {

        var physicsType = this.getPhysicsType();

        if(physicsType !== 'none'){
            this.originalPhysicsType = this.el.getAttribute(physicsType);
        }
    },

    tick: function() {

        var position = this.el.object3D.position;

        //console.log(position.y,this.data.fallHeight);

        if(position.y < this.data.fallHeight){

            var physicsType = this.getPhysicsType();

            if(physicsType === 'dynamic-body' || physicsType === 'kinematic-body'){
                this.el.removeAttribute(physicsType);
                setTimeout(function(){
                    this.el.setAttribute(physicsType,this.originalPhysicsType);
                }.bind(this),250);
            }

            this.el.setAttribute('position',this.data.respawnPosition);
            this.el.object3D.rotation.x = this.de2ra(this.data.respawnRotation.x);
            this.el.object3D.rotation.y = this.de2ra(this.data.respawnRotation.y);
            this.el.object3D.rotation.z = this.de2ra(this.data.respawnRotation.z);

            this.el.emit('respawned');
        }
    },

    getPhysicsType: function(){
        var physicsType = '';

        if(this.el.hasAttribute('kinematic-body')){
            physicsType = 'kinematic-body';
        }else if(this.el.hasAttribute('dynamic-body')){
            physicsType = 'dynamic-body';
        }else{
            physicsType = 'none';
        }

        return physicsType;
    },

    de2ra: function(degree) {
        return degree*(Math.PI/180);
    }
});