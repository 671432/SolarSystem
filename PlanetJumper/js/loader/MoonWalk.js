import {
    Scene,
    PerspectiveCamera,
    PlaneGeometry,
    Mesh,
    MeshStandardMaterial,
    TextureLoader,
    AmbientLight,
    DirectionalLight,
    RepeatWrapping,
    WebGLRenderer,
} from '../lib/three.module.js';;
import { WASDMovement } from './WASDMovement.js';

export class MoonWalk {
    constructor(renderer) {
        this.renderer = renderer;
        this.scene = new Scene();

        // Camera setup
        const fov = 75;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 0.1;
        const far = 500;
        this.camera = new PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(0, 5, 0);

        // Movement controls
        this.movementControls = new WASDMovement(this.camera, 0.2);

        // Load textures
        const textureLoader = new TextureLoader();
        const moonTexture = textureLoader.load('/assets/moonWalkAssets/TextureColor.jpg');
        const heightMap = textureLoader.load('/assets/moonWalkAssets/TextureDisplacement.jpg');

        moonTexture.wrapS = RepeatWrapping;
        moonTexture.wrapT = RepeatWrapping;
        moonTexture.repeat.set(10, 10);

        // Create Moon surface
        const moonGeometry = new PlaneGeometry(500, 500, 256, 256);
        const moonMaterial = new MeshStandardMaterial({
            map: moonTexture,
            displacementMap: heightMap,
            displacementScale: 10,
            bumpMap: moonTexture,
            bumpScale: 0.2,
        });
        const moonSurface = new Mesh(moonGeometry, moonMaterial);
        moonSurface.rotation.x = -Math.PI / 2;
        this.scene.add(moonSurface);

        // Lighting
        const ambientLight = new AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);

        const directionalLight = new DirectionalLight(0xffffff, 1);
        directionalLight.position.set(100, 100, 100);
        this.scene.add(directionalLight);

        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate() {
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
