window.PuzzleManager = {

  knobs: {},

  active: false,

  rotationStep: 36,

  activate() {

    console.log(
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
  // KNOB SETUP
  // ====================================

  setupKnobs() {

    const model =
      document
        .querySelector(
          '#lockerModel'
        )
        .getObject3D('mesh')

    if (!model) {

      console.log(
        'MODEL NOT READY'
      )

      return
    }

    console.log(
      'SETTING UP KNOBS'
    )

    model.traverse(child => {

    UIManager.log( `${child.name} : ${child.type}` )
      // ====================================
      // HIDE HIT MESHES
      // ====================================

      if (
        child.material &&
        child.material.name ===
        'hitMesh_mat'
      ) {

        child.material.transparent =
          true

        child.material.opacity = 0.001
        child.material.depthWrite = false
      }

      // ====================================
      // REGISTER KNOBS
      // ====================================

      if (
        child.name.startsWith(
          'Hit_Code_'
        )
      ) {

        const id =
          child.name.replace(
            'Hit_Code_',
            ''
          )

        const codeMesh =
          model.getObjectByName(
            `Code_${id}`
          )

        this.knobs[id] = {

          id,

          value: 0,

          hitMesh: child,

          mesh: codeMesh,

          targetRotation: 0,

          currentRotation: 0,

          rotationQueue: [],

          rotating: false
        }

        console.log(
          `KNOB REGISTERED ${id}`
        )
      }
    })
  },

  // ====================================
  // RANDOMIZE
  // ====================================

  randomizeKnobs() {

    console.log(
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

      knob.currentRotation =
        -value *
        THREE.MathUtils.degToRad(
          this.rotationStep
        )

      knob.targetRotation =
        knob.currentRotation

      knob.mesh.rotation.y =
        knob.currentRotation

      UIManager.log(
        `KNOB ${knob.id}: ${value}`
      )
    })
  },

  // ====================================
  // ROTATE KNOB
  // ====================================

  rotateKnob(id, direction) {

    const knob =
      this.knobs[id]

    if (!knob) return

    // ====================================
    // VALUE UPDATE
    // ====================================

    knob.value =
      (
        knob.value +
        direction +
        10
      ) % 10

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

    knob.rotationQueue.push(
      knob.targetRotation
    )

    AudioManager.playTick()

    console.log(
      `KNOB ${id} VALUE:`,
      knob.value
    )

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

    if (
      !knob.rotationQueue.length
    ) {

      knob.rotating = false

      return
    }

    knob.rotating = true

    const target =
      knob.rotationQueue.shift()

    const start =
      knob.currentRotation

    const duration = 100

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

        // EASE

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

          knob.currentRotation =
            target

          knob.mesh.rotation.y =
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
