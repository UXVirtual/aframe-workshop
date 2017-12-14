AFRAME.registerComponent('rectangular-portal', {
    schema: {
        width: {type: 'float', default: 0.5},
        height: {type: 'float', default: 1}
    },

    init: function () {
        var el = this.el;
        var data = this.data;
        el.addEventListener('loaded', function () {
            el.setAttribute('geometry', {primitive: 'plane', width: data.width, height: data.height });
        });
    }
});