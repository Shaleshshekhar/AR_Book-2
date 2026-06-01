window.PuzzleManager = {

  knobs: {},

  active: false,

  rotationStep: 36,

  activate() {

    console.log(
      'PUZZLE ACTIVATED'
    )

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

      UIManager.log(
        `${child.name}`
      )

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

        this.knobs[id] = {

          id,

          mesh: child,

          value: 0,

          currentRotation: 0,

          targetRotation: 0,

          rotating: false,

          queue: [],

          baseRotationX:
            child.rotation.x,

          baseRotationY:
            child.rotation.y,

          baseRotationZ:
            child.rotation.z

        }

        UIManager.log(
          `REGISTERED: ${id}`
        )
      }
    })
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

      // ====================================
      // ROTATION VALUE
      // ====================================

      knob.currentRotation =
        -value *
        THREE.MathUtils.degToRad(
          this.rotationStep
        )

      knob.targetRotation =
        knob.currentRotation

      // ====================================
      // APPLY ROTATION
      // PRESERVE IMPORTED AXES
      // ====================================

      knob.mesh.rotation.set(

        knob.baseRotationX,

        knob.baseRotationY +
          knob.currentRotation,

        knob.baseRotationZ
      )

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
    // VALUE
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

    if (!knob.rotating) {

      this.processQueue(
        knob
      )
    }
  },

  // ====================================
  // PROCESS QUEUE
  // ====================================

  processQueue(knob) {

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

        // ====================================
        // PRESERVE IMPORTED ROTATION
        // ====================================

        knob.mesh.rotation.set(

          knob.baseRotationX,

          knob.baseRotationY +
            rotation,

          knob.baseRotationZ
        )

        knob.currentRotation =
          rotation

        if (t < 1) {

          requestAnimationFrame(
            animate
          )

        } else {

          knob.mesh.rotation.set(

            knob.baseRotationX,

            knob.baseRotationY +
              target,

            knob.baseRotationZ
          )

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
  }

}
