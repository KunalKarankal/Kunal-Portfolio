import * as THREE from './three-0.180.0.module.min.js';
import { OrbitControls } from './OrbitControls-0.180.0.js';

const dialog = document.querySelector('#model-explorer');
const viewport = dialog.querySelector('.model-viewport');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#edf5f0');
const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(600, 440);
renderer.domElement.setAttribute('aria-label', 'Interactive concept model. Drag to rotate, scroll or pinch to zoom.');
viewport.append(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
scene.add(new THREE.HemisphereLight(0xffffff, 0x668877, 3));
const light = new THREE.DirectionalLight(0xffffff, 4);
light.position.set(4, 7, 5);
scene.add(light);
const rim = new THREE.DirectionalLight(0x95d9cd, 2);
rim.position.set(-5, 2, -3);
scene.add(rim);
const grid = new THREE.GridHelper(12, 24, 0xacc6ba, 0xd5e3db);
grid.position.y = -2.1;
scene.add(grid);
let model = new THREE.Group();
scene.add(model);
const metal = new THREE.MeshStandardMaterial({color:0xaab9b5, metalness:.55, roughness:.3});
const shell = new THREE.MeshStandardMaterial({color:0xe1e8e4, metalness:.3, roughness:.4});
const copper = new THREE.MeshStandardMaterial({color:0xb76c3d, metalness:.55, roughness:.34});
const dark = new THREE.MeshStandardMaterial({color:0x263b36, roughness:.45});
const green = new THREE.MeshStandardMaterial({color:0x098761, roughness:.4});
const white = new THREE.MeshStandardMaterial({color:0xf5efdc, roughness:.7});
const groups = [];
const descriptions = {
  pall:['Filtration pressure vessel','Shell, cartridge bundle, tube sheet, gasket and closure.'],
  rmu:['Ring main unit','Enclosure, three operating bays, conductors and access panels.'],
  gis:['Gas-insulated switchgear','Control compartment, sealed tank, mechanism and cable compartment.'],
  thermal:['Finned heat sink','Base plate, fin bank and airflow arrows.'],
  iot:['Energy monitoring module','Circuit board, sensing blocks and display.']
};
function part(name, offset) {
  const group = new THREE.Group();
  group.name = name;
  group.userData.offset = new THREE.Vector3(...offset);
  model.add(group);
  groups.push(group);
  return group;
}
function box(group, size, position, material = shell) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  group.add(mesh);
  return mesh;
}
function cylinder(group, radius, height, position, material = metal, open = false) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 48, 1, open), material);
  mesh.position.set(...position);
  group.add(mesh);
  return mesh;
}
function ring(group, radius, tube, y, material = metal) {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 12, 64), material);
  mesh.rotation.x = Math.PI/2;
  mesh.position.y = y;
  group.add(mesh);
}
function render() { if (dialog.open) renderer.render(scene, camera); }
function explode() {
  const value = Number(dialog.querySelector('#model-spread').value)/100;
  groups.forEach(group => group.position.copy(group.userData.offset).multiplyScalar(value));
  dialog.querySelector('#model-spread-value').textContent = Math.round(value*100)+'%';
  render();
}
function resetCamera() {
  groups.forEach(group=>group.position.copy(group.userData.offset));
  const bounds = new THREE.Box3().setFromObject(model).getBoundingSphere(new THREE.Sphere());
  const distance = bounds.radius / Math.sin(Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*Math.min(camera.aspect,1))) * 1.1;
  controls.target.copy(bounds.center);
  camera.position.set(.5,.3,1).normalize().multiplyScalar(distance).add(bounds.center);
  controls.minDistance = bounds.radius;
  controls.maxDistance = distance*2;
  explode();
  controls.update();
  render();
}
function resize() {
  const {width,height} = viewport.getBoundingClientRect();
  if (!width || !height) return;
  camera.aspect = width/height;
  camera.updateProjectionMatrix();
  renderer.setSize(width,height);
  resetCamera();
}
new ResizeObserver(resize).observe(viewport);
controls.addEventListener('change',render);
dialog.querySelector('#model-spread').addEventListener('input',explode);
dialog.querySelector('#model-select').addEventListener('change',event=>showModel(event.target.value));
dialog.querySelectorAll('[data-model-view]').forEach(button=>button.addEventListener('click',()=>{
  dialog.querySelector('#model-spread').value = button.dataset.modelView;
  explode();
}));
dialog.querySelector('[data-model-reset]').addEventListener('click',()=>{dialog.querySelector('#model-spread').value=0;explode();resetCamera();});
dialog.querySelectorAll('[data-model-turn]').forEach(button=>button.addEventListener('click',()=>{
  camera.position.sub(controls.target).applyAxisAngle(new THREE.Vector3(0,1,0),Number(button.dataset.modelTurn)*Math.PI/6).add(controls.target);
  controls.update();
}));
dialog.querySelectorAll('[data-model-zoom]').forEach(button=>button.addEventListener('click',()=>{
  const offset=camera.position.clone().sub(controls.target);
  offset.setLength(THREE.MathUtils.clamp(offset.length()*Number(button.dataset.modelZoom),controls.minDistance,controls.maxDistance));
  camera.position.copy(controls.target).add(offset);
  controls.update();
}));
dialog.querySelector('[data-model-wire]').addEventListener('click',event=>{
  const on=event.currentTarget.getAttribute('aria-pressed')!=='true';
  event.currentTarget.setAttribute('aria-pressed',String(on));
  [metal,shell,copper,dark,green,white].forEach(material=>material.wireframe=on);
  render();
});

export function showModel(key) {
  model.traverse(object=>object.geometry?.dispose());
  scene.remove(model);
  model = new THREE.Group();
  scene.add(model);
  groups.length=0;
  dialog.querySelector('#model-select').value=key;
  dialog.querySelector('#model-title').textContent=descriptions[key][0];
  dialog.querySelector('#model-description').textContent=descriptions[key][1];
  if(key==='pall'){
    const body=part('Vessel shell',[0,-.5,0]);
    cylinder(body,.88,2,[0,-.4,0],metal,true);
    cylinder(body,.88,.12,[0,-1.4,0]);
    ring(body,.9,.07,.6);
    for(const x of [-.62,.62])for(const z of [-.45,.45])box(body,[.12,.55,.12],[x,-1.7,z],metal);
    for(const x of [-1,1]){const nozzle=cylinder(body,.2,.7,[x,-.6,0]);nozzle.rotation.z=Math.PI/2;}
    const filters=part('Cartridge bundle',[0,1.6,0]);
    for(let i=0;i<7;i++){
      const angle=i*Math.PI/3;
      const x=i===6?0:Math.cos(angle)*.48,z=i===6?0:Math.sin(angle)*.48;
      cylinder(filters,.17,1.65,[x,-.2,z],white);
      for(const y of [-1.03,.63])cylinder(filters,.18,.08,[x,y,z],metal);
    }
    const sheet=part('Tube sheet',[0,2.25,0]);
    cylinder(sheet,.85,.12,[0,.74,0]);
    const gasket=part('Closure gasket',[0,2.8,0]);ring(gasket,.9,.045,.87,dark);
    const lid=part('Bolted closure',[0,3.35,0]);
    cylinder(lid,.98,.12,[0,1,0]);
    const dome=new THREE.Mesh(new THREE.SphereGeometry(.88,48,24,0,Math.PI*2,0,Math.PI/2),metal);
    dome.scale.y=.45;dome.position.y=1.02;lid.add(dome);
    for(let i=0;i<12;i++){const a=i*Math.PI/6;cylinder(lid,.055,.14,[Math.cos(a)*.9,1.14,Math.sin(a)*.9],dark);}
  } else if(key==='rmu'||key==='gis'){
    const wide=key==='rmu',width=wide?2.8:1.55,height=wide?2.7:3.4;
    const enclosure=part('Enclosure',[0,0,-.7]);
    box(enclosure,[width,.12,1.2],[0,-1.45,0]);
    box(enclosure,[width,height,.09],[0,height/2-1.4,-.6]);
    for(const x of [-width/2,width/2])box(enclosure,[.09,height,1.2],[x,height/2-1.4,0]);
    const roof=part('Roof',[0,1.1,0]);box(roof,[width+.12,.12,1.3],[0,height-1.36,0]);
    const tank=part('Sealed tank',[0,.5,0]);box(tank,[width-.25,1.1,.75],[0,.1,-.1],metal);
    const mechanisms=part('Operating mechanisms',[0,.1,1]);
    for(let i=0;i<3;i++){
      const x=(i-1)*width/3.3;
      box(mechanisms,[width/3.8,.6,.2],[x,.1,.48],dark);
      box(mechanisms,[.06,.58,.07],[x,-.8,.24],copper);
      const bushing=cylinder(mechanisms,.12,.4,[x,-.8,.3],dark);bushing.rotation.x=Math.PI/2;
    }
    const panels=part('Front panels',[0,0,2]);
    for(let i=0;i<(wide?3:1);i++){
      const x=wide?(i-1)*width/3:0,w=wide?width/3-.05:width-.12;
      box(panels,[w,height-.14,.09],[x,height/2-1.4,.7]);
      box(panels,[w*.5,.35,.035],[x,height-1.85,.77],dark);
      box(panels,[.05,.25,.06],[x+w*.32,-.25,.78],dark);
      for(let j=0;j<3;j++){const indicator=cylinder(panels,.035,.04,[x+(j-1)*.12,.3,.78],j===1?green:copper);indicator.rotation.x=Math.PI/2;}
    }
  } else if(key==='thermal'){
    const base=part('Base plate',[0,-.5,0]);box(base,[2.6,.25,2],[0,-.8,0],metal);
    const fins=part('Fin bank',[0,1.1,0]);
    for(let i=0;i<9;i++)box(fins,[.085,1.45,1.9],[-1.12+i*.28,.05,0],metal);
    const flow=part('Airflow direction',[0,2.1,0]);
    for(const x of [-.8,0,.8]){const arrow=new THREE.ArrowHelper(new THREE.Vector3(0,0,-1),new THREE.Vector3(x,.5,1.4),2.8,0x089dbc,.35,.18);flow.add(arrow);}
  } else {
    const board=part('Circuit board',[0,-.5,0]);box(board,[2.7,.1,1.8],[0,-.7,0],green);
    const sensors=part('Sensing and control',[0,.7,0]);
    for(const x of [-.8,0,.8]){box(sensors,[.48,.2,.48],[x,-.52,0],dark);for(const z of [-.3,.3])box(sensors,[.42,.05,.06],[x,-.52,z],metal);}
    for(let i=0;i<10;i++)box(board,[.1,.15,.1],[-1.1+i*.24,-.58,.68],copper);
    const screen=part('Display',[0,1.7,0]);box(screen,[1.45,.85,.14],[0,.15,-.5],dark);box(screen,[1.25,.65,.02],[0,.15,-.42],green);
  }
  dialog.querySelector('#model-parts').textContent=groups.map(group=>group.name).join(' · ');
  dialog.querySelector('#model-spread').value=0;
  dialog.querySelector('.model-fallback').hidden=true;
  dialog.querySelector('#model-status').textContent='Drag to rotate · Scroll or pinch to zoom';
  explode();resetCamera();resize();
}
