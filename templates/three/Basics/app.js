// IMPORTS
import * as THREE from '../../../libs/three/three.module.js';
import { OrbitControls } from '../../../libs/three/jsm/OrbitControls.js';
import { GLTFLoader } from '../../../libs/three/jsm/GLTFLoader.js';


// Tip: Make sure the file paths are referencing the correct folders.
// '../' means one folder above the current one.

class App{
	constructor(){
		
        // Creates a div and appends it to the document.
        const container = document.createElement( 'div' );
		document.body.appendChild( container );

        // SCENE
		
        // Create a new scene and add to this app. 
        this.scene = new THREE.Scene();

        // Set scene background to be a hex value.
        // 0x is the prefix used to denote hex values.
        this.scene.background = new THREE.Color( 0xaaaaaa );

        // LIGHTS

        // Create an ambient light.
        // The two colors indicate the light colors applied to surfaces facing the top and the bottom of the scene (sky and ground colors)
        // The last value is the intensity of the light.
		const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.3);
		// Add the ambient light to the scene.
        this.scene.add(ambient);
        
        // Create a directional light.
        // Unless another target is specified, directional lights point from their position to the origin.
        const light = new THREE.DirectionalLight();        
        // Set the position of the light.
        light.position.set( 0.2, 1, 1);
        // Add the directional light to the scene.
        this.scene.add(light);

        // OBJECTS

        // Create a box geometry.
        // Buffered geometries are better for XR app performance.
        const geometry = new THREE.BoxBufferGeometry();

        // Create a new material, with the given color.
        const material = new THREE.MeshStandardMaterial( { color: 0xFF0000 });

        // Generate a mesh using the geometry and the material.
        this.mesh = new THREE.Mesh( geometry, material );      
        
        // Add the mesh to the scene.
        this.scene.add(this.mesh);

        // Instantiate a loader
        const loader = new GLTFLoader();


        var MainScene = this.scene;

        // Load a glTF resource
        loader.load(
	        // resource URL
	        '../../../assets/scene.gltf',
	        // called when the resource is loaded
	        function ( gltf ) {

		        MainScene.add( gltf.scene );

		        gltf.animations; // Array<THREE.AnimationClip>
		        gltf.scene; // THREE.Group
		        gltf.scenes; // Array<THREE.Group>
		        gltf.cameras; // Array<THREE.Camera>
		        gltf.asset; // Object

	        },
	            // called while loading is progressing
	            function ( xhr ) {

		        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	        },
	        // called when loading has errors
	        function ( error ) {

		        console.log( 'An error happened' );

	        }
        );


        // CAMERA

        // Create a new Perspective Camera.
        // Field of View, Aspect Ratio, Near Clipping Plane, Far Clipping Plane
        this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 100 );
		
        // Set the position of the camera.
        this.camera.position.set( 0, 0, 4 );
        
		// RENDERER
        
        // Create a new WebGL Renderer.
        // Set antialias as true to avoid jagged edges.
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
		// Set the appropriate pixel ratio to avoid blurring across devices.
        this.renderer.setPixelRatio( window.devicePixelRatio );
        // Make the renderer occupy the whole screen.
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        // Add the renderer to the div, to surface it on the webpage.
		container.appendChild( this.renderer.domElement );
        
        // Activate Orbit Controls to control how you view the scene.
        const controls = new OrbitControls( this.camera, this.renderer.domElement );
        
        // Sets an animation loop bound to the scene.
        this.renderer.setAnimationLoop(this.render.bind(this));
            
        window.addEventListener('resize', this.resize.bind(this) );
	}	
    
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
	render( ) {   
        this.mesh.rotateY( 0.01 );
        this.renderer.render( this.scene, this.camera );
    }
}

export { App };