# A-Frame Workshop

Example files for an A-Frame workshop [http://hazardu5.github.io/aframe-workshop](http://hazardu5.github.io/aframe-workshop)

## Getting Started

1.  Clone this repository into a project folder on your computer.

2.  Install [node.js](https://nodejs.org/en/)

3.  Open a terminal and run the following from the project folder:

    ```
    npm install
    ```

## Development

1.  Open a terminal and run the following from the project folder:

    ```
    npm start
    ```

    or

    ```
    npm run serve
    ```

2.  Access [http://localhost:3000](http://localhost:3000) or [http://YOUR_IP:3000](http://YOUR_IP:3000) where `YOUR_IP`
    is the IP address of your computer on your network.

### Running HTTPS server

Optionally, you can run a local HTTPS server to test WebRTC or native WebVR functionality. These APIs are not usually available for non-secure origins.

1.  Run the following command to generate a self-signed SSL cert.

    ```
    npm run generate-cert
    ```

2.  Run the following to launch the https server:

    ```
    npm run serve-https
    ```

3.  A browser window will automatically launch with the default index page. Optionally, you can access the server via
    [https://localhost:3000](https://localhost:3000) or [https://YOUR_IP:3000](https://YOUR_IP:3000) where `YOUR_IP` is
    the IP address of your computer on your network.

    You may be presented with a warning before viewing the apge. You can safely ignore this.

### Converting OBJ to Draco

#### Installing Draco Converter

1.  Install Git

2.  Install XCode

3.  Run the following command from the project folder:

    ```
    cd bin
    git clone https://github.com/google/draco.git
    ```

4.  Follow the [build instructions](https://github.com/google/draco#building) for Draco OR if on OSX follow these instructions:

    *   Run the following commands:

        ```
        cd draco
        cmake ./ -G Xcode
        open draco.xcodeproj
        ```
    *   When XCode opens go to *Product -> Build*

#### Running Draco Converter

*   Run the following command:

    ```
    npm run obj2drc -- -i PATH_TO_OBJ -o OUTPUT_PATH
    ```

    Where `PATH_TO_OBJ` is the path to your obj file to convert, and `OUTPUT_PATH` is the path where the converted drc
    file will be written.

### Optimising Images

*   Run the following command:

    ```
    npm run imagemin PATH_TO_IMAGES OUTPUT_PATH
    ```

    where `PATH_TO_IMAGES` is the path to the image or images you wish to convert e.g. `images/*.{jpg,png}` and
    `OUTPUT_PATH` is the output folder you wish to save the converted images to (images will be saved with the same
    source filenames)

### Optimising Models

*   Models should be compressed using gzip. Your web server and client should automatically pass and accept the correct
    headers to decode the gzipped model. Use the following command

    ```
    gzip PATH_TO_MODEL
    ```

    This will remove the source model and place a `.gz` file in its place. Reference this compressed `.gz` file in your
    code instead of the original model.