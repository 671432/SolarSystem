"use strict";

import * as THREE from 'three';

export class WASDMovement {
    constructor(camera, speed = 0.1, rotationSpeed = 0.01) {
        this.camera = camera; // The camera to control
        this.speed = speed; // Movement speed
        this.rotationSpeed = rotationSpeed; // Rotation speed
        this.keys = { forward: false, backward: false, left: false, right: false, rotateX: false, rotateY: false }; // Key states

        // Bind event listeners to the class instance
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.update = this.update.bind(this);

        // Add event listeners for keyboard input
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
    }

    onKeyDown(event) {
        // Update key states based on the pressed key
        switch (event.code) {
            case "KeyW":
                this.keys.forward = true;
                break;
            case "KeyS":
                this.keys.backward = true;
                break;
            case "KeyA":
                this.keys.left = true;
                break;
            case "KeyD":
                this.keys.right = true;
                break;
            case "KeyX":
                this.keys.rotateX = true;
                break;
            case "KeyY":
                this.keys.rotateY = true;
                break;
        }
    }

    onKeyUp(event) {
        // Reset key states when the key is released
        switch (event.code) {
            case "KeyW":
                this.keys.forward = false;
                break;
            case "KeyS":
                this.keys.backward = false;
                break;
            case "KeyA":
                this.keys.left = false;
                break;
            case "KeyD":
                this.keys.right = false;
                break;
            case "KeyX":
                this.keys.rotateX = false;
                break;
            case "KeyY":
                this.keys.rotateY = false;
                break;
        }
    }

    update() {
        // Movement
        const direction = new THREE.Vector3();
        const right = new THREE.Vector3();
        const forward = new THREE.Vector3();

        // Get the camera's forward and right directions
        this.camera.getWorldDirection(forward);
        right.crossVectors(forward, this.camera.up);

        // Normalize directions
        forward.y = 0; // Keep movement horizontal
        forward.normalize();
        right.normalize();

        // Apply movement based on key states
        if (this.keys.forward) direction.add(forward);
        if (this.keys.backward) direction.sub(forward);
        if (this.keys.left) direction.sub(right);
        if (this.keys.right) direction.add(right);

        // Scale movement by speed
        direction.multiplyScalar(this.speed);

        // Update the camera position
        this.camera.position.add(direction);

        // Rotation
        if (this.keys.rotateX) {
            this.camera.rotation.x += this.rotationSpeed;
        }
        if (this.keys.rotateY) {
            this.camera.rotation.y += this.rotationSpeed;
        }
    }

    dispose() {
        // Clean up event listeners
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);
    }
}
