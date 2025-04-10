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

        // Get monitor dimensions
        const monitorBox = new THREE.Box3().setFromObject(this.model.pcScreen)
        const monitorSize = monitorBox.getSize(new THREE.Vector3())
        this.monitorAspectRatio = monitorSize.x / monitorSize.y

        // Create video texture for PC screen
        this.pcVideo = document.createElement('video')
        this.pcVideo.src = '/assets/videoPortfolio.mp4'
        this.pcVideo.loop = true
        this.pcVideo.muted = true
        this.pcVideo.play()

        this.pcVideoTexture = new THREE.VideoTexture(this.pcVideo)
        this.pcVideoTexture.encoding = THREE.sRGBEncoding
        this.pcVideoTexture.minFilter = THREE.LinearFilter
        this.pcVideoTexture.magFilter = THREE.LinearFilter

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

        // Set fixed modal dimensions
        const modalWidth = 800
        const modalHeight = 600

        // Add quiz element to modal container
        this.quiz.element.style.position = 'absolute'
        this.quiz.element.style.width = `${modalWidth}px`
        this.quiz.element.style.height = `${modalHeight}px`
        this.quiz.element.style.backgroundColor = 'white'
        this.quiz.element.style.borderRadius = '12px'
        this.quiz.element.style.boxShadow = '0 0 30px rgba(0,0,0,0.3)'
        this.quiz.element.style.padding = '30px'
        this.quiz.element.style.display = 'flex'
        this.quiz.element.style.flexDirection = 'column'
        this.quiz.element.style.justifyContent = 'flex-start'
        this.quiz.element.style.gap = '20px'
        this.quiz.element.style.overflow = 'auto'
        this.quiz.element.style.maxHeight = '80vh'
        this.quiz.element.style.overflowY = 'auto'
        this.quiz.element.style.overflowX = 'hidden'
        this.quiz.element.style.scrollbarWidth = 'thin'
        this.quiz.element.style.scrollbarColor = '#ff6700 #f0f0f0'
        this.quiz.element.style.zIndex = '1001'

        // Create close button
        const closeButton = document.createElement('button')
        closeButton.innerHTML = '×'
        closeButton.style.position = 'absolute'
        closeButton.style.top = '10px'
        closeButton.style.right = '10px'
        closeButton.style.width = '30px'
        closeButton.style.height = '30px'
        closeButton.style.border = 'none'
        closeButton.style.background = 'none'
        closeButton.style.color = '#ff6700'
        closeButton.style.fontSize = '24px'
        closeButton.style.cursor = 'pointer'
        closeButton.style.zIndex = '1002'
        closeButton.style.padding = '0'
        closeButton.style.display = 'flex'
        closeButton.style.alignItems = 'center'
        closeButton.style.justifyContent = 'center'
        closeButton.style.borderRadius = '50%'
        closeButton.style.transition = 'all 0.3s ease'

        // Add hover effect
        closeButton.addEventListener('mouseover', () => {
            closeButton.style.backgroundColor = 'rgba(255, 103, 0, 0.1)'
            closeButton.style.transform = 'scale(1.1)'
        })
        closeButton.addEventListener('mouseout', () => {
            closeButton.style.backgroundColor = 'transparent'
            closeButton.style.transform = 'scale(1)'
        })

        // Add click handler
        closeButton.addEventListener('click', () => {
            this.experience.camera.returnToDefault()
            this.isZoomed = false
            this.modalContainer.style.display = 'none'
            this.model.pcScreen.material = new THREE.MeshBasicMaterial({
                map: this.pcVideoTexture,
                side: THREE.DoubleSide
            })
        })

        this.quiz.element.appendChild(closeButton)

        // Add custom scrollbar styles
        const style = document.createElement('style')
        style.textContent = `
            .quiz-container::-webkit-scrollbar {
                width: 8px;
            }
            .quiz-container::-webkit-scrollbar-track {
                background: #f0f0f0;
                border-radius: 4px;
            }
            .quiz-container::-webkit-scrollbar-thumb {
                background: #ff6700;
                border-radius: 4px;
            }
            .quiz-container::-webkit-scrollbar-thumb:hover {
                background: #e55c00;
            }
        `
        document.head.appendChild(style)
        this.quiz.element.classList.add('quiz-container')

        // Ensure the modal container doesn't interfere with scrolling
        this.modalContainer.style.overflow = 'hidden'
        this.modalContainer.style.pointerEvents = 'auto'
        this.modalContainer.appendChild(this.quiz.element)

        // Mac Screen
        this.model.macScreen = this.resources.items.macScreenModel.scene.children[0]
        this.scene.add(this.model.macScreen)

        // Create video texture for Mac screen
        this.macVideo = document.createElement('video')
        this.macVideo.src = '/assets/videoStream.mp4'
        this.macVideo.loop = true
        this.macVideo.muted = true
        this.macVideo.play()

        this.macVideoTexture = new THREE.VideoTexture(this.macVideo)
        this.macVideoTexture.encoding = THREE.sRGBEncoding
        this.macVideoTexture.minFilter = THREE.LinearFilter
        this.macVideoTexture.magFilter = THREE.LinearFilter

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

        // Apply video textures to screens
        this.model.pcScreen.material = new THREE.MeshBasicMaterial({
            map: this.pcVideoTexture,
            side: THREE.DoubleSide
        })

        this.model.macScreen.material = new THREE.MeshBasicMaterial({
            map: this.macVideoTexture,
            side: THREE.DoubleSide
        })
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

        // Calculate adaptive modal size based on screen dimensions
        const maxWidth = Math.min(800, window.innerWidth * 0.8) // 80% of screen width, max 800px
        const maxHeight = Math.min(600, window.innerHeight * 0.8) // 80% of screen height, max 600px
        
        // Update modal dimensions
        this.quiz.element.style.width = `${maxWidth}px`
        this.quiz.element.style.height = `${maxHeight}px`

        // Calculate padding to ensure content is visible
        const padding = Math.min(30, maxWidth * 0.05) // 5% of width, max 30px
        this.quiz.element.style.padding = `${padding}px`

        // Update modal position - centered on monitor
        this.quiz.element.style.left = `${x - (maxWidth / 2)}px`
        this.quiz.element.style.top = `${y - (maxHeight / 2)}px`

        // Ensure modal stays within viewport bounds
        const rect = this.quiz.element.getBoundingClientRect()
        const margin = 20 // Minimum margin from screen edges

        if (rect.left < margin) {
            this.quiz.element.style.left = `${margin}px`
        }
        if (rect.right > window.innerWidth - margin) {
            this.quiz.element.style.left = `${window.innerWidth - maxWidth - margin}px`
        }
        if (rect.top < margin) {
            this.quiz.element.style.top = `${margin}px`
        }
        if (rect.bottom > window.innerHeight - margin) {
            this.quiz.element.style.top = `${window.innerHeight - maxHeight - margin}px`
        }
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
                this.model.pcScreen.material = new THREE.MeshBasicMaterial({
                    map: this.pcVideoTexture,
                    side: THREE.DoubleSide
                })
                this.model.macScreen.material = new THREE.MeshBasicMaterial({
                    map: this.macVideoTexture,
                    side: THREE.DoubleSide
                })
            }
        })

        // Add escape key listener to return to default view
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isZoomed) {
                this.experience.camera.returnToDefault()
                this.isZoomed = false
                // Hide modal
                this.modalContainer.style.display = 'none'
                // Restore video material
                this.model.pcScreen.material = new THREE.MeshBasicMaterial({
                    map: this.pcVideoTexture,
                    side: THREE.DoubleSide
                })
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