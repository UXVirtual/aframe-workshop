/*

    Original component by Dirk Krause from http://curious-electric.com/aframe/component-miniPlanet/

 */
AFRAME.registerComponent('planet', {
    schema: {
        radius: {type: 'number', default: 6.0},
        noiseFactor: {type: 'number', default: 2.75},
        seed: {type: 'number', default: +(new Date())},
    },

    init: function(data) {
        console.log("yay3, planets!");

        // via MIT
        // http://unlockcampus.org/code/tutoring/threejs-pixel-earth

        // begin @clindsey variables
        var textureSize = 64; // must be 2's compliment
        var segmentIterations = 2; // tesselates a faces into domains, increasing variation
        var textureIterations = 2; // tesselates domains, increasing number of steps between colors
        var geometryIterations = 2; // icosahedron face count, try to keep this as low as possible
        var noiseFactor = 2.75; // smaller values are boring, bigger are happening
        var geometryRadius = 7;
        // console.log(this.data.seed);
        // var simplex = new SimplexNoise(new alea(+(new Date()))); // 5625463739
        var simplex = new SimplexNoise(new alea(this.data.seed)); // 5625463739

        planetMesh = this.buildMesh(simplex, segmentIterations, textureIterations, geometryIterations, textureSize, geometryRadius, noiseFactor);
        // end @clindsey variables

    },

    update: function () {
        var data = this.data;
        var el = this.el;

        var mesh = this.el.getOrCreateObject3D('mesh', THREE.Mesh);




        circle = mesh;
        // circle = new THREE.Object3D();
        // particle = new THREE.Object3D();
        // halo = new THREE.Object3D();

        // scene.add(circle);
        // scene.add(particle);
        // scene.add(halo);

        var geometry = new THREE.TetrahedronGeometry(1, 1);
        var geom3 = new THREE.SphereGeometry(12, 32, 16);

        //   var material = new THREE.MeshPhongMaterial({
        //     color: 0x777777,
        //     shading: THREE.FlatShading
        //   });
        //
        //  for (var i = 0; i < 500; i++) {
        //     var mesh = new THREE.Mesh(geometry, material);
        //     mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        //     mesh.position.multiplyScalar( 200 + (Math.random() * 500));
        //     mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
        //     particle.add(mesh);
        //   }

        var mat = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shading: THREE.FlatShading
        });

        var mat3 = new THREE.ShaderMaterial({
            uniforms: {},
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragmentShader').textContent,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        var planet = planetMesh;
        console.log(this.data.radius);
        planet.scale.x = planet.scale.y = planet.scale.z = this.data.radius;
        circle.add(planet);

        // var ball = new THREE.Mesh(geom3, mat3);
        // ball.scale.x = ball.scale.y = ball.scale.z = 16;
        // halo.position.x=100;
        // halo.add(ball);
        //
        // var ambientLight = new THREE.AmbientLight(0x999999);
        // scene.add(ambientLight);
        //
        // var lights = [];
        // lights[0] = new THREE.DirectionalLight(0xffffff, 1);
        // lights[0].position.set(1, 0, 0);
        // lights[1] = new THREE.DirectionalLight(0x15374F, 1);
        // lights[1].position.set(0.75, 1, 0.5);
        // lights[2] = new THREE.DirectionalLight(0x000C1C, 1);
        // lights[2].position.set(-0.75, -1, 0.5);
        // scene.add(lights[0]);
        // scene.add(lights[1]);
        // scene.add(lights[2]);




        el.setObject3D('mesh', circle);

        // console.log(this.el.sceneEl.object3D.children)

    },

    tick: function (time, timeDelta) {
    },


    // begin @clindsey code
    buildMesh: function (simplex, segmentIterations, textureIterations, geometryIterations, textureSize, radius, factor) {
        var geometry = new THREE.IcosahedronGeometry(radius, geometryIterations);
        var materials = [];
        var pointsUp = GeoGenTextures.buildPoints(3, Math.PI * 1.5);
        var vec0 = pointsUp[0].map(function(i) {
            return 0.5 - i / 2;
        });
        var vec1 = pointsUp[1].map(function(i) {
            return 0.5 - i / 2;
        });
        var vec2 = pointsUp[2].map(function(i) {
            return 0.5 - i / 2;
        });
        var that = this;
        geometry.faceVertexUvs[0] = geometry.faces.map(function(face, index) {
            geometry.faces[index].materialIndex = index;
            var a = geometry.faces[index].a;
            var b = geometry.faces[index].b;
            var c = geometry.faces[index].c;
            var material = that.createMaterial(textureIterations, segmentIterations, a, b, c, geometry.vertices, radius * 2, simplex, textureSize, factor);
            materials.push(material);
            return [
                new THREE.Vector2(vec0[0], vec0[1]),
                new THREE.Vector2(vec1[0], vec1[1]),
                new THREE.Vector2(vec2[0], vec2[1])
            ];
        });
        geometry.computeFaceNormals();
        geometry.dynamic = true;
        geometry.uvsNeedUpdate = true;
        return new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
    },

    colorPicker: function (vertices, order, colorLookup, radius, simplex, f) {
        return function(factors) {
            var xyz = factors.map(function(factor, i) {
                return ([
                    factor * vertices[order[i]].x,
                    factor * vertices[order[i]].y,
                    factor * vertices[order[i]].z
                ]);
            }).reduce(function(pXYZ, cXYZ) {
                return [
                    pXYZ[0] + cXYZ[0],
                    pXYZ[1] + cXYZ[1],
                    pXYZ[2] + cXYZ[2]
                ];
            }, [0, 0, 0]);
            var fX = Math.round((xyz[0] / radius) * 1000000) / 1000000;
            var fY = Math.round((xyz[1] / radius) * 1000000) / 1000000;
            var fZ = Math.round((xyz[2] / radius) * 1000000) / 1000000;
            return colorLookup((simplex.noise3D(fX * f, fY * f, fZ * f) + 1) / 2);
        }
    },

    createMaterial: function (textureIterations, segmentIterations, a, b, c, vertices, radius, simplex, textureSize, factor) { // refactor, use better variable names than `a, b, c`
        var order = [b, a, c]; // refactor, bad variable name
        var mapColorPicker = this.colorPicker(vertices, order, this.mapColorLookup, radius, simplex, factor);
        var specularColorPicker = this.colorPicker(vertices, order, this.specularColorLookup, radius, simplex, factor);
        var bumpColorPicker = this.colorPicker(vertices, order, this.bumpColorLookup, radius, simplex, factor);
        var material = new THREE.MeshPhongMaterial({
            map: new THREE.Texture(GeoGenTextures.createNestedTile(textureSize, textureSize, segmentIterations, textureIterations, mapColorPicker, true)),
            specularMap: new THREE.Texture(GeoGenTextures.createNestedTile(textureSize, textureSize, segmentIterations, textureIterations, specularColorPicker, true)),
            specular: new THREE.Color(0x222222),
            side: THREE.DoubleSide,
            bumpMap: new THREE.Texture(GeoGenTextures.createNestedTile(textureSize, textureSize, segmentIterations, textureIterations, bumpColorPicker, true)),
            bumpScale: 2,
            wireframe: false
        });
        material.map.needsUpdate = true;
        material.bumpMap.needsUpdate = true;
        material.specularMap.needsUpdate = true;
        return material;
    },

    textureTemplateColorPicker: function (height) {
        if (height < 0.3) {
            return '000000';
        }
        if (height < 0.42) {
            return '333333';
        }
        if (height < 0.55) {
            return '666666';
        }
        if (height < 0.7) {
            return '999999';
        }
        return 'cccccc';
    },

    mapColorLookup: function (height) {
        if (height < 0.3) {
            return '2988ae';
        }
        if (height < 0.42) {
            return '309ec0';
        }
        if (height < 0.55) {
            return 'c2b26f';
        }
        if (height < 0.7) {
            return '009e00';
        }
        return '008800';
    },

    bumpColorLookup: function (height) {
        if (height < 0.42) {
            return '333333';
        }
        if (height < 0.55) {
            return '666666';
        }
        if (height < 0.7) {
            return 'cccccc';
        }
        return 'ffffff';
    },

    specularColorLookup: function (height) {
        if (height < 0.42) {
            return 'ffffff';
        }
        return '000000';
    }


});
