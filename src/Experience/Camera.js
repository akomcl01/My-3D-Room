import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
    constructor(_options)
    {
        // Options
        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.targetElement = this.experience.targetElement
        this.scene = this.experience.scene

        // Set up
        this.mode = 'default' // default \ debug

        this.setInstance()
        this.setModes()
    }

    setInstance()
    {
        // Set up
        this.instance = new THREE.PerspectiveCamera(20, this.config.width / this.config.height, 0.1, 150)
        this.instance.rotation.reorder('YXZ')

        this.scene.add(this.instance)
    }

    setModes()
    {
        this.modes = {}

        // Default
        this.modes.default = {}
        this.modes.default.instance = this.instance.clone()
        this.modes.default.instance.rotation.reorder('YXZ')

        // Screen view
        this.modes.screen = {}
        this.modes.screen.instance = this.instance.clone()
        this.modes.screen.instance.rotation.reorder('YXZ')
        this.modes.screen.instance.position.set(0, 3.5, 1.2) // Adjusted Z position to 1.2
        this.modes.screen.instance.lookAt(0, 3.5, 0) // Look at center of screen at same height

        // Debug
        this.modes.debug = {}
        this.modes.debug.instance = this.instance.clone()
        this.modes.debug.instance.rotation.reorder('YXZ')
        this.modes.debug.instance.position.set(- 15, 15, 15)
        
        this.modes.debug.orbitControls = new OrbitControls(this.modes.debug.instance, this.targetElement)
        this.modes.debug.orbitControls.enabled = false
        this.modes.debug.orbitControls.screenSpacePanning = true
        this.modes.debug.orbitControls.enableKeys = false
        this.modes.debug.orbitControls.zoomSpeed = 0.25
        this.modes.debug.orbitControls.enableDamping = true
        this.modes.debug.orbitControls.update()
    }

    // Add new method for smooth camera transition
    transitionToScreen()
    {
        const startPosition = this.modes.default.instance.position.clone()
        const startRotation = this.modes.default.instance.rotation.clone()
        const endPosition = this.modes.screen.instance.position.clone()
        const endRotation = this.modes.screen.instance.rotation.clone()

        const duration = 1000 // 1 second
        const startTime = Date.now()

        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)

            // Ease in-out function
            const easeProgress = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 2) / 2

            // Interpolate position and rotation
            this.modes.default.instance.position.lerpVectors(startPosition, endPosition, easeProgress)
            this.modes.default.instance.rotation.x = THREE.MathUtils.lerp(startRotation.x, endRotation.x, easeProgress)
            this.modes.default.instance.rotation.y = THREE.MathUtils.lerp(startRotation.y, endRotation.y, easeProgress)
            this.modes.default.instance.rotation.z = THREE.MathUtils.lerp(startRotation.z, endRotation.z, easeProgress)

            if (progress < 1) {
                requestAnimationFrame(animate)
            } else {
                // After animation completes, set the mode to screen
                this.mode = 'screen'
            }
        }

        animate()
    }

    // Add method to return to default view
    returnToDefault()
    {
        const startPosition = this.modes.screen.instance.position.clone()
        const startRotation = this.modes.screen.instance.rotation.clone()
        const endPosition = this.modes.default.instance.position.clone()
        const endRotation = this.modes.default.instance.rotation.clone()

        const duration = 1000 // 1 second
        const startTime = Date.now()

        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)

            // Ease in-out function
            const easeProgress = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 2) / 2

            // Interpolate position and rotation
            this.modes.default.instance.position.lerpVectors(startPosition, endPosition, easeProgress)
            this.modes.default.instance.rotation.x = THREE.MathUtils.lerp(startRotation.x, endRotation.x, easeProgress)
            this.modes.default.instance.rotation.y = THREE.MathUtils.lerp(startRotation.y, endRotation.y, easeProgress)
            this.modes.default.instance.rotation.z = THREE.MathUtils.lerp(startRotation.z, endRotation.z, easeProgress)

            if (progress < 1) {
                requestAnimationFrame(animate)
            } else {
                // After animation completes, set the mode back to default
                this.mode = 'default'
            }
        }

        animate()
    }

    resize()
    {
        this.instance.aspect = this.config.width / this.config.height
        this.instance.updateProjectionMatrix()

        this.modes.default.instance.aspect = this.config.width / this.config.height
        this.modes.default.instance.updateProjectionMatrix()

        this.modes.debug.instance.aspect = this.config.width / this.config.height
        this.modes.debug.instance.updateProjectionMatrix()
    }

    update()
    {
        // Update debug orbit controls
        this.modes.debug.orbitControls.update()

        // Apply coordinates
        this.instance.position.copy(this.modes[this.mode].instance.position)
        this.instance.quaternion.copy(this.modes[this.mode].instance.quaternion)
        this.instance.updateMatrixWorld() // To be used in projection
    }

    destroy()
    {
        this.modes.debug.orbitControls.destroy()
    }
}
