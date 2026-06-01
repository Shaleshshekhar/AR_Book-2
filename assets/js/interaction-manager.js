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

    if (
      APP.phase !== 'locker'
    ) return

    if (
      !APP.tracking
    ) return

    if (
      !PuzzleManager.active
    ) return

    const touch =
      event.touches[0]

    this.mouse.x =
      (touch.clientX / window.innerWidth) * 2 - 1

    this.mouse.y =
      -(touch.clientY / window.innerHeight) * 2 + 1

    this.raycaster.setFromCamera(

      this.mouse,

      this.camera.object3D.children[0]
    )

    // ====================================
    // KNOB MESHES
    // ====================================

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

    UIManager.log(
      `INTERSECTS: ${intersects.length}`
    )

    if (!intersects.length)
      return

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

    if (!knob)
      return

    UIManager.log(
      `ACTIVE KNOB: ${knob.id}`
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
