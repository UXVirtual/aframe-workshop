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

1.  Open a terminal and run the following from the project folder: `npm start`

2.  Access [http://localhost:3000](http://localhost:3000) or [http://YOUR_IP:3000](http://YOUR_IP:3000) where `YOUR_IP`
    is the IP address of your computer on your network.

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
