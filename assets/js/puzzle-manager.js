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
  },

  // ====================================
  // RANDOMIZE
  // ====================================

  randomizeKnobs() {

    Object.values(
      this.knobs
    ).forEach(knob => {

      const value =
        Math.floor(
          Math.random() * 10
        )

      knob.value = value

      knob.currentRotation =
        -value *
        THREE.MathUtils.degToRad(
          this.rotationStep
        )

      knob.targetRotation =
        knob.currentRotation

      knob.mesh.rotation.y =
        knob.currentRotation
    })
  },

  // ====================================
  // ROTATE
  // ====================================

  rotateKnob(id) {

    const knob =
      this.knobs[id]

    if (!knob)
      return

    knob.value =
      (knob.value + 1) % 10

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
  }
}
