"use strict";

import { AmbientLight, Color, Mesh, MeshBasicMaterial, MeshPhongMaterial, Object3D, PointLight, SphereGeometry, TextureLoader, Vector2 } from "../build/three.module.js";

export class SolarSystem {
    constructor(scene) {
        this.planets = []; // Storing planets
        let sunRadius = 5;
        let widthSegments = 64;
        let heightSegments = 64;
        let earthRadius = sunRadius*0.5;

        this.textureLoader = new TextureLoader();

        this.centerOfSystem = new Object3D();

        this.centerOfSystem.position.setZ(-30); // Uncomment if VR is implemented
        
        scene.add(this.centerOfSystem);

        this.sun = this.createSphericalBody({
            radius: sunRadius, widthSegments, heightSegments,
            assetUrl: 'assets/texture_sun.jpg',
            MaterialType: MeshBasicMaterial
        });


        this.earthOrbitNode = new Object3D();
        this.moonOrbitNode = new Object3D();
        this.marsOrbitNode = new Object3D();
        this.mercuryOrbitNode = new Object3D();

        this.centerOfSystem.add(this.sun)
        this.centerOfSystem.add(this.earthOrbitNode);
        //this.centerOfSystem.add(this.moonOrbitNode);
        this.earthOrbitNode.add(this.moonOrbitNode);
        this.centerOfSystem.add(this.marsOrbitNode);
        this.centerOfSystem.add(this.mercuryOrbitNode);

        this.moonOrbitNode.position.set(15, 0, 0);

        this.earth = this.createSphericalBody({
            radius: sunRadius * 0.5,
            widthSegments, heightSegments,
            shininess: 10,
            assetUrl: 'assets/texture_earth.jpg',
            MaterialType: MeshPhongMaterial,
            specularMapUrl: 'assets/earthspec1k.jpg',
            normalMapUrl: 'assets/2k_earth_normal_map.png'
        });

        this.moon = this.createSphericalBody({
            radius: earthRadius * 0.4,
            widthSegments, heightSegments,
            shininess: 10,
            assetUrl: 'assets/moon.jpg',
            MaterialType: MeshPhongMaterial,
            specularMapUrl: 'assets/moonspec.jpg',
            normalMapUrl: 'assets/MoonNormalMap.jpg'
        });

        this.mars = this.createSphericalBody({
            radius: sunRadius * 0.5,
            widthSegments, heightSegments,
            shininess: 10,
            assetUrl: 'assets/mars.jpg',
            MaterialType: MeshPhongMaterial,
            specularMapUrl: 'assets/marsspec.jpg',
            normalMapUrl: 'assets/marsNormalMap.jpg'
        });

        this.mercury = this.createSphericalBody({
            radius: sunRadius * 0.5,
            widthSegments, heightSegments,
            shininess: 10,
            assetUrl: 'assets/mercury.jpg',
            MaterialType: MeshPhongMaterial,
            specularMapUrl: 'assets/mercuryspec.jpg',
            normalMapUrl: 'assets/mercuryNormalMap.jpg'
        });

        this.earth.position.x = 15;
        this.moon.position.x = 5;
        this.mars.position.x = 30;
        this.mercury.position.x = 45;

        this.earthOrbitNode.add(this.earth);
        this.earthOrbitNode.add(this.moon);
        this.moonOrbitNode.add(this.moon);
        this.marsOrbitNode.add(this.mars);
        this.mercuryOrbitNode.add(this.mercury);

        this.planets.push(this.earth);
        this.planets.push(this.moon);
        this.planets.push(this.mars);
        this.planets.push(this.mercury);

        this.sunLight = new PointLight(0xFFFFFF, 3);
        this.sun.add(this.sunLight);

        this.ambientLight = new AmbientLight(0xFFFFFF, 0.2);

        scene.add(this.ambientLight);
    }




    animate() {
        this.rotateObject(this.sun, [0, 0.005, 0]);

        this.rotateObject(this.earthOrbitNode, [0, 0.0008, 0]);
        this.rotateObject(this.earth, [0, 0.003, 0]);

        this.rotateObject(this.moonOrbitNode, [0, 0.005, 0]); //faster on purpose cuz troubleshooting animation (set to 0.0002 when done)
        this.rotateObject(this.moon, [0, -0.006, 0]);

        this.rotateObject(this.marsOrbitNode, [0, -0.0007, 0]);
        this.rotateObject(this.mars, [0, 0.003, 0]);

        this.rotateObject(this.mercuryOrbitNode, [0, 0.001, 0]);
        this.rotateObject(this.mercury, [0, 0.003, 0]);
    }


    rotateObject(object, rotation) {
        object.rotation.x += rotation[0];
        object.rotation.y += rotation[1];
        object.rotation.z += rotation[2];
    }

    /**
     *  Creates a sphere mesh given the given parameters
     *
     * @param radius : number
     * @param widthSegments : number
     * @param heightSegments : number
     * @param assetUrl : URL
     * @param color : Color
     * @param MaterialType : Material
     * @param shininess : number
     * @param normalMapUrl : URL
     * @param specularMapUrl : URL
     */
    createSphericalBody({
        radius = 5, widthSegments = 64, heightSegments = 64,
        assetUrl = undefined,
        color = new Color(0xFFFFFF),
        MaterialType = MeshBasicMaterial,
        shininess = 0,
        normalMapUrl = undefined,
        specularMapUrl = undefined
    }) {
        let geometry = new SphereGeometry(radius, widthSegments, heightSegments);

        let texture = assetUrl ? this.textureLoader.load(assetUrl) : null;
        let nMap = normalMapUrl ? this.textureLoader.load(normalMapUrl) : null;
        let specMap = specularMapUrl ? this.textureLoader.load(specularMapUrl) : null;

        let mat = new MaterialType(
            {
                map: texture,
                color: color,
                shininess: shininess,
                normalMap: nMap,
                specularMap: specMap,
                specular: new Color(0x777777),
                normalScale: new Vector2(10,10)
            });

        return new Mesh(geometry, mat);
    }

    getPlanets()
    {
        return this.planets; // Expose the planets array
    }
}
