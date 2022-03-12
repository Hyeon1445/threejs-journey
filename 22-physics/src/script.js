import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import CANNON from 'cannon'

/**
 * Debug
 */
const gui = new dat.GUI()
const debugObjects = {} // gui에 추가하려면 object 타입이 필요
debugObjects.createSphere = () => {
  createSphere(
    Math.random() * 0.5, // radius
    { 
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3,
    }
  )
}
debugObjects.createBox = () => {
  createBox(
    Math.random(), // width
    Math.random(), // height
    Math.random(), // depth
    { 
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3,
    }
  )
}
gui.add(debugObjects, 'createSphere')
gui.add(debugObjects, 'createBox')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.png',
  '/textures/environmentMaps/0/nx.png',
  '/textures/environmentMaps/0/py.png',
  '/textures/environmentMaps/0/ny.png',
  '/textures/environmentMaps/0/pz.png',
  '/textures/environmentMaps/0/nz.png'
])

/**
 * Physics
 */
// World
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world) // for better performance
world.allowSleep = true // for better performance
world.gravity.set(0, - 9.82, 0) // gravity on earth(x, y, z)

// Materials
// const concreteMaterial = new CANNON.Material('concrete')
// const plasticMaterial = new CANNON.Material('plastic')

// const concretePlasticContactMaterial = new CANNON.ContactMaterial(
//   concreteMaterial,
//   plasticMaterial,
//   {
//     friction: 0.1, // 마찰
//     restitution: 0.7 // 복원력
//   }
// ) // plastic 과 concrete가 만났을 때에 대한 값들을 정의.
// world.addContactMaterial(concretePlasticContactMaterial)

const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1, // 마찰
    restitution: 0.7 // 복원력
  }
) 
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial
// ** 이렇게 하면 sphere, floor 의 material 지워도 동일하게 동작
// ** plastic, concrete는 알아보기 좋게 쓴거고, 어떤 이름으로 해도 가능.

// Floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
  mass: 0, // because floor is static (do not move)
  // material: concreteMaterial,
})
floorBody.addShape(floorShape) // floorBody.shape = floorShape
floorBody.quaternion.setFromAxisAngle(
  new CANNON.Vec3( - 1, 0, 0),
  Math.PI * 0.5
) // three.js의 floor가 x축 기준 -90도 회전했으므로 cannon.js의 floor도 회전
world.addBody(floorBody)

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
  })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Utils
 */
const objectsToUpdate = []

// Sphere
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture
})
const createSphere = (radius, position) => {
  // Three.js mesh
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
  mesh.scale.set(radius, radius, radius)
  mesh.castShadow = true
  mesh.position.copy(position)
  scene.add(mesh)

  // Cannon.js body
  const shape = new CANNON.Sphere(radius)
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
    material: defaultMaterial,
  })
  body.position.copy(position)
  world.addBody(body)

  // Save in objects to update
  objectsToUpdate.push({
    mesh,
    body,
  })
}

createSphere(0.5, { x: 0, y: 3, z: 0 })


// Box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture
})
const createBox = (width, height, depth, position) => {
  // Three.js mesh
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
  mesh.scale.set(width, height, depth)
  mesh.castShadow = true
  mesh.position.copy(position)
  scene.add(mesh)

  // Cannon.js body
  const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2))
  // three.js와는 다르게 center로부터의 width, height, depth기 때문에 / 2 필요
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
    material: defaultMaterial,
  })
  body.position.copy(position)
  world.addBody(body)

  // Save in objects to update
  objectsToUpdate.push({
    mesh,
    body,
  })
}
/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime

  // Update Physics World
  world.step(1 / 60, deltaTime, 3) // 1/60 (60fps)
  for(const object of objectsToUpdate) {
    object.mesh.position.copy(object.body.position)
    object.mesh.quaternion.copy(object.body.quaternion)
  }

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()