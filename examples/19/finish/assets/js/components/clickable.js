AFRAME.registerComponent('clickable', {
    init: function () { this.el.classList.add('clickable'); },
    remove: function () { this.el.classList.remove('clickable'); }
});