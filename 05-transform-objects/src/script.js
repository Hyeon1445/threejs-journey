import './style.css'
import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)

// position
// mesh.position.x = 0.7
// mesh.position.y = - 0.6
// mesh.position.z = 1
mesh.position.set(0.7, - 0.6, 1)

// Scale
// mesh.scale.x = 2
// mesh.scale.y = 0.5
// mesh.scale.z = 0.5
mesh.scale.set(2, 0.5, 0.5)

// Rotation - pi = half a rotation, 2*PI = 360도
mesh.rotation.reorder('YXZ')
mesh.rotation.x = Math.PI * 0.25
mesh.rotation.y = Math.PI * 0.25

scene.add(mesh)
// mesh.position.normalize() 
// center - object 거리를 1로 바꿈

// Axes Helper 축 표시, 2 = unit(1) * 2
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

// Sizes
const sizes = {
  width: 800,
  height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// camera.lookAt(new THREE.Vector3(3, 0, 0))
camera.lookAt(mesh.position) // 계산 없이 도형의 중앙을 기준으로 카메라로 촬영

console.log(mesh.position.length()) 
// center로부터의 물체의 거리
console.log(mesh.position.distanceTo(new THREE.Vector3(0, 1, 2))) 
// 어떤 위치(0, 1, 2)로부터 물체 사이의 거리
console.log(mesh.position.distanceTo(camera.position))
// 카메라부터 물체 사이의 거리

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)