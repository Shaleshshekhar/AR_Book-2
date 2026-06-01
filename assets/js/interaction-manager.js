window.InteractionManager = {

  init() {

    console.log(
      'InteractionManager INIT'
    )

    this.camera =
      document.querySelector(
        '[camera]'
      )

    this.scene =
      document.querySelector(
        'a-scene'
      )

    this.raycaster =
      new THREE.Raycaster()

    this.mouse =
      new THREE.Vector2()

    this.onTouchStart =
      this.onTouchStart.bind(this)

    // ====================================
    // WAIT FOR XR CANVAS
    // ====================================

    this.scene.addEventListener(

      'renderstart',

      () => {

        const canvas =
          this.scene.canvas

        if (!canvas) {

          console.log(
            'NO CANVAS'
          )

          return
        }

        console.log(
          'XR CANVAS READY'
        )

        // ====================================
        // TOUCH ONLY
        // ====================================

        canvas.addEventListener(

          'touchstart',

          this.onTouchStart,

          { passive: false }
        )
      }
    )
  },

  // ====================================
  // TOUCH START
  // ====================================

  onTouchStart(event) {

    event.preventDefault()

    // ====================================
    // STATE CHECKS
    // ====================================

    if (
      APP.phase !== 'locker'
    ) return

    if (
      !APP.tracking
    ) return

    if (
      !PuzzleManager.active
    ) return

    // ====================================
    // TOUCH POSITION
    // ====================================

    const touch =
      event.touches[0]

    this.mouse.x =
      (touch.clientX / window.innerWidth) * 2 - 1

    this.mouse.y =
      -(touch.clientY / window.innerHeight) * 2 + 1

    // ====================================
    // ACTIVE CAMERA
    // ====================================

    const camera =
     this.scene.camera 
     
     if (!camera) 
      return
    // ====================================
    // RAYCAST
    // ====================================

    this.raycaster.setFromCamera(

      this.mouse,

      camera
    )

    const meshes =
      Object.values(
        PuzzleManager.knobs
      ).map(
        knob => knob.mesh
      )

    const intersects =
      this.raycaster.intersectObjects(
        meshes,
        true
      )

    // ====================================
    // NO HIT
    // ====================================

    if (!intersects.length)
      return

    // ====================================
    // HIT OBJECT
    // ====================================

    let target =
      intersects[0].object

    let knob = null

    // ====================================
    // FIND PARENT KNOB
    // ====================================

    while (
      target &&
      !knob
    ) {

      knob =
        Object.values(
          PuzzleManager.knobs
        ).find(
          k =>
            k.mesh === target
        )

      target =
        target.parent
    }

    // ====================================
    // INVALID
    // ====================================

    if (!knob)
      return

    // ====================================
    // ROTATE
    // ====================================

    PuzzleManager.rotateKnob(
      knob.id
    )
  }
}
