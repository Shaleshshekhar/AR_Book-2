AFRAME.registerComponent('locker-puzzle', {

  // =========================================
  // INIT
  // =========================================

  init() {

    console.log('===================================')
    console.log('LOCKER PUZZLE INIT STARTED')
    console.log('===================================')

    // =========================================
    // CONFIG
    // =========================================

    this.TOP_PASSWORD = [1,1,2,3,5]

    this.BOTTOM_PASSWORD = [8,1,3,2,1]

    this.ROTATION_STEP = 36

    this.SWIPE_THRESHOLD = 25

    console.log('PASSWORDS LOADED')

    console.log(
      'TOP PASSWORD:',
      this.TOP_PASSWORD
    )

    console.log(
      'BOTTOM PASSWORD:',
      this.BOTTOM_PASSWORD
    )

    // =========================================
    // AUDIO
    // =========================================

    console.log('CREATING AUDIO OBJECTS')

    this.tickAudio =
      new Audio('assets/audio/tick.mp3')

    this.solveAudio =
      new Audio('assets/audio/solve.mp3')

    this.unlockAudio =
      new Audio('assets/audio/unlock.mp3')

    console.log('AUDIO OBJECTS READY')

    // =========================================
    // STATE
    // =========================================

    this.knobs = []

    this.currentTop =
      [0,0,0,0,0]

    this.currentBottom =
      [0,0,0,0,0]

    this.topSolved = false
    this.bottomSolved = false

    this.dragging = false

    this.activeKnob = null

    this.startY = 0

    this.lastProcessedStep = 0

    console.log('INITIAL STATE CREATED')

    // =========================================
    // WAIT FOR MODEL
    // =========================================

    console.log('WAITING FOR MODEL LOADED EVENT')

    this.el.addEventListener(
      'model-loaded',
      () => {

        console.log('===================================')
        console.log('MODEL LOADED EVENT FIRED')
        console.log('===================================')

        this.model =
          this.el.getObject3D('mesh')

        console.log('MODEL REFERENCE:')
        console.log(this.model)

        if (!this.model) {

          console.error(
            'MODEL NOT FOUND'
          )

          return
        }

        // =====================================
        // HIDE HIT MESHES
        // =====================================

        console.log(
          'SEARCHING FOR HIT MESH MATERIALS'
        )

        let hiddenMeshes = 0

        this.model.traverse((child) => {

          if (!child.material) return

          console.log(
            'MATERIAL FOUND:',
            child.material.name
          )

          if (
            child.material.name ===
            'hitMesh_mat'
          ) {

            console.log(
              'HIDING HIT MESH:',
              child.name
            )

            child.visible = false

            child.material.transparent = true

            child.material.opacity = 0

            hiddenMeshes++
          }
        })

        console.log(
          'TOTAL HIDDEN HIT MESHES:',
          hiddenMeshes
        )

        // =====================================
        // SETUP KNOBS
        // =====================================

        this.setupKnobs()

        console.log(
          'TOTAL KNOBS REGISTERED:',
          this.knobs.length
        )

        // =====================================
        // RANDOMIZE
        // =====================================

        this.randomizePuzzle()

        // =====================================
        // RAYCASTER
        // =====================================

        this.setupRaycaster()

        console.log('===================================')
        console.log('LOCKER PUZZLE READY')
        console.log('===================================')
      }
    )
  },

  // =========================================
  // SETUP KNOBS
  // =========================================

  setupKnobs() {

    console.log('===================================')
    console.log('SETTING UP KNOBS')
    console.log('===================================')

    for (let i = 1; i <= 10; i++) {

      const id =
        String(i).padStart(2, '0')

      console.log(
        'SEARCHING FOR KNOB:',
        id
      )

      const codeMesh =
        this.model.getObjectByName(
          `Code_${id}`
        )

      const hitMesh =
        this.model.getObjectByName(
          `Hit_Code_${id}`
        )

      console.log(
        'CODE MESH:',
        codeMesh
      )

      console.log(
        'HIT MESH:',
        hitMesh
      )

      if (!codeMesh || !hitMesh) {

        console.error(
          `MISSING KNOB ${id}`
        )

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

      console.log(
        `KNOB ${id} REGISTERED`
      )
    }
  },

  // =========================================
  // RANDOMIZE
  // =========================================

  randomizePuzzle() {

    console.log('===================================')
    console.log('RANDOMIZING PUZZLE')
    console.log('===================================')

    let validState = false

    while (!validState) {

      for (
        let i = 0;
        i < this.knobs.length;
        i++
      ) {

        const randomValue =
          Math.floor(Math.random() * 10)

        this.knobs[i].value =
          randomValue

        console.log(
          `KNOB ${i + 1} RANDOM VALUE:`,
          randomValue
        )

        this.knobs[i].targetRotation =
          THREE.MathUtils.degToRad(
            -randomValue *
            this.ROTATION_STEP
          )

        this.knobs[i].currentRotation =
          this.knobs[i].targetRotation

        this.knobs[i]
          .codeMesh
          .rotation
          .z =
          this.knobs[i]
            .targetRotation
      }

      this.updateCurrentStates()

      const topSolved =
        this.checkTopSolved()

      const bottomSolved =
        this.checkBottomSolved()

      console.log(
        'TOP SOLVED?',
        topSolved
      )

      console.log(
        'BOTTOM SOLVED?',
        bottomSolved
      )

      validState =
        !topSolved &&
        !bottomSolved
    }

    console.log('VALID RANDOM STATE GENERATED')
  },

  // =========================================
  // RAYCASTER
  // =========================================

  setupRaycaster() {

    console.log('===================================')
    console.log('SETTING UP RAYCASTER')
    console.log('===================================')

    this.camera =
      document.querySelector('[camera]')

    console.log(
      'CAMERA:',
      this.camera
    )

    this.raycaster =
      new THREE.Raycaster()

    this.mouse =
      new THREE.Vector2()

    console.log('RAYCASTER READY')

    // BIND FUNCTIONS

    this.onPointerDown =
      this.onPointerDown.bind(this)

    this.onPointerMove =
      this.onPointerMove.bind(this)

    this.onPointerUp =
      this.onPointerUp.bind(this)

    console.log('FUNCTIONS BOUND')

    // TOUCH EVENTS

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

    console.log('TOUCH EVENTS REGISTERED')

    // MOUSE EVENTS

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

    console.log('MOUSE EVENTS REGISTERED')
  },

  // =========================================
  // POINTER DOWN
  // =========================================

  onPointerDown(event) {

    console.log('===================================')
    console.log('POINTER DOWN')
    console.log('===================================')

    console.log(
      'TRACKING ACTIVE:',
      window.puzzleTrackingActive
    )

    if (!window.puzzleTrackingActive) {

      console.log(
        'BLOCKED: tracking inactive'
      )

      return
    }

    if (
      this.topSolved &&
      this.bottomSolved
    ) {

      console.log(
        'BLOCKED: puzzle already solved'
      )

      return
    }

    const point =
      this.getPointerPosition(event)

    console.log(
      'POINTER POSITION:',
      point
    )

    this.mouse.x =
      (point.x / window.innerWidth) * 2 - 1

    this.mouse.y =
      -(point.y / window.innerHeight) * 2 + 1

    console.log(
      'NORMALIZED MOUSE:',
      this.mouse
    )

    this.raycaster.setFromCamera(

      this.mouse,

      this.camera.object3D.children[0]
    )

    console.log('RAYCASTER FIRED')

    const hitMeshes =
      this.knobs.map(
        k => k.hitMesh
      )

    console.log(
      'HIT MESH COUNT:',
      hitMeshes.length
    )

    const intersects =
      this.raycaster.intersectObjects(
        hitMeshes,
        true
      )

    console.log(
      'INTERSECTIONS:',
      intersects
    )

    if (!intersects.length) {

      console.log(
        'NO HIT DETECTED'
      )

      return
    }

    const hit =
      intersects[0].object

    console.log(
      'HIT OBJECT:',
      hit
    )

    const knob =
      hit.userData.knobData

    console.log(
      'KNOB DATA:',
      knob
    )

    if (!knob) {

      console.log(
        'NO KNOB DATA FOUND'
      )

      return
    }

    // TOP LOCK

    if (
      knob.index <= 5 &&
      this.topSolved
    ) {

      console.log(
        'TOP ROW LOCKED'
      )

      return
    }

    // BOTTOM LOCK

    if (
      knob.index > 5 &&
      this.bottomSolved
    ) {

      console.log(
        'BOTTOM ROW LOCKED'
      )

      return
    }

    this.dragging = true

    this.activeKnob = knob

    this.startY = point.y

    this.lastProcessedStep = 0

    console.log(
      'DRAGGING STARTED'
    )

    console.log(
      'ACTIVE KNOB:',
      knob.index
    )
  },

  // =========================================
  // POINTER MOVE
  // =========================================

  onPointerMove(event) {

    if (!this.dragging) return

    const point =
      this.getPointerPosition(event)

    const deltaY =
      point.y - this.startY

    const stepCount =
      Math.trunc(
        deltaY /
        this.SWIPE_THRESHOLD
      )

    console.log('-----------------------------------')

    console.log(
      'DRAG MOVE'
    )

    console.log(
      'DELTA Y:',
      deltaY
    )

    console.log(
      'STEP COUNT:',
      stepCount
    )

    if (
      stepCount ===
      this.lastProcessedStep
    ) {

      return
    }

    const direction =
      stepCount >
      this.lastProcessedStep
        ? 1
        : -1

    console.log(
      'ROTATION DIRECTION:',
      direction
    )

    const stepsToMove =
      Math.abs(
        stepCount -
        this.lastProcessedStep
      )

    console.log(
      'STEPS TO MOVE:',
      stepsToMove
    )

    for (
      let i = 0;
      i < stepsToMove;
      i++
    ) {

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

    if (!this.dragging) return

    console.log('===================================')
    console.log('POINTER UP')
    console.log('===================================')

    this.dragging = false

    this.activeKnob = null

    console.log('DRAGGING STOPPED')
  },

  // =========================================
  // ROTATE KNOB
  // =========================================

  rotateKnob(knob, direction) {

    console.log('-----------------------------------')

    console.log(
      'ROTATING KNOB:',
      knob.index
    )

    console.log(
      'CURRENT VALUE:',
      knob.value
    )

    console.log(
      'DIRECTION:',
      direction
    )

    knob.value =
      (
        knob.value +
        direction +
        10
      ) % 10

    console.log(
      'NEW VALUE:',
      knob.value
    )

    knob.targetRotation =
      THREE.MathUtils.degToRad(
        -knob.value *
        this.ROTATION_STEP
      )

    console.log(
      'TARGET ROTATION:',
      knob.targetRotation
    )

    this.tickAudio.currentTime = 0

    this.tickAudio.play()
      .catch(() => {

        console.log(
          'TICK AUDIO FAILED'
        )
      })

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

    console.log(
      'CURRENT TOP:',
      this.currentTop
    )

    console.log(
      'CURRENT BOTTOM:',
      this.currentBottom
    )
  },

  // =========================================
  // VALIDATE
  // =========================================

  validatePuzzle() {

    console.log('===================================')
    console.log('VALIDATING PUZZLE')
    console.log('===================================')

    // TOP

    if (

      !this.topSolved &&
      this.checkTopSolved()
    ) {

      console.log(
        'TOP SOLVED'
      )

      this.topSolved = true

      this.solveAudio.play()
        .catch(() => {})

      if (
        window.onPuzzleSolved
      ) {

        window.onPuzzleSolved(
          'top'
        )
      }
    }

    // BOTTOM

    if (

      !this.bottomSolved &&
      this.checkBottomSolved()
    ) {

      console.log(
        'BOTTOM SOLVED'
      )

      this.bottomSolved = true

      this.solveAudio.play()
        .catch(() => {})

      if (
        window.onPuzzleSolved
      ) {

        window.onPuzzleSolved(
          'bottom'
        )
      }
    }

    // BOTH

    if (

      this.topSolved &&
      this.bottomSolved
    ) {

      console.log(
        'ALL PUZZLES SOLVED'
      )

      this.unlockAudio.play()
        .catch(() => {})

      if (
        window.onAllPuzzleSolved
      ) {

        window.onAllPuzzleSolved()
      }
    }
  },

  // =========================================
  // CHECKS
  // =========================================

  checkTopSolved() {

    const result =
      this.currentTop.every(

        (v, i) =>
          v ===
          this.TOP_PASSWORD[i]
      )

    console.log(
      'CHECK TOP RESULT:',
      result
    )

    return result
  },

  checkBottomSolved() {

    const result =
      this.currentBottom.every(

        (v, i) =>
          v ===
          this.BOTTOM_PASSWORD[i]
      )

    console.log(
      'CHECK BOTTOM RESULT:',
      result
    )

    return result
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

        x:
          event.touches[0]
            .clientX,

        y:
          event.touches[0]
            .clientY
      }
    }

    return {

      x: event.clientX,

      y: event.clientY
    }
  },

  // =========================================
  // TICK
  // =========================================

  tick(time, delta) {

    if (!this.knobs) return

    const lerpSpeed =
      Math.min(
        delta * 0.02,
        0.25
      )

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