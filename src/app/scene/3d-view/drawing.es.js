import * as THREE from "three";
import * as gsap from 'gsap';
import $ from 'jquery';

THREE.OrbitControls = require('./three-addons/OrbitControls.js')(THREE);
THREE.OBJLoader = require('./three-addons/OBJLoader.js')(THREE);


/*dom element for three scene*/
let domEl = {};
domEl.height = 0;
domEl.width = 0;
domEl.threeDomElement = 0;


/*object with all data and manipulations with scheme*/
let scheme = {};
scheme.TSDN = []; //data from controller (nodes, connections, tunnels)
scheme.graphNodes = []; //array used to create connections and tunnels between nodes


/*object with all scene components*/
let scene = {};
scene.camera = {};
scene.controls = {};
scene.renderer = {};
scene.rotationPoint = {};
scene.targetVector = {};
scene.three = {};
scene.position = 0;
scene.prepareScene = () => {
    /*scene size*/
    let sceneDomElement = $('#scene');
    domEl.width = sceneDomElement.width();
    domEl.height = $(document).height();
    sceneDomElement.height(domEl.height);

    /*block for scene*/
    let container = document.createElement('div');
    document.body.appendChild(container);

    /*scene settings*/
    scene.three = new THREE.Scene();

    /*camera settings*/
    scene.camera = new THREE.PerspectiveCamera(50, domEl.width / domEl.height, 1, 2000);
    scene.camera.position.set(600, 600, 0);
    scene.targetVector = new THREE.Vector3(0, 0, 0);
    scene.camera.lookAt(scene.targetVector);

    scene.controls = new THREE.OrbitControls(scene.camera, domEl.threeDomElement);
    scene.controls.target.set(0, 0, 0);
    scene.controls.enablePan = true;
    scene.controls.update();

    scene.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    scene.renderer.setSize(domEl.width, domEl.height); // Set the size of the WebGL viewport.
    scene.renderer.setClearColor(0xffffff, 0);
    scene.renderer.shadowMap.enabled = true;
    scene.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(scene.renderer.domElement);

    sceneDomElement.append(scene.renderer.domElement);

    scene.rotationPoint = new THREE.Vector3(scene.camera.rotation.x, scene.camera.rotation.y, scene.camera.rotation.z);
    light.defineLight();

    /*event handlers*/
    events.raycaster = new THREE.Raycaster();
    events.mouse = new THREE.Vector2();
};
scene.loadSchema = () => {
    scheme.graphNodes = [];
    events.clickableNodes = [];
    events.clickableConnects = [];
    events.clickableTunnels = [];
    events.clickablePlanes = [];
    tunnels.currentTunnels = [];

    /*clean scene*/
    for (let i = scene.three.children.length - 1; i >= 0; i--) {
        scene.three.remove(scene.three.children[i]);
    }

    /*add light and environment*/
    scene.three.add(light.ambientLight);
    scene.three.add(light.hemisphereLight);
    scene.three.add(light.directionalLight);

    scene.position = scheme.TSDN.domains[0].width;

    /*setting up camera*/
    scene.camera.position.set(scene.position, scene.position, 0);
    scene.camera.lookAt(scene.targetVector);
    scene.camera.updateProjectionMatrix();
    scene.rotationPoint = new THREE.Vector3(scene.camera.rotation.x, scene.camera.rotation.y, scene.camera.rotation.z);

    /*draw elements*/
    let domains = scheme.TSDN.domains;
    let connections = scheme.TSDN.domains[0].connections;

    for (let i = 0; i < domains.length; i++) {
        scheme.graphNodes[i] = [];
        let centerPoint = domains[i].centerPoint;
        let elements = domains[i].points;
        for (let j = 0; j < elements.length; j++) {
            let id = elements[j].name;
            let point = elements[j].point;

            scheme.graphNodes[i][id] = {
                "x": point.x + centerPoint.x,
                "y": point.y,
                "z": point.z + centerPoint.z
            };

            let element = drawing.createNode(
                point.x + centerPoint.x, point.y + 0.15, point.z + centerPoint.z,
                elements[j].name, "rgb(153, 143, 231)", "rgb(78, 72, 118)"
            );
            element.name = elements[j].name;
            scene.three.add(element);
        }
    }

    setTimeout(() => {
        for (let i = 0; i < connections.length; i++) {
            let source, target;

            for (let j = 0; j < scheme.graphNodes.length; j++) {
                if (scheme.graphNodes[j][connections[i].source] !== null) {
                    source = scheme.graphNodes[j][connections[i].source];
                    source.id = connections[i].source;
                }
                if (scheme.graphNodes[j][connections[i].target] !== null) {
                    target = scheme.graphNodes[j][connections[i].target];
                    target.id = connections[i].target;
                }
            }
            let connection = drawing.createLineConnection(
                source.x, target.x, source.y, target.y, source.z, target.z,
                0.3, "rgb(240, 250, 260)", "rgb(120, 130, 140)"
            );

            connection.name = connections[i].id;
            events.clickableConnects.push(connection);
            scene.three.add(connection);
        }
    }, 100);

    scene.controls.update();
};
scene.addTextLabels = () => {
    let elements = scheme.TSDN.domains[0].points;
    elements.forEach((el) => {
        let nodeObj = scene.three.getObjectByName(el.name);
        let text = drawing.createTextLabel();
        text.setHTML(`${el.name}<br/>Simple point`);
        text.setId(el.name);
        text.setParent(nodeObj.children[0]);
        tunnels.textLabels.push(text);
        tunnels.textLabelsContainer.appendChild(text.element);
    });
};
scene.changeControlsMode = (mode) => {
    scene.controls.enabled = mode;
    scene.controls.update();
    if (mode) {
        domEl.threeDomElement.addEventListener('click', events.onClick, false);
        domEl.threeDomElement.addEventListener('contextmenu', events.onRightClick, false);
    } else {
        domEl.threeDomElement.removeEventListener('click', events.onClick, false);
        domEl.threeDomElement.removeEventListener('contextmenu', events.onRightClick, false);
    }
};
scene.zoomToObject = (point) => {
    let speed = 1.5;
    gsap.TweenLite.to(scene.camera.position, speed, {
        x: point.x + 30,
        y: point.y + 30,
        z: point.z
    });
    gsap.TweenLite.to(scene.camera.rotation, speed, {
        x: scene.rotationPoint.x,
        y: scene.rotationPoint.y,
        z: scene.rotationPoint.z
    });
    gsap.TweenLite.to(scene.targetVector, speed, {
        x: point.x,
        y: point.y,
        z: point.z
    });
    gsap.TweenLite.to(scene.controls.target, speed, {
        x: point.x,
        y: point.y,
        z: point.z
    });
    gsap.TweenLite.to(scene.controls.object.position, speed, {
        x: point.x + 30,
        y: point.y + 30,
        z: point.z
    });
};
scene.resetZooming = () => {
    let speed = 1;
    gsap.TweenLite.to(scene.camera.position, speed, {
        x: scene.position,
        y: scene.position,
        z: 0,
        ease: gsap.Power4.easeInOut
    });
    gsap.TweenLite.to(scene.camera.rotation, speed, {
        x: scene.rotationPoint.x,
        y: scene.rotationPoint.y,
        z: scene.rotationPoint.z,
        ease: gsap.Power4.easeInOut
    });
    gsap.TweenLite.to(scene.targetVector, speed, {
        x: 0,
        y: 0,
        z: 0,
        ease: gsap.Power4.easeInOut
    });
    gsap.TweenLite.to(scene.controls.target, speed, {
        x: 0,
        y: 0,
        z: 0,
        ease: gsap.Power4.easeInOut
    });
    gsap.TweenLite.to(scene.controls.object.position, speed, {
        x: scene.position,
        y: scene.position,
        z: 0,
        ease: gsap.Power4.easeInOut
    });
};


/*scene light object*/
let light = {};
light.ambientLight = {};
light.hemisphereLight = {};
light.directionalLight = {};
light.defineLight = () => {
    // add subtle ambient lighting
    light.ambientLight = new THREE.AmbientLight("#000000", 1);
    light.ambientLight.custShadow = true;
    light.ambientLight.name = "ambientLight";

    /*add hemisphere light*/
    light.hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.45);
    light.hemisphereLight.position.set(1000, 1000, -500);
    light.hemisphereLight.name = "hemisphereLight";

    /*add directional light*/
    light.directionalLight = new THREE.DirectionalLight(0xffffcc, 0.25);
    light.directionalLight.position.set(-1, 1.75, 1);
    light.directionalLight.position.multiplyScalar(1000);
    light.directionalLight.name = "directionalLight";
};


/*abject with all manipulations with tunnels*/
let tunnels = {};
tunnels.currentTunnels = [];
tunnels.selectedTunnelName = "";
/*elements, that used in particular moment
(important to check this array, to avoid hiding (or blur) elements, that other tunnels use)*/
tunnels.usedElements = [];
tunnels.textLabelsContainer = 0;
tunnels.textLabels = 0;
tunnels.hideTunnel = (tunnelData) => {
    scene.three.remove(scene.three.getObjectByName(tunnelData.name)); //remove tunnel from scene
    scene.three.remove(scene.three.getObjectByName(tunnelData.name + "_point")); //remove animated light point from scene
};
tunnels.showTunnel = (tunnelData) => {
    actions.lightUpObjects(tunnelData.nodes.concat(tunnelData.links)); //show (light up) used elements

    let tunnelGroup = new THREE.Object3D(); //tunnel and animated point
    let curve = new THREE.CatmullRomCurve3();

    if (tunnelData) {
        let points = tunnelData.nodes;

        /*create curve point by point*/
        for (let i = 0; i < points.length; i++) {
            let point;
            for (let j = 0; j < scheme.graphNodes.length; j++) {
                if (scheme.graphNodes[j][points[i]] !== null) {
                    point = scheme.graphNodes[j][points[i]];
                }
            }
            curve.points.push(new THREE.Vector3(point.x, point.y, point.z));
        }

        let tubeMesh = drawing.createTunnel(curve, { baseColor: "rgb(226, 89, 58)", emissiveColor: "rgb(126, 6, 5)", opacity: 0.75 }); //create 3d tunnel element
        tubeMesh.name = tunnelData.name;
        events.clickableTunnels.push(tubeMesh);
        tunnelGroup.add(tubeMesh);

    }

    tunnelGroup.name = tunnelData.name;
    events.clickableTunnels.push(tunnelGroup);
    scene.three.add(tunnelGroup);

    /*add animated light after sometime (delay for render)*/
    setTimeout(() => {
        drawing.createAnimatedLightPoint(curve, tunnelData.name);
    }, 400);
};


/*object with interaction elements and handlers*/
let events = {};
events.clickableNodes = [];
events.clickableConnects = [];
events.clickableTunnels = [];
events.onClick = 0;
events.onRightClick = 0;
events.mouse = {};
events.raycaster = {};


/*object with possible elements actions*/
let actions = {};
actions.hideObjects = (objectsIds) => {
    if (objectsIds) {
        objectsIds.forEach((id) => {
            scene.three.getObjectByName(id).traverse((object) => {
                object.visible = false;
            });
            let textLabel = document.getElementById(id);
            if (textLabel !== null) {
                if (textLabel.style.display === 'block' || textLabel.style.display === '') {
                    textLabel.style.display = 'none';
                }
            }
        });
    }
};
actions.blurObjects = (objectsIds) => {
    if (objectsIds) {
        objectsIds.forEach((id) => {
            scene.three.getObjectByName(id).traverse((object) => {
                if (object.type === "Mesh") {
                    switch (object.material.name) {
                        case "link-material-color-#ffffff": {
                            object.material.opacity = 0.05;
                            break;
                        }
                        case "link-material-color-#fac6c8": {
                            object.material.opacity = 0.15;
                            break;
                        }
                        case "link-material-color-#ec1c22": {
                            object.material.opacity = 0.25;
                            break;
                        }
                        case "router-material": {
                            object.material.opacity = 0.25;
                            break;
                        }
                    }
                }
            });
        });
    }
};
actions.lightUpObjects = (objectsIds) => {
    if (objectsIds) {
        objectsIds.forEach((id) => {
            scene.three.getObjectByName(id).traverse((object) => {
                if (object.type === "Mesh") {
                    switch (object.material.name) {
                        case "link-material-color-#ffffff": {
                            object.material.opacity = 0.25;
                            break;
                        }
                        case "link-material-color-#fac6c8": {
                            object.material.opacity = 0.5;
                            break;
                        }
                        case "link-material-color-#ec1c22": {
                            object.material.opacity = 0.75;
                            break;
                        }
                        case "router-material": {
                            object.material.opacity = 1;
                            break;
                        }
                    }
                }
            });
        });
    }
};
actions.showObjects = (objectsIds) => {
    if (objectsIds) {
        objectsIds.forEach((id) => {
            scene.three.getObjectByName(id).traverse((object) => {
                object.visible = true;
            });
            let textLabel = document.getElementById(id);
            if (textLabel !== null) {
                if (textLabel.style.display === 'none') {
                    textLabel.style.display = 'block';
                }
            }
        });
    }
};


/*object with functions, that create 3d elements, dom elements*/
let drawing = {};
drawing.createNode = (x, y, z, id, color, emissive) => {
    let node = new THREE.Object3D();
    let oLoader = new THREE.OBJLoader();
    oLoader.load("assets/img/objects/router-sphere.obj", (object) => {
        let material = new THREE.MeshLambertMaterial({
            color: color,
            emissive: emissive,
            side: THREE.DoubleSide,
            transparent: true,
            name: "router-material"
        });
        object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material = material;
                child.castShadow = true;
                child.receiveShadow = true;
                child.name = id;
                events.clickableNodes.push(child);
            }
        });
        object.position.set(x, y, z);
        object.scale.set(0.8, 0.8, 0.8);
        node.add(object);
    });
    return node;
};
drawing.createLineConnection = (x1, x2, y1, y2, z1, z2, opacity, color, emissive) => {
    let point1 = new THREE.Vector3(x1, y1, z1);
    let point2 = new THREE.Vector3(x2, y2, z2);

    let path = new THREE.LineCurve(point1, point2);
    let geo = new THREE.TubeGeometry(path, 1, 0.5, 10, false);
    let mat = new THREE.MeshLambertMaterial({ color: color, emissive: emissive });
    mat.transparent = true;
    mat.opacity = opacity;
    mat.side = THREE.DoubleSide;
    mat.name = "link-material-color-" + color;
    return new THREE.Mesh(geo, mat);
};
drawing.createTunnel = (curve, materialColor, ) => {
    let count = (curve.points.length - 1) * 20;
    let tube = new THREE.TubeBufferGeometry(curve, count, 2.5, 9, false);
    let tubeMesh = new THREE.Mesh(tube);
    tubeMesh.material = new THREE.MeshLambertMaterial({
        color: materialColor.baseColor,
        emissive: materialColor.emissiveColor,
        transparent: true,
        opacity: materialColor.opacity,
        side: THREE.BackSide
    });
    return tubeMesh;
};
drawing.createAnimatedLightPoint = (curve, id) => {
    let light = new THREE.PointLight("#ffffff", 3, 10);
    let point = new THREE.Object3D();
    point.add(light);
    point.position.set(curve.getPointAt(0).x, curve.getPointAt(0).y, curve.getPointAt(0).z);
    point.name = id + "_point";
    scene.three.add(point);

    /*animation*/
    let counter = 0;
    let moveBox = () => {
        if (counter <= 1) {
            gsap.TweenLite.to(point.position, 0.02, {
                x: curve.getPointAt(counter).x,
                y: curve.getPointAt(counter).y,
                z: curve.getPointAt(counter).z,
                onComplete: moveBox
            });
            counter += 0.02;
        } else {
            counter = 0;
            moveBox();
        }
    };
    moveBox();
};
drawing.createTextLabel = () => {
    let textLabel = {};
    textLabel.element = document.createElement('div');
    textLabel.element.className = 'text-label';
    textLabel.parent = false;
    textLabel.position = new THREE.Vector3(0, 0, 0);

    textLabel.setHTML = (html) => {
        textLabel.element.innerHTML = html;
    };
    textLabel.setParent = (threeObj) => {
        textLabel.parent = threeObj;
    };
    textLabel.setId = (id) => {
        textLabel.element.id = id;
    };

    let get2DCoords = (position) => {
        let vector = position.project(scene.camera);
        vector.x = (vector.x + 1) / 2 * domEl.width;
        vector.y = -(vector.y - 1) / 2 * domEl.height;
        return vector;
    };

    textLabel.updatePosition = () => {
        if (textLabel.parent) {
            textLabel.position.copy(textLabel.parent.position);
            textLabel.position.x -= 4;
        }

        let crds2d = get2DCoords(textLabel.position);
        textLabel.element.style.left = crds2d.x + 'px';
        textLabel.element.style.top = crds2d.y + 'px';
    };

    return textLabel;
};

export { scheme, tunnels, scene, domEl, events };