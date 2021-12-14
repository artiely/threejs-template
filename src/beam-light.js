import * as THREE from "three";
import VolumetricSpotLightMaterial from "./shaders/volumetric-spotlight";
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
  Group,
  CylinderGeometry,
  Matrix4,
  Vector3
} = THREE;
// 创建一个锥形 https://threejs.org/docs/index.html#api/zh/geometries/CylinderGeometry
// top.radius,bottom.radius,height,radialSegments<多少面>, heightSegments，openEnded<上下镂空>
let cylinderGeometry = {
  topRadius: 0.1,
  bottomRadius: 1.5,
  height: 20,
  radialSegments: 32 * 2,
  heightSegments: 20,
  openEnded: true,
};
let mesh;
let geometry;
let material;
let beamLight;
let beamLightHelper;
let params = {
  color: { r: 255, g: 255, b: 0 },
};
let color = new Color('rgb(255, 255, 0)')
export default function _createBeamLight() {

  geometry = new CylinderGeometry(
    cylinderGeometry.topRadius,
    cylinderGeometry.bottomRadius,
    cylinderGeometry.height,
    cylinderGeometry.radialSegments,
    cylinderGeometry.heightSegments,
    cylinderGeometry.openEnded
  );
  geometry.applyMatrix4(
    new Matrix4().makeTranslation(0, -geometry.parameters.height / 2, 0)
  );
  geometry.applyMatrix4(new Matrix4().makeRotationX(-Math.PI / 2));

  material = VolumetricSpotLightMaterial();
  mesh = new Mesh(geometry, material);
  mesh.position.set(0, 10, -11);
  mesh.lookAt(new Vector3(0, 0, 0));
  material.uniforms.lightColor.value.set(color);
  // 光柱的强度
  material.uniforms.attenuation.value = 20;
  material.uniforms.spotPosition.value = mesh.position;
  console.log("material.uniforms", mesh, material.uniforms);
  let group = new Group();
  group.add(mesh);

  //		link it with a beamLight
  beamLight =  new THREE.SpotLight();
  beamLight.position.copy(mesh.position);
  beamLight.color = mesh.material.uniforms.lightColor.value;
  beamLight.exponent = 30;
  beamLight.penumbra = 1;
  beamLight.angle = Math.PI / 30;
  beamLight.intensity = 200;
  group.add(beamLight);
  group.add(beamLight.target);
  this.scene.add(group);
  // this.scene.add(beamLight);
  // this.scene.add(beamLight.target);
  this.renderer.shadowMap.enabled = true;

  //		loop runner
  let lastTimeMsec = null;
  requestAnimationFrame(function animate(nowMsec) {
    beamLightHelper.update();
    requestAnimationFrame(animate);
    lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
    lastTimeMsec = nowMsec;
    let now = nowMsec / 1000;
    let angle = 0.1 * Math.PI * 2 * now;
    let target = new THREE.Vector3(1 * Math.cos(angle), 0, 1 * Math.sin(angle));
    mesh.lookAt(target);
    beamLight.target.position.copy(target);
  });

  help.bind(this)();
}
function destroy() {
  mesh.removeFromParent();
  beamLight.removeFromParent();
}
function help() {
  beamLightHelper = new THREE.SpotLightHelper(beamLight);
  this.scene.add(beamLightHelper);

  const beamLightFolder = this.pane.addFolder({ title: "BeamLight" });
  
  // 显示
  beamLightFolder
    .addInput(beamLight, "visible", {
      visible: true,
    })
    .on("change", (e) => {
      mesh.visible = e.value;
      console.log(e.value, beamLightHelper);
      if (e.value) {
        this.scene.add(beamLightHelper);
      } else {
        beamLightHelper.removeFromParent();
      }
    });
      // help
      beamLightFolder
      .addInput({
        help:true
      }, "help")
      .on("change", (e) => {
        if (e.value) {
          this.scene.add(beamLightHelper);
        } else {
          beamLightHelper.removeFromParent();
        }
      });
  // 背景
  beamLightFolder
    .addInput(params, "color", { label: "Color" })
    .on("change", (e) => {
      let color = new Color(e.value.r / 255, e.value.g / 255, e.value.b / 255);
      material.uniforms.lightColor.value.set(color);
    });
  // 顶圈
  // 底圈
  // beamLightFolder
  //   .addInput(cylinderGeometry, "bottomRadius", { label: "bottomRadius" })
  //   .on("change", (e) => {
  //     destroy().bind(this)();
  //     cylinderGeometry.bottomRadius = e.value;
  //     _createBeamLight.bind(this)();
  //   });
}
