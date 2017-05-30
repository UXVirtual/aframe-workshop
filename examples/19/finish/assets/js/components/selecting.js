AFRAME.registerComponent('selecting', {
    init: function () {
        this.oldColor = this.el.getAttribute('material').color;
        this.el.setAttribute('material','color','#4F4');
    },
    remove: function () {
        if (!this.oldColor) { return; }
        this.el.setAttribute('material', 'color', this.oldColor);
    }
});