/**
 * Spawn entity at the intersection point on click, given the properties passed.
 *
 * `<a-entity intersection-spawn-multi="mixin: box; material.color: red">` will spawn
 * `<a-entity mixin="box" material="color: red">` at intersection point.
 */
AFRAME.registerComponent('intersection-spawn-multi', {
  dependencies: ['position'],
  schema: {
    templates: {
      type: 'array',
      required: true
    },
    offset: {type: 'vec3', default: {x: 0.25, y: 0.25, z: 0.25}},
    snap: {type: 'vec3', default: {x: 0.5, y: 0.5, z: 0.5}}
  },

  init: function () {
    const data = this.data;
    const el = this.el;

    for(var i = 0; i < data.templates.length; i++){

      var templateSchema = {
        template: data.templates[i],
        components: [
          'position'
        ]
      };
      NAF.schemas.add(templateSchema);
    }

    NAF.options.compressSyncPackets = true;
    NAF.options.updateRate = 1;

    el.addEventListener(data.event, function(evt){

      var worldPos = evt.detail.intersection.point;
      const pos = AFRAME.utils.clone(worldPos);

      pos.x   = Math.floor(pos.x / data.snap.x) * data.snap.x + data.offset.x;
      pos.y = Math.floor(pos.y / data.snap.y) * data.snap.y+ data.offset.y;
      pos.z = Math.floor(pos.z / data.snap.z) * data.snap.z + data.offset.z;

      var randomInt = Math.floor(Math.random() * (data.templates.length - 1 + 1)) + 0;
      var spawnEl = NAF.entities.createNetworkEntity(data.templates[randomInt], pos, '0 0 0');
      NAF.utils.whenEntityLoaded(spawnEl, function() {});
    });
  }
});
