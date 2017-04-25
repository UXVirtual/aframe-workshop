/**
 * Spawn entity at the intersection point on click, given the properties passed.
 *
 * `<a-entity intersection-spawn="mixin: box; material.color: red">` will spawn
 * `<a-entity mixin="box" material="color: red">` at intersection point.
 */
AFRAME.registerComponent('intersection-spawn-multi', {
  dependencies: ['position'],
  schema: {
    default: '',
    parse: AFRAME.utils.styleParser.parse,
    template: { type: 'string', required: true },
    offset: {type: 'vector3'},
    snap: {type: 'vector3'}
  },

  init: function () {
    const data = this.data;
    const el = this.el;
    const self = this;
      this.originalPos = this.el.getAttribute('position');

    var templateSchema = {
      template: data.template,
      components: [
        'position',
      ]
    };
    NAF.schemas.add(templateSchema);

    NAF.options.compressSyncPackets = true;
    NAF.options.updateRate = 1;

    el.addEventListener(data.event, function(evt){
      // Create element.

      var worldPos = evt.detail.intersection.point;

      const pos = AFRAME.utils.clone(worldPos);

      pos.x   = Math.floor(pos.x / 0.5) * 0.5 + 0.25;
      pos.y = Math.floor(pos.y / 0.5) * 0.5 + 0.25;
      pos.z = Math.floor(pos.z / 0.5) * 0.5 + 0.25;

      var spawnEl = NAF.entities.createNetworkEntity("#voxel-template", pos, '0 0 0');
      NAF.utils.whenEntityLoaded(spawnEl, function() {

      });
    });
  }
});
