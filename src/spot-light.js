import * as THREE from "three";
const {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  BoxGeometry,
  MeshStandardMaterial,
  ShaderMaterial,
  Mesh,
  PointLight,
  SpotLight,
  Color,
  Clock,
} = THREE;
let x = 0,
  y = 27,
  z = 4;
let spotLight;
let lightHelper;
let params = {
  color: { r: 255, g: 200, b: 100 },
};
let color = new Color("rgb(255,200,100)");
export default function _createSpotLight() {
  spotLight = new SpotLight(color, 100);

  spotLight.position.set(x, y, z);
  spotLight.angle = Math.PI / 36;
  spotLight.penumbra = 0.1;
  // spotLight.decay = 2;
  spotLight.distance = 200;
  spotLight.castShadow = true;

  this.scene.add(spotLight);

  help.bind(this)();
}

function help() {
  lightHelper = new THREE.SpotLightHelper(spotLight);
  this.scene.add(lightHelper);

  /**
   *  debug spotLight
   */
  const spotLightFolder = this.pane.addFolder({ title: "SpotLight" });

  // 显示
  spotLightFolder
    .addInput(spotLight, "visible", {
      visible: true,
    })
    .on("change", (e) => {
      if (e.value) {
        this.scene.add(lightHelper);
      } else {
        lightHelper.removeFromParent();
      }
    });
    // help
    spotLightFolder
    .addInput({
      help:true
    }, "help")
    .on("change", (e) => {
      if (e.value) {
        this.scene.add(lightHelper);
      } else {
        lightHelper.removeFromParent();
      }
    });
  // 位置
  spotLightFolder
    .addInput({ position: { x, y, z } }, "position", {
      min: 0,
      step: 1,
      max: 20,
    })
    .on("change", (e) => {
      console.log(e);
      spotLight.position.set(e.value.x, e.value.y, e.value.z);
      spotLight.updateWorldMatrix();
      lightHelper.update();
    });
  // 颜色
  spotLightFolder
    .addInput(params, "color", { label: "Color" })
    .on("change", (e) => {
      spotLight.color = new Color(
        e.value.r / 255,
        e.value.g / 255,
        e.value.b / 255
      );
    });
  // 强度
  spotLightFolder.addInput(spotLight, "intensity", {
    label: "Intensity",
    min: 0,
    max: 1000,
  });
  // 角度
  spotLightFolder
    .addInput(spotLight, "angle", {
      label: "angle",
      min: Math.PI / 36,
      max: Math.PI / 2,
    })
    .on("change", (e) => {
      lightHelper.update();
    });
  // 边缘衰减
  spotLightFolder.addInput(spotLight, "penumbra", {
    label: "penumbra",
    min: 0,
    max: 1,
  });
}
