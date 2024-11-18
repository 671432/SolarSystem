"use strict";

import { Scene, PerspectiveCamera, PlaneGeometry, Mesh, MeshPhongMaterial, CubeTextureLoader, 
    TextureLoader, SphereGeometry, Color, AmbientLight, DirectionalLight, Vector3, Vector2, RepeatWrapping, } from "../build/three.module.js";
import { SolarSystem } from "./SolarSystem.js";
import { WASDMovement } from "./WASDMovement.js";
import { OrbitControls } from "../build/OrbitControls.js";


export class MoonWalk {
    constructor(renderer) {
        this.renderer = renderer;

        // Create the MoonWalk scene
        this.scene = new Scene();
        
        const loader = new CubeTextureLoader();

        const skyboxMoon = loader.load([
            'assets/skybox/right.png',
            'assets/skybox/left.png',
            'assets/skybox/top.png',
            'assets/skybox/bottom.png',
            'assets/skybox/front.png',
            'assets/skybox/back.png'
        ]);

        this.scene.background = skyboxMoon;

        let sunRadius = 5;
        let widthSegments = 64;
        let heightSegments = 64;

        // Create the camera
        const fov = 75;
        const near = 0.1;
        const far = 500;
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(0, 2, 0); // Start above the surface

        const camera = new PerspectiveCamera(fov, aspect, near, far);

        const mouse = new Vector2();

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; 
        controls.dampingFactor = 0.05; 
        controls.screenSpacePanning = false; 
        controls.minDistance = 0; 
        controls.maxDistance = 100; 
        controls.maxPolarAngle = Math.PI;

        document.addEventListener('mousemove', onMouseMove, false);
        
        function onMouseMove(event) {

            // Convert mouse position to normalized device coordinates
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
   
        }

        // Add WASD movement
        this.movementControls = new WASDMovement(this.camera, 0.2);

        // Add a textured moon surface
        const moonTexture = new TextureLoader().load("assets/moonSurface.png");
        moonTexture.wrapS = RepeatWrapping;
        moonTexture.wrapT = RepeatWrapping;
        moonTexture.repeat.set(10, 10); // Scale the texture for better detail

        const moonSurface = new Mesh(
            new PlaneGeometry(500, 500),
            new MeshPhongMaterial({
                map: moonTexture,
                bumpMap: moonTexture,
                bumpScale: 0.1,
            })
        );
        moonSurface.rotation.x = -Math.PI / 2; // Rotate to lie flat
        this.scene.add(moonSurface);

       // Add this function to your scene code
        function createSphericalBody({
            radius = 5, widthSegments = 64, heightSegments = 64,
            assetUrl = undefined,
            color = new Color(0xFFFFFF),
            MaterialType = MeshPhongMaterial,
            shininess = 0,
            normalMapUrl = undefined,
            specularMapUrl = undefined
        }) {
            const textureLoader = new TextureLoader();

            let geometry = new SphereGeometry(radius, widthSegments, heightSegments);

            let texture = assetUrl ? textureLoader.load(assetUrl) : null;
            let nMap = normalMapUrl ? textureLoader.load(normalMapUrl) : null;
            let specMap = specularMapUrl ? textureLoader.load(specularMapUrl) : null;

            let material = new MaterialType({
                map: texture,
                color: color,
                shininess: shininess,
                normalMap: nMap,
                specularMap: specMap,
                specular: new Color(0x777777),
                normalScale: new Vector2(10, 10)
            });

            return new Mesh(geometry, material);
        }

        // create earth
        const earth = createSphericalBody({
            radius: 10,
            widthSegments: 64,
            heightSegments: 64,
            assetUrl: 'assets/texture_earth.jpg',
            MaterialType: MeshPhongMaterial,
            shininess: 10,
            specularMapUrl: 'assets/earthspec1k.jpg',
            normalMapUrl: 'assets/2k_earth_normal_map.png'
        });
        // Position Earth in the sky
        earth.position.set(0, 50, -100);
        // Add Earth to the scene
        this.scene.add(earth);

        // create earth
        const sun = createSphericalBody({
            radius: 10,
            widthSegments: 64,
            heightSegments: 64,
            assetUrl: 'assets/texture_sun.jpg',
            MaterialType: MeshPhongMaterial,
            //shininess: 10,
        });
        // Position Earth in the sky
        sun.position.set(100, 100, 0);
        // Add Earth to the scene
        this.scene.add(sun);

        // Add ambient lighting
        const ambientLight = new AmbientLight(0xffffff, 0.4); // Soft light
        this.scene.add(ambientLight);

        // Add directional light (simulating the Sun's light)
        const directionalLight = new DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 100, 50);
        this.scene.add(directionalLight);

        // Resize handling
        window.addEventListener("resize", () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate() {
        // Simulate movement and animations
        this.movementControls.update();
    }

    render() {
        this.animate();
        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        this.movementControls.dispose();
    }
    
}
