AFRAME.registerComponent('clickbait', {
    dependencies: ['clickable'],

    init: function () {
        var el = this.el;
        el.addEventListener('mouseenter', function (evt) {
            console.log('mouseenter ' + JSON.stringify(evt.target.getAttribute('position')));
            evt.target.removeAttribute('selected');
            evt.target.setAttribute('selecting', '');
        });

        el.addEventListener('mouseleave', function (evt) {
            console.log('mouseleave ' + JSON.stringify(evt.target.getAttribute('position')));
            evt.target.removeAttribute('selecting');
            evt.target.removeAttribute('selected');
        });

        el.addEventListener('click', function (evt) {
            console.log('click ' + JSON.stringify(evt.target.getAttribute('position')));
            evt.target.removeAttribute('selecting');
            evt.target.setAttribute('selected', '');
        });
    }
});