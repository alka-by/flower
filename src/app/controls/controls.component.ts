import { Component, OnInit } from '@angular/core';
import { SceneComponent } from '../scene/scene.component';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {

  sceneComponent;
  constructor() {
    this.sceneComponent = new SceneComponent();
  }

  ngOnInit() {

  }

  zoomToObject() {
    this.sceneComponent.zoomToObject();
  }

  zoomOut() {
    this.sceneComponent.zoomOut();
  }

  showTrail() {
    this.sceneComponent.showTrail();
  }

  hideTrail() {
    this.sceneComponent.hideTrail();
  }
}
