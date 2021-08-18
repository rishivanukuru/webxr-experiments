import * as THREE from '../../../libs/three/three.module.js';
import { OrbitControls } from '../../../libs/three/jsm/OrbitControls.js';
import { Stats } from '../../../libs/stats.module.js';
import { ARButton } from '../../../libs/ARButton.js';
import { GLTFLoader } from '../../../libs/three/jsm/GLTFLoader.js';
import { LoadingBar } from '../../../libs/LoadingBar.js';

class App{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
        
        this.clock = new THREE.Clock();
        
		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );
		
		this.scene = new THREE.Scene();
       
		this.scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

        const light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 ).normalize();
		this.scene.add( light );
			
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
		container.appendChild( this.renderer.domElement );
        
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.target.set(0, 3.5, 0);
        this.controls.update();
        
        this.loadingBar = new LoadingBar();


        // this.stats = new Stats();
        
        this.initScene();
        this.setupVR();
        
        window.addEventListener('resize', this.resize.bind(this) );
	}	
    


    initScene(){
        
        this.loadGLTF();

        this.geometry = new THREE.BoxBufferGeometry( 0.06, 0.06, 0.06 ); 
        this.meshes = [];
        this.cakes = [];

    }


    loadGLTF(){
        const loader = new GLTFLoader( ).setPath('../../../assets/');
        const self = this;
		
		// Load a glTF resource
		loader.load(
			// resource URL
			'cake.glb',
			// called when the resource is loaded
			function ( gltf ) {
                
                gltf.scene.traverse( ( child ) => {
                    if (child.isMesh){
                        child.material.metalness = 0.2;
                    }
                })
                self.cake = gltf.scene;

                //self.cake.scale = [0.01,0.01,0.01];
				self.scene.add( self.cake );
                
                self.loadingBar.visible = false;
				
            },
			// called while loading is progressing
			function ( xhr ) {

				self.loadingBar.progress = (xhr.loaded / xhr.total);
				
			},
			// called when loading has errors
			function ( error ) {

				console.log( 'An error happened' );

			}  
        );
    }
    
    
    
    setupVR(){
        this.renderer.xr.enabled = true; 
        
        const self = this;
        

        const btn = new ARButton( this.renderer );
        
        
        this.renderer.setAnimationLoop( this.render.bind(this) );
    }
    
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
	render( ) {   
        //this.stats.update();
        //this.cakes.forEach( (cake) => { cake.rotateY( 0.01 ); });
        this.renderer.render( this.scene, this.camera );
    }
}

export { App };