import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { domEl, events, scene, scheme, tunnels } from './3d-view/drawing.es';
import * as data from "./3d-view/data";
import { apply3dLayout } from './3d-view/layout.es.js';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    domEl.threeDomElement = document.getElementById("scene");
    scheme.TSDN = data['default'];
    console.log('Scheme');
    console.log(scheme.TSDN);

    scheme.TSDN = apply3dLayout(scheme.TSDN);
    scene.prepareScene();

    events.onClick = this.onDocumentClick.bind(this);
    domEl.threeDomElement.addEventListener('click', events.onClick, false);

    tunnels.usedElements = {};
    tunnels.textLabelsContainer = document.getElementById('container');
    tunnels.textLabels = [];

    let render = () => {
      for (let i = 0; i < tunnels.textLabels.length; i++) {
        tunnels.textLabels[i].updatePosition();
      }
      scene.renderer.render(scene.three, scene.camera);
      requestAnimationFrame(render);
    };
    render();

    setTimeout(() => {
      scene.loadSchema();
      setTimeout(() => {
        scene.addTextLabels();
      }, 500);
    }, 500);
  }

  zoomToObject() {
    scene.zoomToObject(scheme.TSDN.domains[0].points[4].point);
  }

  zoomOut() {
    scene.resetZooming();
  }

  showTrail() {
    tunnels.showTunnel(scheme.TSDN.trails[0]);
  }

  hideTrail() {
    tunnels.hideTunnel(scheme.TSDN.trails[0]);
  }

  onDocumentClick(event) {
    /*left menu width*/
    let offsetX = document.body.clientWidth - domEl.width;

    /*mouse position in 3d space*/
    events.mouse.x = ((event.clientX - offsetX) / domEl.width) * 2 - 1;
    events.mouse.y = -(event.clientY / domEl.height) * 2 + 1;
    events.raycaster.setFromCamera(events.mouse, scene.camera);

    /*set clickable targets*/
    let nodes = events.raycaster.intersectObjects(events.clickableNodes);
    let connects = events.raycaster.intersectObjects(events.clickableConnects);
    let tunnels = events.raycaster.intersectObjects(events.clickableTunnels);

    /*check if click was on one of the targets*/
    if (nodes.length > 0) {
      let obj = nodes[0].object;
      let id = obj.name;
      console.log("id: " + id + ", x: " + obj.position.x + ", y: " + obj.position.y + ", z: " + obj.position.z);
      this.renderContextMenu(id, "node", event);
    } else if (connects.length > 0) {
      let id = connects[0].object.name;
      console.log(id);
       this.renderContextMenu(id, "connect", event);
    } else if (tunnels.length > 0) {
      let id = tunnels[0].object.name;
      console.log(id);
      this.renderContextMenu(id, "tunnel", event);
    }
  }

  renderContextMenu(id, type, event) {
    const offsetX = document.body.clientWidth - domEl.width;
    const left = `${event.clientX - offsetX + 5}px`;
    const top = `${event.clientY + 5}px`;
    let contextMenu = document.createElement("div");
    contextMenu.id = "contextMenu";
  
    contextMenu.style.background = "#ffffff";
    contextMenu.style.left = left;
    contextMenu.style.position = "fixed";
    contextMenu.style.top = top;
    contextMenu.innerHTML = `${type} : ${id}`;
    document.body.appendChild(contextMenu);
    setTimeout(() => {
      document.getElementById("contextMenu").remove();
    }, 2000);


  }

}
