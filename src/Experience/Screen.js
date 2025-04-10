import * as THREE from 'three'

import Experience from './Experience.js'
import Quiz from './Quiz.js'

export default class Screen
{
    constructor()
    {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene
        this.quiz = new Quiz()
        this.isZoomed = false

        this.setModel()
        this.setInteraction()
    }

    setModel()
    {
        this.model = {}

        // PC Screen
        this.model.pcScreen = this.resources.items.pcScreenModel.scene.children[0]
        this.scene.add(this.model.pcScreen)

        // Store original material
        this.originalMaterial = this.model.pcScreen.material.clone()

        // Create modal container
        this.modalContainer = document.createElement('div')
        this.modalContainer.style.position = 'fixed'
        this.modalContainer.style.top = '0'
        this.modalContainer.style.left = '0'
        this.modalContainer.style.width = '100%'
        this.modalContainer.style.height = '100%'
        this.modalContainer.style.display = 'none'
        this.modalContainer.style.zIndex = '1000'
        document.body.appendChild(this.modalContainer)

        // Add quiz element to modal container
        this.quiz.element.style.position = 'absolute'
        this.quiz.element.style.width = '800px'
        this.quiz.element.style.height = 'auto'
        this.quiz.element.style.backgroundColor = 'white'
        this.quiz.element.style.borderRadius = '8px'
        this.quiz.element.style.overflow = 'auto'
        this.quiz.element.style.boxShadow = '0 0 20px rgba(0,0,0,0.2)'
        this.quiz.element.style.padding = '20px'
        this.modalContainer.appendChild(this.quiz.element)

        // Mac Screen
        this.model.macScreen = this.resources.items.macScreenModel.scene.children[0]
        this.scene.add(this.model.macScreen)

        // Add hover effect material
        this.hoverMaterial = new THREE.MeshBasicMaterial({
            color: 0xff6700,
            transparent: true,
            opacity: 0.5
        })

        // Store original materials
        this.originalMaterials = {
            pcScreen: this.model.pcScreen.material,
            macScreen: this.model.macScreen.material
        }
    }

    updateModalPosition()
    {
        if (!this.isZoomed) return

        // Get screen position in 3D space
        const screenPosition = new THREE.Vector3()
        this.model.pcScreen.getWorldPosition(screenPosition)

        // Project 3D position to 2D screen coordinates
        const vector = screenPosition.project(this.experience.camera.instance)
        const x = (vector.x * 0.5 + 0.5) * window.innerWidth
        const y = -(vector.y * 0.5 - 0.5) * window.innerHeight

        // Update modal position - centered on screen
        this.quiz.element.style.left = `${x - 400}px`
        this.quiz.element.style.top = `${y - 200}px`
    }

    setInteraction()
    {
        // Create raycaster for interaction
        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()

        // Add click event listener
        window.addEventListener('click', (event) => {
            if (this.isZoomed) {
                return
            }

            // Calculate mouse position in normalized device coordinates
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

            // Update the picking ray with the camera and mouse position
            this.raycaster.setFromCamera(this.mouse, this.experience.camera.instance)

            // Calculate objects intersecting the picking ray
            const intersects = this.raycaster.intersectObjects([this.model.pcScreen, this.model.macScreen])

            if (intersects.length > 0) {
                // Zoom into screen
                this.experience.camera.transitionToScreen()
                this.isZoomed = true
                
                // Show modal
                this.modalContainer.style.display = 'block'
                this.updateModalPosition()
            }
        })

        // Add hover effect (only when not zoomed)
        window.addEventListener('mousemove', (event) => {
            if (this.isZoomed) return // Don't handle hover when zoomed

            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

            this.raycaster.setFromCamera(this.mouse, this.experience.camera.instance)
            const intersects = this.raycaster.intersectObjects([this.model.pcScreen, this.model.macScreen])

            if (intersects.length > 0) {
                // Apply hover effect
                intersects[0].object.material = this.hoverMaterial
            } else {
                // Restore original materials
                this.model.pcScreen.material = this.originalMaterials.pcScreen
                this.model.macScreen.material = this.originalMaterials.macScreen
            }
        })

        // Add escape key listener to return to default view
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isZoomed) {
                this.experience.camera.returnToDefault()
                this.isZoomed = false
                // Hide modal
                this.modalContainer.style.display = 'none'
                // Restore original material
                this.model.pcScreen.material = this.originalMaterials.pcScreen
            }
        })

        // Update modal position on window resize
        window.addEventListener('resize', () => {
            this.updateModalPosition()
        })
    }

    update()
    {
        if (this.isZoomed) {
            this.updateModalPosition()
        }
    }
}