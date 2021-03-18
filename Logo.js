
class Sketch {
	constructor() {
		this.renderer = new THREE.WebGLRenderer({
			alpha: true
		});
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor(0xFFFFFF, 1);
		document.body.appendChild( this.renderer.domElement )
		
		this.camera = new THREE.PerspectiveCamera(
			45,
			window.innerWidth / window.innerHeight,
			1,
			1000
		);
		
		this.camera.position.z = 60;
		
		this.scene = new THREE.Scene();
		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
		this.controls.target = new THREE.Vector3(0, 2, 0);
		this.clock = new THREE.Clock();
		this.mixer1;
		this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
	}
	
	init() {
		const loader = new THREE.GLTFLoader();
		
	    this.directionalLight.position.set(0.5, 5, 5)
	    this.directionalLight.castShadow = true
	    this.directionalLight.shadow.mapSize.width = 1024
	    this.directionalLight.shadow.mapSize.height = 1024
	    this.directionalLight.shadow.camera.near = 5

	    this.scene.add(this.directionalLight)
		this.scene.add( new THREE.HemisphereLight( 0xffffff, 0x000000, 0.9 ) );
		
		// Load a glTF resource
		loader.load(
			// resource URL
			'./models/sci-fi_girl_v.02_walkcycle_test/scene.gltf',
			// called when the resource is loaded
			function ( gltf ) {
				const model = gltf.scene;
				model.scale.set( 1, 1, 1 );
				// model.traverse( function ( child ) {
				// 
				// 		if ( child.isMesh ) child.material.envMap = envMap;
				// 
				// 	} );
				// 
				sketch.scene.add( model );
				sketch.mixer1 = new THREE.AnimationMixer( model );
				sketch.mixer1.clipAction( gltf.animations[ 0 ] ).play();
				
				
				sketch.animate();
			},
			// called while loading is progressing
			function ( xhr ) {
				
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
				
			},
			// called when loading has errors
			function ( error ) {
				
				console.log( 'An error happened' );
				console.log(error);
				
			}
		);
		
		
		
	}
	
	
	animate() {
		requestAnimationFrame(this.animate.bind(this));
		const delta = this.clock.getDelta();
		this.mixer1.update( delta );
		this.render();
	}
	
	render() {
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
	}
	
	addEvents() {
		window.addEventListener("resize", this.resize.bind(this));
	}
	
	resize() {
		let width = window.innerWidth;
		let height = window.innerHeight;
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(width, height);
	}
}

var sketch = new Sketch();
sketch.init();