AFRAME.registerComponent('locker-puzzle', {

  init() {

    // =========================================
    // CONFIG
    // =========================================

    this.TOP_PASSWORD = [1,1,2,3,5]
    this.BOTTOM_PASSWORD = [8,1,3,2,1]

    this.ROTATION_STEP = 36
    this.SWIPE_THRESHOLD = 25

    // =========================================
    // AUDIO
    // =========================================

    this.tickAudio =
      new Audio('assets/audio/tick.mp3')

    this.solveAudio =
      new Audio('assets/audio/solve.mp3')

    this.unlockAudio =
      new Audio('assets/audio/unlock.mp3')

    // =========================================
    // STATE
    // =========================================

    this.knobs = []

    this.currentTop = [0,0,0,0,0]
    this.currentBottom = [0,0,0,0,0]

    this.topSolved = false
    this.bottomSolved = false

    this.dragging = false
    this.activeKnob = null

    this.startY = 0
    this.lastProcessedStep = 0

    // =========================================
    // MODEL LOADED
    // =========================================

    this.el.addEventListener('model-loaded', () => {

      this.model = this.el.getObject3D('mesh')

      // Hide hit meshes by material name
      this.model.traverse((child) => {

        if (!child.material) return

        if (child.material.name === 'hitMesh_mat') {

          child.visible = false

          child.material.transparent = true
          child.material.opacity = 0
        }
      })

      this.setupKnobs()

      this.randomizePuzzle()

      this.setupRaycaster()

      console.log('Locker Puzzle Ready')
    })
  },

  // =========================================
  // SETUP KNOBS
  // =========================================

  setupKnobs() {

    for (let i = 1; i <= 10; i++) {

      const id =
        String(i).padStart(2, '0')

      const codeMesh =
        this.model.getObjectByName(`Code_${id}`)

      const hitMesh =
        this.model.getObjectByName(`Hit_Code_${id}`)

      if (!codeMesh || !hitMesh) {

        console.warn(`Missing knob ${id}`)

        continue
      }

      const knob = {

        index: i,

        codeMesh,
        hitMesh,

        value: 0,

        targetRotation: 0,
        currentRotation: 0
      }

      hitMesh.userData.knobData = knob

      this.knobs.push(knob)
    }
  },

  // =========================================
  // RANDOMIZE
  // =========================================

  randomizePuzzle() {

    do {

      for (let i = 0; i < this.knobs.length; i++) {

        const randomValue =
          Math.floor(Math.random() * 10)

        this.knobs[i].value = randomValue

        this.knobs[i].targetRotation =
          THREE.MathUtils.degToRad(
            -randomValue * this.ROTATION_STEP
          )

        this.knobs[i].currentRotation =
          this.knobs[i].targetRotation

        this.knobs[i].codeMesh.rotation.z =
          this.knobs[i].targetRotation
      }

      this.updateCurrentStates()

    } while (

      this.checkTopSolved() ||
      this.checkBottomSolved()
    )
  },

  // =========================================
  // RAYCASTER
  // =========================================

  setupRaycaster() {

    this.camera =
      document.querySelector('[camera]')

    this.raycaster =
      new THREE.Raycaster()

    this.mouse =
      new THREE.Vector2()

    this.onPointerDown =
      this.onPointerDown.bind(this)

    this.onPointerMove =
      this.onPointerMove.bind(this)

    this.onPointerUp =
      this.onPointerUp.bind(this)

    // TOUCH
    window.addEventListener(
      'touchstart',
      this.onPointerDown,
      { passive: false }
    )

    window.addEventListener(
      'touchmove',
      this.onPointerMove,
      { passive: false }
    )

    window.addEventListener(
      'touchend',
      this.onPointerUp
    )

    // DESKTOP
    window.addEventListener(
      'mousedown',
      this.onPointerDown
    )

    window.addEventListener(
      'mousemove',
      this.onPointerMove
    )

    window.addEventListener(
      'mouseup',
      this.onPointerUp
    )
  },

  // =========================================
  // POINTER DOWN
  // =========================================

  onPointerDown(event) {

    if (!window.puzzleTrackingActive) return

    if (
      this.topSolved &&
      this.bottomSolved
    ) return

    const point =
      this.getPointerPosition(event)

    this.mouse.x =
      (point.x / window.innerWidth) * 2 - 1

    this.mouse.y =
      -(point.y / window.innerHeight) * 2 + 1

    this.raycaster.setFromCamera(

      this.mouse,

      this.camera.object3D.children[0]
    )

    const hitMeshes =
      this.knobs.map(k => k.hitMesh)

    const intersects =
      this.raycaster.intersectObjects(
        hitMeshes,
        true
      )

    if (!intersects.length) return

    const hit =
      intersects[0].object

    const knob =
      hit.userData.knobData

    if (!knob) return

    // TOP LOCK
    if (
      knob.index <= 5 &&
      this.topSolved
    ) return

    // BOTTOM LOCK
    if (
      knob.index > 5 &&
      this.bottomSolved
    ) return

    this.dragging = true

    this.activeKnob = knob

    this.startY = point.y

    this.lastProcessedStep = 0
  },

  // =========================================
  // POINTER MOVE
  // =========================================

  onPointerMove(event) {

    if (!this.dragging) return

    event.preventDefault()

    const point =
      this.getPointerPosition(event)

    const deltaY =
      point.y - this.startY

    const stepCount =
      Math.trunc(
        deltaY / this.SWIPE_THRESHOLD
      )

    if (
      stepCount ===
      this.lastProcessedStep
    ) return

    const direction =
      stepCount > this.lastProcessedStep
        ? 1
        : -1

    const stepsToMove =
      Math.abs(
        stepCount - this.lastProcessedStep
      )

    for (let i = 0; i < stepsToMove; i++) {

      this.rotateKnob(
        this.activeKnob,
        direction
      )
    }

    this.lastProcessedStep =
      stepCount
  },

  // =========================================
  // POINTER UP
  // =========================================

  onPointerUp() {

    this.dragging = false

    this.activeKnob = null
  },

  // =========================================
  // ROTATE
  // =========================================

  rotateKnob(knob, direction) {

    knob.value =
      (knob.value + direction + 10) % 10

    knob.targetRotation =
      THREE.MathUtils.degToRad(
        -knob.value * this.ROTATION_STEP
      )

    this.tickAudio.currentTime = 0

    this.tickAudio.play().catch(() => {})

    this.updateCurrentStates()

    this.validatePuzzle()
  },

  // =========================================
  // UPDATE STATES
  // =========================================

  updateCurrentStates() {

    this.currentTop =
      this.knobs
        .slice(0, 5)
        .map(k => k.value)

    this.currentBottom =
      this.knobs
        .slice(5, 10)
        .map(k => k.value)
  },

  // =========================================
  // VALIDATE
  // =========================================

  validatePuzzle() {

    // TOP
    if (

      !this.topSolved &&
      this.checkTopSolved()
    ) {

      this.topSolved = true

      this.solveAudio.currentTime = 0

      this.solveAudio.play().catch(() => {})

      if (window.onPuzzleSolved) {

        window.onPuzzleSolved('top')
      }
    }

    // BOTTOM
    if (

      !this.bottomSolved &&
      this.checkBottomSolved()
    ) {

      this.bottomSolved = true

      this.solveAudio.currentTime = 0

      this.solveAudio.play().catch(() => {})

      if (window.onPuzzleSolved) {

        window.onPuzzleSolved('bottom')
      }
    }

    // BOTH
    if (

      this.topSolved &&
      this.bottomSolved
    ) {

      this.unlockAudio.currentTime = 0

      this.unlockAudio.play().catch(() => {})

      if (window.onAllPuzzleSolved) {

        window.onAllPuzzleSolved()
      }
    }
  },

  // =========================================
  // CHECKS
  // =========================================

  checkTopSolved() {

    return this.currentTop.every(

      (v, i) =>
        v === this.TOP_PASSWORD[i]
    )
  },

  checkBottomSolved() {

    return this.currentBottom.every(

      (v, i) =>
        v === this.BOTTOM_PASSWORD[i]
    )
  },

  // =========================================
  // POINTER POSITION
  // =========================================

  getPointerPosition(event) {

    if (
      event.touches &&
      event.touches.length > 0
    ) {

      return {

        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      }
    }

    return {

      x: event.clientX,
      y: event.clientY
    }
  },

  // =========================================
  // TWEEN
  // =========================================

  tick(time, delta) {

    if (!this.knobs) return

    const lerpSpeed =
      Math.min(delta * 0.02, 0.25)

    this.knobs.forEach(knob => {

      knob.currentRotation =
        THREE.MathUtils.lerp(

          knob.currentRotation,

          knob.targetRotation,

          lerpSpeed
        )

      knob.codeMesh.rotation.z =
        knob.currentRotation
    })
  }
})