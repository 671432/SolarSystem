"use strict";

import {PerspectiveCamera, Plane, Raycaster, Scene, Vector2, Vector3, WebGLRenderer, CubeTextureLoader,
     TextureLoader, PlaneGeometry, Mesh, MeshStandardMaterial, DoubleSide, AmbientLight, DirectionalLight } from "../build/three.module.js";
import {SolarSystem} from "./SolarSystem.js";
import {OrbitControls} from "../build/OrbitControls.js";
import {VRButton} from "../build/VRButton.js";
import {GUI} from '../lib/dat.gui.module.js';
import * as THREE from '../lib/three.module.js';
import { WASDMovement } from './WASDMovement.js';
import { MoonWalk } from './MoonWalk.js';
import { GLTFLoader } from '../build/GLTFLoader.js';


const width = window.innerWidth;
const height= window.innerHeight;
const aspect = width / height;

const fov = 75;
const near = 0.1;
const far = 500;

const camera = new PerspectiveCamera(fov, aspect, near, far);
// moves cam away from  oregon. won't have any effect in VR
camera.position.setZ(30);
const wasdMovement = new WASDMovement(camera, 0.2);


const raycaster = new Raycaster();
const mouse = new Vector2();
let grabbedObject = null;
const invisiblePlane = new Plane();


const canvas = document.createElement('canvas');
const context = canvas.getContext('webgl2');

const renderer = new WebGLRenderer({canvas, context});
renderer.setClearColor(0x000000); // "Bakgrunnsfarge"
renderer.setSize(width, height);

// to have and activate VR
document.body.appendChild(VRButton.createButton(renderer));
renderer.xr.enabled = true;
// end

const modelLoader = new GLTFLoader();
modelLoader.load(
    '/assets/Model/spaceship_-_cb1.glb',
    function (gltf) {
        const model = gltf.scene; 
        model.position.set(0, -0.5, 29.5); 
        model.scale.set(0.005, 0.005, 0.005); 
        model.rotation.x = 0;
        model.rotation.y = Math.PI / 2; 
        model.rotation.z = 0; 
        scene.add(model); 
        console.log('Model loaded successfully!');
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('An error occurred while loading the model:', error);
    }
);


document.body.appendChild(renderer.domElement);
/*
document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('mouseup', onMouseUp, false);
document.addEventListener('mousemove', onMouseMove, false);



function onMouseDown(event) {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Set up raycaster
    raycaster.setFromCamera(mouse, camera);

    // Access planets from solarSystem via the getter
    const planets = solarSystem.getPlanets();
    const intersects = raycaster.intersectObjects(planets); // Ensure planets are accessible

    if (intersects.length > 0) {
        grabbedObject = intersects[0].object; // Grab the planet
        invisiblePlane.setFromNormalAndCoplanarPoint(new Vector3(0, 0, 1), grabbedObject.position); // Create an invisible plane

        // Disable OrbitControls when interacting with a planet
        controls.enabled = false;
    }
}

function onMouseUp(event) {
    // Release the object
    grabbedObject = null;

    // Re-enable OrbitControls after releasing the object
    controls.enabled = true;
}

function onMouseMove(event) {
    if (grabbedObject) {
        // Convert mouse position to normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Use raycaster again
        raycaster.setFromCamera(mouse, camera);

        // Intersect the ray with the invisible plane
        const intersectionPoint = new Vector3();
        raycaster.ray.intersectPlane(invisiblePlane, intersectionPoint);

        if (intersectionPoint) {
            grabbedObject.position.copy(intersectionPoint); // Move the planet
        }
    }
}
*/
/*
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.dampingFactor = 0.05; 
controls.screenSpacePanning = false; 
controls.minDistance = 0; 
controls.maxDistance = 100; 
controls.maxPolarAngle = Math.PI;
*/
// Disable camera rotation with click-and-drag
//controls.enableRotate = false;
//controls.enablePan = false;


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


const scene = new Scene();
const solarSystem = new SolarSystem(scene);
let activeScene = "solarSystem";

/**
 * GUI
 */
const gui = new GUI();

const moonWalk = new MoonWalk(renderer);

function godMode() {
    // TODO: back to godMode (fly, no collision, etc)
    activeScene = "solarSystem";
    console.log("applied godMode");
    // player.position.set(sunPosition.x, sunPosition.y, sunPosition.z);
}

function teleportToSun() {
    // TODO: Teleport to Sun
    console.log("Teleporting to the Sun");
    // player.position.set(sunPosition.x, sunPosition.y, sunPosition.z);
}

function teleportToMoon() {
    // TODO: Teleport to Moon (Need to create Earth's Moon first)
    activeScene = "moonWalk";
    console.log("Teleporting to the Moon");
    // player.position.set(moonPosition.x, moonPosition.y, moonPosition.z);
    camera.position.set(0, 2, 5); 
}

function teleportToMars() {
    // TODO: Teleport to Mars
    console.log("Teleporting to Mars");
    // player.position.set(marsPosition.x, marsPosition.y, marsPosition.z);
}

// Create a folder for the locations
const folder = gui.addFolder('Options');
folder.add({ teleport: godMode }, 'teleport').name('Enable God Mode');
folder.add({ teleport: teleportToSun }, 'teleport').name('Teleport: Sun');
folder.add({ teleport: teleportToMoon }, 'teleport').name('Teleport: Moon');
folder.add({ teleport: teleportToMars }, 'teleport').name('Teleport: Mars');
folder.open();


const loader = new CubeTextureLoader();
const skyboxGalaxy = loader.load([
    'assets/skybox/right3.png',
    'assets/skybox/left3.png',
    'assets/skybox/top3.png',
    'assets/skybox/bottom3.png',
    'assets/skybox/front3.png',
    'assets/skybox/back3.png'
]);

const skyboxMoon = loader.load([
    'assets/skybox/right.png',
    'assets/skybox/left.png',
    'assets/skybox/top.png',
    'assets/skybox/bottom.png',
    'assets/skybox/front.png',
    'assets/skybox/back.png'
]);

scene.background = skyboxGalaxy;



// Only IF VR is in the scene
renderer.setAnimationLoop(render);

function render(){
    if (activeScene === "solarSystem") {
        scene.background = skyboxGalaxy;

        solarSystem.animate();
        renderer.render(scene, camera);
    } else if (activeScene === "moonWalk") {
        scene.background = skyboxMoon;

        moonWalk.render();
    }
    //requestAnimationFrame(render);

    wasdMovement.update();

    ////console.log('Planets:', solarSystem.getPlanets());

    // if VR is NOT addded, we use this.
    // window.requestAnimationFrame(render);
}

render();
