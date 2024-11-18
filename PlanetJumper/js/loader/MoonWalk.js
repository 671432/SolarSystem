"use strict";

import { Scene, PerspectiveCamera, PlaneGeometry, Mesh, MeshPhongMaterial, 
    TextureLoader, AmbientLight, DirectionalLight, Vector3, RepeatWrapping, } from "../build/three.module.js";
import { WASDMovement } from "./WASDMovement.js";

export class MoonWalk {
    constructor(renderer) {
        this.renderer = renderer;

        // Create the MoonWalk scene
        this.scene = new Scene();

        // Create the camera
        const fov = 75;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 0.1;
        const far = 500;
        this.camera = new PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(0, 2, 0); // Start above the surface

        // Add WASD movement
        this.movementControls = new WASDMovement(this.camera, 0.2);

        // Add a textured moon surface
        const moonTexture = new TextureLoader().load("assets/moon_surface.jpg");
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

        // Add Earth in the sky
        const earthTexture = new TextureLoader().load("assets/texture_earth.jpg");
        const earth = new Mesh(
            new PlaneGeometry(20, 20),
            new MeshPhongMaterial({ map: earthTexture })
        );
        earth.position.set(0, 50, -100); // Position the Earth in the sky
        this.scene.add(earth);

        // Add Sun in the sky
        const sunTexture = new TextureLoader().load("assets/texture_sun.jpg");
        const sun = new Mesh(
            new PlaneGeometry(40, 40),
            new MeshPhongMaterial({ map: sunTexture })
        );
        sun.position.set(100, 100, 0); // Position the Sun
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
