AFRAME.registerSystem('main', {
    schema: {},  // System schema. Parses into `this.data`.

    init: function () {

        var sceneEl = document.querySelector('a-scene');

        console.log('el: ',sceneEl);

        sceneEl.addEventListener('renderstart',function(){

            console.log('Ready');


            //mess binaries can be downloaded from: https://archive.org/details/emularity_engine_jsmame

            //list of popular MAME games on IA: https://archive.org/details/internetarcade

            //local ROM
            /*var emulator = new Emulator(document.querySelector("#fullscreen"),
                {
                    before_emulator: function(){
                        console.log('On before emulator callback');
                    },
                    before_run: this.onBeforeRun
                },
                new JSMAMELoader(JSMAMELoader.driver("bublbobl"),
                    JSMAMELoader.nativeResolution(256, 256),
                    JSMAMELoader.emulatorJS("assets/js/emularity/emulators/jsmess/mamebublbobl.js.gz"), //bios files can be downloaded from https://archive.org/download/emularity_engine_v1/
                    JSMAMELoader.mountFile("bublbobl.zip",
                        JSMAMELoader.fetchFile("Game File",
                            "assets/js/emularity/emulators/jsmess/bublbobl.zip")),
                    JSMAMELoader.mountFile("bublbobl.cfg", //config files can be downloaded from https://archive.org/download/jsmess_config_v2/
                        JSMAMELoader.fetchFile("Config File",
                            "assets/js/emularity/emulators/configs/bublbobl.cfg"))
                )
            );*/

            //Z80 based games tend to work better

            //configs downloadable from https://archive.org/download/emularity_config_v1

            var emulator = new IALoader(document.querySelector("#fullscreen"),
                "arcade_monsterb",
                {
                    before_emulator: function(){
                        console.log('On before emulator callback');
                    },
                    before_run: this.onBeforeRun
                }
            );
            emulator.setScale(1);
            emulator.setConfig
            emulator.start({ waitAfterDownloading: false });

            var scWidgetEl = document.querySelector('#sc-widget');


            var rnd = Math.floor(Math.random() * 9) + 0;

            scWidgetEl.setAttribute('src','https://w.soundcloud.com/player/?url=https://api.soundcloud.com/playlists/349520772&color=ff5500&start_track='+rnd+'&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=false');

            var scWidget = SC.Widget(scWidgetEl);

            scWidget.bind(SC.Widget.Events.READY, function() {
                console.log('Soundcloud player widget ready');
                scWidget.play();
                scWidget.setVolume(20);
            });
        }.bind(this));



    },

    onBeforeRun: function(){
        console.log('On before run callback');
        var screenEl = document.querySelector('#area-light2');
        console.log('screenEL',screenEl);
        screenEl.setAttribute('material','shader','draw'); //switch from the gif material shader to the emulator canvas shader
    },

    tick: function (t, dt) {


    }
});


