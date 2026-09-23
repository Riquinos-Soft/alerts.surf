<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'

const canvasContainer = ref<HTMLDivElement | null>(null)

let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let mesh: THREE.Mesh | null = null
let animationFrameId: number | null = null
let visibilityObserver: IntersectionObserver | null = null
let resumeAnimation: (() => void) | null = null
let isVisible = true

// Pointer coordinates
let targetMouseX = 0
let targetMouseY = 0
let mouseX = 0
let mouseY = 0

const initThree = () => {
  if (!canvasContainer.value || typeof WebGL2RenderingContext === 'undefined') return

  // Verify WebGL availability (fallback gracefully in mock/test environments)
  try {
    const width = canvasContainer.value.clientWidth || window.innerWidth
    const height = canvasContainer.value.clientHeight || 400

    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 8, 12)
    camera.lookAt(0, 0, 0)

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    canvasContainer.value.appendChild(renderer.domElement)

    // Surface wave plane
    const geometry = new THREE.PlaneGeometry(24, 18, 48, 36)
    geometry.rotateX(-Math.PI / 2)

    // Ocean material with gentle teal/cyan specular highlight
    const material = new THREE.MeshPhongMaterial({
      color: 0x0096c7,
      emissive: 0x0077b6,
      specular: 0x90e0ef,
      shininess: 60,
      wireframe: true,
      transparent: true,
      opacity: 0.55
    })

    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0x06d6a0, 1.2)
    directionalLight.position.set(5, 10, 7)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0x00b4d8, 2, 20)
    pointLight.position.set(0, 4, 2)
    scene.add(pointLight)

    const animate = (time: number) => {
      animationFrameId = null
      if (!isVisible || !renderer || !scene || !camera || !mesh) return

      // Smooth mouse easing
      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05

      camera.position.x = mouseX * 2
      camera.position.y = 8 + mouseY * 1.5
      camera.lookAt(0, 0, 0)

      // Animate vertices for ocean swell motion
      const positionAttribute = mesh.geometry.attributes.position
      const t = time * 0.0015

      for (let i = 0; i < positionAttribute.count; i++) {
        const u = positionAttribute.getX(i)
        const v = positionAttribute.getZ(i)

        // Multi-frequency wave calculation simulating ocean swell
        const wave1 = Math.sin(u * 0.4 + t * 1.5) * 0.6
        const wave2 = Math.cos(v * 0.5 + t * 1.2) * 0.4
        const wave3 = Math.sin((u + v) * 0.3 + t * 0.8) * 0.3

        positionAttribute.setY(i, wave1 + wave2 + wave3)
      }
      positionAttribute.needsUpdate = true

      renderer.render(scene, camera)
      resumeAnimation?.()
    }

    resumeAnimation = () => {
      if (isVisible && animationFrameId === null) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }
    resumeAnimation()
  } catch (err) {
    console.warn('WebGL / Three.js not supported in current environment:', err)
  }
}

const onPointerMove = (event: PointerEvent) => {
  const { innerWidth, innerHeight } = window
  targetMouseX = (event.clientX / innerWidth) * 2 - 1
  targetMouseY = -(event.clientY / innerHeight) * 2 + 1
}

const onResize = () => {
  if (!canvasContainer.value || !camera || !renderer) return
  const width = canvasContainer.value.clientWidth
  const height = canvasContainer.value.clientHeight
  if (width <= 0 || height <= 0) return
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

onMounted(() => {
  initThree()
  if (canvasContainer.value && typeof IntersectionObserver !== 'undefined') {
    visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry?.isIntersecting ?? true
      if (isVisible) {
        resumeAnimation?.()
      } else if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }
    })
    visibilityObserver.observe(canvasContainer.value)
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
  visibilityObserver?.disconnect()
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('resize', onResize)
  if (renderer && renderer.domElement && renderer.domElement.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement)
    renderer.dispose()
  }
  mesh?.geometry.dispose()
  if (mesh?.material instanceof THREE.Material) mesh.material.dispose()
})
</script>

<template>
  <div ref="canvasContainer" class="wave-canvas-3d" aria-hidden="true">
    <div class="canvas-ambient-gradient"></div>
  </div>
</template>

<style scoped>
.wave-canvas-3d {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.canvas-ambient-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 50% 40%,
    rgba(0, 180, 216, 0.08) 0%,
    rgba(244, 248, 251, 0.2) 60%,
    rgba(244, 248, 251, 0.95) 100%
  );
  pointer-events: none;
}
</style>
