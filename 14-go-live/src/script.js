import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

const gui = new dat.GUI()
gui.close()
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()


const fontLoader = new FontLoader()
const textMaterial = new THREE.MeshStandardMaterial()
textMaterial.metalness = 0.5
textMaterial.roughness = 0.1
textMaterial.color.set('MediumVioletRed')


const donutMaterial = new THREE.MeshStandardMaterial()
donutMaterial.metalness = 0.6
donutMaterial.roughness = 0.1
donutMaterial.color.set('white')

fontLoader.load(
  '/fonts/helvetiker_bold.typeface.json',
  (font) => {
    const textGeometry = new TextGeometry(
      'Hello World !',
      {
        font,
        size: 0.5,
        height: 0.3,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4,
      }
    )
    textGeometry.center()

    const text = new THREE.Mesh(textGeometry, textMaterial)
    scene.add(text)

    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)

    for (let i = 0; i < 200; i++) {

      const donut = new THREE.Mesh(donutGeometry, donutMaterial)
      donut.position.x = (Math.random() - 0.5) * 10
      donut.position.y = (Math.random() - 0.5) * 10
      donut.position.z = (Math.random() - 0.5) * 10

      donut.rotation.x = Math.random() * Math.PI
      donut.rotation.y = Math.random() * Math.PI


      const scale = Math.random()
      donut.scale.set(scale, scale, scale)

      scene.add(donut)
    }
  }
)
const textColor = {
  color: 0xc71585,
}

gui.add(donutMaterial, 'metalness').min(0).max(1).step(0.0001)
gui.add(donutMaterial, 'roughness').min(0).max(1).step(0.0001)
gui.addColor(textColor, 'color').onChange(() => {
  textMaterial.color.set(textColor.color)
})


const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)


const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const tick = () => {

  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()