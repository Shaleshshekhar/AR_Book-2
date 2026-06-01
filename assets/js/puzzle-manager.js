window.PuzzleManager = {

  knobs: {},

  active: false,

  rotationStep: 36,

  // ====================================
  // PASSWORDS
  // ====================================

  topPassword:
    [1,1,2,3,5],

  bottomPassword:
    [8,1,3,2,1],

  topSolved: false,

  bottomSolved: false,

  activate() {

    UIManager.log(
      'PUZZLE ACTIVATED'
    )

    this.active = true

    this.topSolved = false

    this.bottomSolved = false

    this.setupKnobs()

    this.randomizeKnobs()
  },

  init() {

    console.log(
      'PuzzleManager INIT'
    )
  },

  // ====================================
  // SETUP KNOBS
  // ====================================

  setupKnobs() {

    this.knobs = {}

    const model =
      document
        .querySelector(
          '#lockerModel'
        )
        .getObject3D('mesh')

    if (!model) {

      UIManager.log(
        'MODEL NOT READY'
      )

      return
    }

    UIManager.log(
      'SETTING UP KNOBS'
    )

    model.traverse(child => {

      if (
        child.name.startsWith(
          'Code_'
        )
      ) {

        const id =
          child.name.replace(
            'Code_',
            ''
          )

        this.knobs[id] = {

          id,

          mesh: child,

          value: 0,

          currentRotation: 0,

          targetRotation: 0,

          rotating: false,

          queue: []
        }

        UIManager.log(
          `REGISTERED: ${id}`
        )
      }
    })

    UIManager.log(
      `TOTAL KNOBS: ${
        Object.keys(
          this.knobs
        ).length
      }`
    )
  },

  // ====================================
  // RANDOMIZE
  // ====================================

  randomizeKnobs() {

    UIManager.log(
      'RANDOMIZING KNOBS'
    )

    let valid = false

    while (!valid) {

      Object.values(
        this.knobs
      ).forEach(knob => {

        const value =
          Math.floor(
            Math.random() * 10
          )

        knob.value = value

        const rotation =
          -value *
          THREE.MathUtils.degToRad(
            this.rotationStep
          )

        knob.currentRotation =
          rotation

        knob.targetRotation =
          rotation

        knob.mesh.rotation.y =
          rotation
      })

      const topCorrect =
        this.checkTopRow()

      const bottomCorrect =
        this.checkBottomRow()

      if (
        !topCorrect &&
        !bottomCorrect
      ) {

        valid = true
      }
    }

    UIManager.log(
      'VALID START STATE'
    )
  },

  // ====================================
  // ROTATE KNOB
  // ====================================

  rotateKnob(id) {

    const knob =
      this.knobs[id]

    if (!knob)
      return

    // ====================================
    // LOCK SOLVED ROWS
    // ====================================

    const knobNumber =
      parseInt(id)

    const isTop =
      knobNumber <= 5

    const isBottom =
      knobNumber >= 6

    if (
      isTop &&
      this.topSolved
    ) {

      UIManager.log(
        'TOP ROW LOCKED'
      )

      return
    }

    if (
      isBottom &&
      this.bottomSolved
    ) {

      UIManager.log(
        'BOTTOM ROW LOCKED'
      )

      return
    }

    // ====================================
    // VALUE UPDATE
    // ====================================

    knob.value =
      (knob.value + 1) % 10

    // ====================================
    // TARGET ROTATION
    // ====================================

    knob.targetRotation =
      -knob.value *
      THREE.MathUtils.degToRad(
        this.rotationStep
      )

    knob.queue.push(
      knob.targetRotation
    )

    UIManager.log(
      `KNOB ${id}: ${knob.value}`
    )

    AudioManager.playTick()

    if (!knob.rotating) {

      this.processQueue(
        knob
      )
    }
  },

  // ====================================
  // PROCESS ROTATION QUEUE
  // ====================================

  processQueue(knob) {

    if (!knob.queue.length) {

      knob.rotating = false

      // ====================================
      // VALIDATE AFTER MOTION
      // ====================================

      this.validatePuzzle()

      return
    }

    knob.rotating = true

    const target =
      knob.queue.shift()

    const start =
      knob.currentRotation

    const duration = 120

    const startTime =
      performance.now()

    const animate =
      now => {

        const elapsed =
          now - startTime

        const t =
          Math.min(
            elapsed / duration,
            1
          )

        const eased =
          1 -
          Math.pow(
            1 - t,
            3
          )

        const rotation =
          THREE.MathUtils.lerp(
            start,
            target,
            eased
          )

        knob.mesh.rotation.y =
          rotation

        knob.currentRotation =
          rotation

        if (t < 1) {

          requestAnimationFrame(
            animate
          )

        } else {

          knob.mesh.rotation.y =
            target

          knob.currentRotation =
            target

          this.processQueue(
            knob
          )
        }
      }

    requestAnimationFrame(
      animate
    )
  },

  // ====================================
  // GET CURRENT ROWS
  // ====================================

  getTopRow() {

    return [

      this.knobs['01'].value,
      this.knobs['02'].value,
      this.knobs['03'].value,
      this.knobs['04'].value,
      this.knobs['05'].value
    ]
  },

  getBottomRow() {

    return [

      this.knobs['06'].value,
      this.knobs['07'].value,
      this.knobs['08'].value,
      this.knobs['09'].value,
      this.knobs['10'].value
    ]
  },

  // ====================================
  // VALIDATION
  // ====================================

  arraysMatch(a, b) {

    return a.every(
      (value, index) =>
        value === b[index]
    )
  },

  checkTopRow() {

    return this.arraysMatch(

      this.getTopRow(),

      this.topPassword
    )
  },

  checkBottomRow() {

    return this.arraysMatch(

      this.getBottomRow(),

      this.bottomPassword
    )
  },

  // ====================================
  // MAIN VALIDATION
  // ====================================

  validatePuzzle() {

    // ====================================
    // TOP
    // ====================================

    if (
      !this.topSolved &&
      this.checkTopRow()
    ) {

      this.topSolved = true

      UIManager.showMessage(
        'Lab Code Accepted'
      )

      AudioManager.playSolved()

      UIManager.log(
        'TOP SOLVED'
      )
    }

    // ====================================
    // BOTTOM
    // ====================================

    if (
      !this.bottomSolved &&
      this.checkBottomRow()
    ) {

      this.bottomSolved = true

      UIManager.showMessage(
        'Security Override Accepted'
      )

      AudioManager.playSolved()

      UIManager.log(
        'BOTTOM SOLVED'
      )
    }

    // ====================================
    // FULL PUZZLE
    // ====================================

    if (
      this.topSolved &&
      this.bottomSolved
    ) {

      UIManager.showMessage(
        'LOCKER UNLOCKED'
      )

      AudioManager.playUnlock()

      UIManager.log(
        'FULL PUZZLE SOLVED'
      )

      // NEXT PHASE LATER
    }
  }
}
