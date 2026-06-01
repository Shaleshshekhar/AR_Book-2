window.InteractionManager = {

  init() {

    console.log(
      'InteractionManager INIT'
    )

    this.camera =
      document.querySelector(
        '[camera]'
      )

    this.model =
      document.querySelector(
        '#lockerModel'
      )

    this.raycaster =
      new THREE.Raycaster()

    this.mouse =
      new THREE.Vector2()

    this.onTouchStart =
      this.onTouchStart.bind(this)

    window.addEventListener(

      'touchstart',

      this.onTouchStart,

      { passive: false }
    )
  },

  // ====================================
  // TOUCH START
  // ====================================

  onTouchStart(event) {

    UIManager.log(
      'TOUCH START'
    )

    UIManager.log(
      `PHASE: ${APP.phase}`
    )

    UIManager.log(
      `TRACKING: ${APP.tracking}`
    )

    UIManager.log(
      `PUZZLE ACTIVE: ${PuzzleManager.active}`
    )

    // ====================================
    // PHASE CHECK
    // ====================================

    if (
      APP.phase !== 'locker'
    ) {

      UIManager.log(
        'BLOCKED: NOT LOCKER PHASE'
      )

      return
    }

    // ====================================
    // TRACKING CHECK
    // ====================================

    if (
      !APP.tracking
    ) {

      UIManager.log(
        'BLOCKED: TRACKING FALSE'
      )

      return
    }

    // ====================================
    // PUZZLE CHECK
    // ====================================

    if (
      !PuzzleManager.active
    ) {

      UIManager.log(
        'BLOCKED: PUZZLE INACTIVE'
      )

      return
    }

    UIManager.log(
      'INTERACTION ALLOWED'
    )

    const touch =
      event.touches[0]

    this.mouse.x =
      (touch.clientX / window.innerWidth) * 2 - 1

    this.mouse.y =
      -(touch.clientY / window.innerHeight) * 2 + 1

    // ====================================
    // CAMERA CHECK
    // ====================================

    UIManager.log(
      `CAMERA EXISTS: ${
        !!this.camera
      }`
    )

    UIManager.log(
      `CAMERA CHILDREN: ${
        this.camera.object3D.children.length
      }`
    )

    this.raycaster.setFromCamera(

      this.mouse,

      this.camera.object3D.children[0]
    )

    // ====================================
    // MESHES
    // ====================================

    const meshes =
      Object.values(
        PuzzleManager.knobs
      ).map(
        knob => knob.mesh
      )

    UIManager.log(
      `KNOB COUNT: ${meshes.length}`
    )

    const intersects =
      this.raycaster.intersectObjects(
        meshes,
        true
      )

    UIManager.log(
      `INTERSECTS: ${intersects.length}`
    )

    if (!intersects.length) {

      UIManager.log(
        'NO INTERSECTION'
      )

      return
    }

    const hit =
      intersects[0].object

    UIManager.log(
      `HIT: ${hit.name}`
    )

    const knob =
      Object.values(
        PuzzleManager.knobs
      ).find(
        k =>
          k.mesh === hit
      )

    if (!knob) {

      UIManager.log(
        'KNOB NOT FOUND'
      )

      return
    }

    UIManager.log(
      `ROTATING: ${knob.id}`
    )

    PuzzleManager.rotateKnob(
      knob.id
    )
  },

  onTrackingLost() {

    UIManager.log(
      'INTERACTION SUSPENDED'
    )
  }
}
