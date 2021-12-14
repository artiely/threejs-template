import * as THREE from "three";
import App from './app'
const { PerspectiveCamera } = THREE;

export default class Camera extends App {
  constructor() {
    super();
    console.log("this", this);
  }
  _createCamera() {
    this.camera = new PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.zoom = 0.1;
    this.camera.position.set(-4, 4, 10);
  }
}
