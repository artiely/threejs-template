import * as THREE from "three";
export default function floor() {
  let floorMat = new THREE.MeshStandardMaterial({
    roughness: 0.8,
    color: 0xffffff,
    metalness: 0.2,
    bumpScale: 0.005,
  });
  const textureLoader = new THREE.TextureLoader();
  console.log({textureLoader})
  textureLoader.load("textures/hardwood2_diffuse.jpg", function (map) {
    console.log('获取到材质')
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    // map.matrix.scale(.2,.2) 缩放的设置似乎没什么用，可以调整repeat的值达到缩放的目的
    map.repeat.set(5, 12);
    console.log({map})
    map.encoding = THREE.sRGBEncoding;
    floorMat.map = map;
    floorMat.needsUpdate = true;
  },(p)=>{
    console.log(p);
  },(err)=>{
    console.error(err)
  });
  textureLoader.load("textures/hardwood2_bump.jpg", function (map) {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    console.log("map.matrix.scale",map.matrix)
    map.repeat.set(5, 12);
    floorMat.bumpMap = map;
    floorMat.needsUpdate = true;
  });
  textureLoader.load("textures/hardwood2_roughness.jpg", function (map) {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    map.repeat.set(5, 12);
    floorMat.roughnessMap = map;
    floorMat.needsUpdate = true;
  });

  const floorGeometry = new THREE.PlaneGeometry(100, 100);
  // floorMat.matrixAutoUpdate = false
  // floorMat.wrapS = THREE.RepeatWrapping; floorMat.wrapT = THREE.RepeatWrapping; 
  const floorMesh = new THREE.Mesh(floorGeometry, floorMat);
  
  floorMesh.receiveShadow = true;
  floorMesh.rotation.x = -Math.PI / 2.0;
  this.scene.add(floorMesh);
  // console.log({floorMat},floorMat.map.matrix)
  // floorMat.map.matrix.scale(2,2)
}
