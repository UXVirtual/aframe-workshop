/**
 * Wrapper for shaders / post-processing used in three.js skin material shader demo
 * @author Michael Andrew (michael@uxvirtual.com)
 * Source: https://threejs.org/examples/webgl_materials_skin.html
 */
AFRAME.registerComponent('material-skin', {
    schema: {
        color: {type: 'color', default: '#bbbbbb'},
        specular: {type: 'color', default: '#555555'},
        src: {type: 'asset', required: true},
        normalSrc: {type: 'asset', required: true}
    },

    firstPass: true,

    init: function () {

        this.scene = this.el.sceneEl.object3D;

        this.el.sceneEl.addEventListener('render-target-loaded', function(){
            this.el.sceneEl.addEventListener('renderstart', function(){
                this.camera = document.querySelector('[camera]').object3D.children[0];
                this.initShader();
            }.bind(this));
        }.bind(this));


    },

    initShader: function () {
        const data = this.data;

        var renderer = this.el.sceneEl.renderer;

        var shader = THREE.ShaderSkin[ "skin" ];

        this.uniformsUV = THREE.UniformsUtils.clone( shader.uniforms );

        var textureLoader = new THREE.TextureLoader();

        this.uniformsUV[ "tNormal" ].value = textureLoader.load( data.normalSrc );
        this.uniformsUV[ "uNormalScale" ].value = -1.5;

        this.uniformsUV[ "tDiffuse" ].value = textureLoader.load( data.src );

        this.uniformsUV[ "passID" ].value = 0;

        this.uniformsUV[ "diffuse" ].value.setStyle( data.color );
        this.uniformsUV[ "specular" ].value.setStyle( data.specular );

        this.uniformsUV[ "uRoughness" ].value = 0.185;
        this.uniformsUV[ "uSpecularBrightness" ].value = 0.7;


        this.uniforms = THREE.UniformsUtils.clone( this.uniformsUV );
        this.uniforms[ "tDiffuse" ].value = this.uniformsUV[ "tDiffuse" ].value;
        this.uniforms[ "tNormal" ].value = this.uniformsUV[ "tNormal" ].value;
        this.uniforms[ "passID" ].value = 1;


        var parameters = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: this.uniforms, lights: true };
        var parametersUV = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShaderUV, uniforms: this.uniformsUV, lights: true };

        var material = new THREE.ShaderMaterial( parameters );
        material.extensions.derivatives = true;

        var materialUV = new THREE.ShaderMaterial( parametersUV );
        materialUV.extensions.derivatives = true;


        var renderModelUV = new THREE.RenderPass( this.scene, this.camera, materialUV, new THREE.Color( 0x575757 ) );

        var effectCopy = new THREE.ShaderPass( THREE.CopyShader );

        var effectBloom1 = new THREE.BloomPass( 1, 15, 2, 512 );
        var effectBloom2 = new THREE.BloomPass( 1, 25, 3, 512 );
        var effectBloom3 = new THREE.BloomPass( 1, 25, 4, 512 );

        effectBloom1.clear = true;
        effectBloom2.clear = true;
        effectBloom3.clear = true;

        effectCopy.renderToScreen = true;

        //

        var pars = {
            minFilter: THREE.LinearMipmapLinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBFormat,
            stencilBuffer: false
        };

        var rtwidth = 512;
        var rtheight = 512;

        //

        this.composer = new THREE.EffectComposer( renderer, new THREE.WebGLRenderTarget( rtwidth, rtheight, pars ) );
        this.composer.addPass( renderModelUV );

        var renderScene = new THREE.TexturePass( this.composer.renderTarget2.texture );

        //

        this.composerUV1 = new THREE.EffectComposer( renderer, new THREE.WebGLRenderTarget( rtwidth, rtheight, pars ) );

        this.composerUV1.addPass( renderScene );
        this.composerUV1.addPass( effectBloom1 );

        this.composerUV2 = new THREE.EffectComposer( renderer, new THREE.WebGLRenderTarget( rtwidth, rtheight, pars ) );

        this.composerUV2.addPass( renderScene );
        this.composerUV2.addPass( effectBloom2 );

        this.composerUV3 = new THREE.EffectComposer( renderer, new THREE.WebGLRenderTarget( rtwidth, rtheight, pars ) );

        this.composerUV3.addPass( renderScene );
        this.composerUV3.addPass( effectBloom3 );

        //

        var effectBeckmann = new THREE.ShaderPass( THREE.ShaderSkin[ "beckmann" ] );
        this.composerBeckmann = new THREE.EffectComposer( renderer, new THREE.WebGLRenderTarget( rtwidth, rtheight, pars ) );
        this.composerBeckmann.addPass( effectBeckmann );

        //

        this.uniforms[ "tBlur1" ].value = this.composer.renderTarget2.texture;
        this.uniforms[ "tBlur2" ].value = this.composerUV1.renderTarget2.texture;
        this.uniforms[ "tBlur3" ].value = this.composerUV2.renderTarget2.texture;
        this.uniforms[ "tBlur4" ].value = this.composerUV3.renderTarget2.texture;

        this.uniforms[ "tBeckmann" ].value = this.composerBeckmann.renderTarget1.texture;


        this.material  = material;
        this.applyToMesh();
        this.el.addEventListener('model-loaded', () => this.applyToMesh());
    },

    /**
     * Update the ShaderMaterial when component data changes.
     */
    update: function () {

        if(this.uniformsUV){
            this.uniformsUV[ "diffuse" ].value.setStyle( this.data.color );
            this.uniformsUV[ "specular" ].value.setStyle( this.data.specular );
        }


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

        if(this.composerBeckmann){
            if ( this.firstPass ) {

                //creates wet / shininess map on model during the first pass
                this.composerBeckmann.render();
                this.firstPass = false;
            }
        }

        if(this.composer){
            this.composer.render();
        }

        if(this.composerUV1){
            this.composerUV1.render();
        }

        if(this.composerUV2){
            this.composerUV2.render();
        }

        if(this.composerUV3){
            this.composerUV3.render();
        }




        //this.material.uniforms.time.value = t / 1000;
    }

})