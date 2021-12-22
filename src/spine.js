import * as spine from "@esotericsoftware/spine-threejs";
import * as THREE from "three";
console.log({ spine });
let assetManager;
var animation = "dog1";
let baseUrl = "spine/";
var skeletonFile = "dog.json";
var lastFrameTime = new Date() / 1000;
let skeletonMesh = [];
var atlasFile = skeletonFile
  .replace("-pro", "")
  .replace("-ess", "")
  .replace(".json", ".atlas.txt");
export default function _spine() {
  // load the assets required to display the Raptor model

  assetManager = new spine.AssetManager(baseUrl);
  assetManager.loadText(skeletonFile);
  assetManager.loadTextureAtlas(atlasFile);
  requestAnimationFrame(() => {
    load.bind(this)();
  });
}

function load(name, scale) {
  if (assetManager.isLoadingComplete()) {
    // Add a box to the scene to which we attach the skeleton mesh
    let geometry = new THREE.BoxGeometry(200, 200, 200);
    let material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
    });
    let mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);

    // Load the texture atlas using name.atlas and name.png from the AssetManager.
    // The function passed to TextureAtlas is used to resolve relative paths.
    let atlas = assetManager.require(atlasFile);

    // Create a AtlasAttachmentLoader that resolves region, mesh, boundingbox and path attachments
    let atlasLoader = new spine.AtlasAttachmentLoader(atlas);

    // Create a SkeletonJson instance for parsing the .json file.
    var skeletonJson = new spine.SkeletonJson(atlasLoader);

    // Set the scale to apply during parsing, parse the file, and create a new skeleton.
    skeletonJson.scale = 0.01;
    var skeletonData = skeletonJson.readSkeletonData(
      assetManager.require(skeletonFile)
    );

    // Create a SkeletonMesh from the data and attach it to the scene

    for (var i = 0; i < 5; i++) {
      skeletonMesh[i] = new spine.SkeletonMesh(skeletonData, function (
        parameters
      ) {
        parameters.depthTest = false;
      });
      console.log(skeletonMesh[i])
      skeletonMesh[i].position.set(i,0,i)
      skeletonMesh[i].state.setAnimation(0, `dog${i + 1}`, true);

      mesh.add(skeletonMesh[i]);
    }

    // this.renderer.setAnimationLoop(() => {
    //   var now = Date.now() / 1000;
    // 		var delta = now - lastFrameTime;
    // 		lastFrameTime = now;
    //     console.log({delta})
    //   skeletonMesh.update(delta);
    //   // this._render()
    // });

    requestAnimationFrame(() => {
      render.bind(this)();
    });
  } else
    requestAnimationFrame(() => {
      load.bind(this)();
    });
}

function render() {
  // calculate delta time for animation purposes
  var now = Date.now() / 1000;
  var delta = now - lastFrameTime;
  lastFrameTime = now;

  // update the animation
  skeletonMesh.map((v) => {
    v.update(delta);
  });
  // render the scene
  this._render();

  requestAnimationFrame(() => {
    render.bind(this)();
  });
}
