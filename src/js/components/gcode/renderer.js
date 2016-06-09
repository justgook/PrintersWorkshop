import THREE from 'three';
// console.log(AAA);
import './OrbitControls.js';



export default function createScene(element) {

  // Renderer
  var renderer = new THREE.WebGLRenderer({clearColor:0x000000, clearAlpha: 1});
  renderer.setSize(element.width(), element.height());
  element.appendChild(renderer.domElement);
  renderer.clear();

  // Scene
  var scene = new THREE.Scene();

  // Lights...
  [
    [0,0,1,  0xFFFFCC],
    [0,1,0,  0xFFCCFF],
    [1,0,0,  0xCCFFFF],
    [0,0,-1, 0xCCCCFF],
    [0,-1,0, 0xCCFFCC],
    [-1,0,0, 0xFFCCCC]
  ].forEach(function(position) {
    var light = new THREE.DirectionalLight(position[3]);
    light.position.set(position[0], position[1], position[2]).normalize();
    scene.add(light);
  });

  // Camera...
  var fov    = 45,
    aspect = element.width() / element.height(),
    near   = 1,
    far    = 10000,
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.rotationAutoUpdate = true;
  // camera.position.x = 0;
  // camera.position.y = 500;
  camera.position.z = 300;
  camera.lookAt(scene.position);
  scene.add(camera);


  var controls = new THREE.OrbitControls( camera, element );
  //TODO add rerender only when needed !!
  // controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  // controls.enableZoom = false;


  // Action!
  function render() {
    controls.update();
    renderer.render(scene, camera);
    //TODO add rerender only when needed !!
    requestAnimationFrame(render); // And repeat...
  }
  render();
  // // Fix coordinates up if window is resized.
  // $(window).on('resize', function() {
  //   renderer.setSize(element.width(), element.height());
  //   camera.aspect = element.width() / element.height();
  //   camera.updateProjectionMatrix();
  //   controls.screen.width = window.innerWidth;
  //   controls.screen.height = window.innerHeight;
  // });

  return scene;
}
