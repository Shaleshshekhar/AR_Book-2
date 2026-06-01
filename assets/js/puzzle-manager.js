window.PuzzleManager = {

  knobs: {},

  active: false,

  rotationStep: 36,

  activate() {

    UIManager.log(
      'PUZZLE ACTIVATED'
    )

    this.active = true

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

    // RESET
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

      // ====================================
      // REGISTER KNOBS
      // ====================================

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

        // ====================================
        // RESET ROTATION
        // IMPORTANT
        // ====================================

        child.rotation.y = 0

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

      UIManager.log(
        `KNOB ${knob.id}: ${value}`
      )
    })
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

    // ====================================
    // QUEUE
    // ====================================

    knob.queue.push(
      knob.targetRotation
    )

    UIManager.log(
      `KNOB ${id}: ${knob.value}`
    )

    AudioManager.playTick()

    // ====================================
    // START TWEEN
    // ====================================

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

    // ====================================
    // END
    // ====================================

    if (!knob.queue.length) {

      knob.rotating = false

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

        // ====================================
        // EASE
        // ====================================

        const eased =
          1 -
          Math.pow(
            1 - t,
            3
          )

        // ====================================
        // INTERPOLATE
        // ====================================

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

        // ====================================
        // CONTINUE
        // ====================================

        if (t < 1) {

          requestAnimationFrame(
            animate
          )

        } else {

          // FINAL SNAP

          knob.mesh.rotation.y =
            target

          knob.currentRotation =
            target

          // NEXT QUEUED ROTATION

          this.processQueue(
            knob
          )
        }
      }

    requestAnimationFrame(
      animate
    )
  }
}
