const vertexShader = [
    'varying vec2 vUv;',
    'void main() {',
    '    vUv = uv;',
    '    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
    '}'
].join('\n');
const fragmentShader = [
    'varying vec2 vUv;',
    'uniform vec3 color;',
    'uniform float time;',
    'void main() {',
    '    // Use sin(time), which curves between 0 and 1 over time,',
    '    // to determine the mix of two colors:',
    '    //    (a) Dynamic color where "R" and "B" channels come',
    '    //        from a modulus of the UV coordinates.',
    '    //    (b) Base color.',
    '    // ',
    '    // The color itself is a vec4 containing RGBA values 0-1.',
    '    gl_FragColor = mix(',
    '        vec4(mod(vUv , 0.05) * 20.0, 1.0, 1.0),',
    '        vec4(color, 1.0),',
    '       sin(time)',
    '    );',
    '}'
].join('\n');

AFRAME.registerComponent('material-grid-glitch', {
    schema: {color: {type: 'color'}},
    /**
     * Creates a new THREE.ShaderMaterial using the two shaders defined
     * in vertex.glsl and fragment.glsl.
     */
    init: function () {
        const data = this.data;

        this.material  = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                color: { value: new THREE.Color(data.color) }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });
        this.applyToMesh();
        this.el.addEventListener('model-loaded', () => this.applyToMesh());
    },
    /**
     * Update the ShaderMaterial when component data changes.
     */
    update: function () {
        this.material.uniforms.color.value.set(this.data.color);
    },

    /**
     * Apply the material to the current entity.
     */
    applyToMesh: function() {
        const mesh = this.el.getObject3D('mesh');
        if (mesh) {
            mesh.material = this.material;
        }
    },
    /**
     * On each frame, update the 'time' uniform in the shaders.
     */
    tick: function (t) {
        this.material.uniforms.time.value = t / 1000;
    }

})