window.InteractionManager = {

  activeKnob: null,

  dragging: false,

  startY: 0,

  accumulatedDelta: 0,

  threshold: 30,

  init() {

    console.log(
      'InteractionManager INIT'
    )

    this.camera =
      document.querySelector(
        '[camera]'
      )

    this.raycaster =
      new THREE.Raycaster()

    this.mouse =
      new THREE.Vector2()

    this.onTouchStart =
      this.onTouchStart.bind(this)

    this.onTouchMove =
      this.onTouchMove.bind(this)

    this.onTouchEnd =
      this.onTouchEnd.bind(this)

    window.addEventListener(

      'touchstart',

      this.onTouchStart,

      { passive: false }
    )

    window.addEventListener(

      'touchmove',

      this.onTouchMove,

      { passive: false }
    )

    window.addEventListener(

      'touchend',

      this.onTouchEnd,

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

    if (
      this.dragging
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

    const meshes =
      Object.values(
        PuzzleManager.knobs
      ).map(
        knob => knob.hitMesh
      )

    const intersects =
      this.raycaster.intersectObjects(
        meshes,
        true
      )

    if (!intersects.length)
      return

    const hit =
      intersects[0].object

    const knob =
      Object.values(
        PuzzleManager.knobs
      ).find(
        k =>
          k.hitMesh === hit
      )

    if (!knob) return

    console.log(
      'ACTIVE KNOB:',
      knob.id
    )

    this.activeKnob =
      knob

    this.dragging = true

    this.startY =
      touch.clientY

    this.accumulatedDelta = 0
  },

  // ====================================
  // TOUCH MOVE
  // ====================================

  onTouchMove(event) {

    if (
      !this.dragging
    ) return

    event.preventDefault()

    const touch =
      event.touches[0]

    const deltaY =
      touch.clientY -
      this.startY

    this.accumulatedDelta +=
      deltaY

    this.startY =
      touch.clientY

    // ====================================
    // MULTI STEP
    // ====================================

    while (
      Math.abs(
        this.accumulatedDelta
      ) >= this.threshold
    ) {

      // SWIPE DOWN

      if (
        this.accumulatedDelta > 0
      ) {

        PuzzleManager.rotateKnob(
          this.activeKnob.id,
          1
        )

        this.accumulatedDelta -=
          this.threshold
      }

      // SWIPE UP

      else {

        PuzzleManager.rotateKnob(
          this.activeKnob.id,
          -1
        )

        this.accumulatedDelta +=
          this.threshold
      }
    }
  },

  // ====================================
  // TOUCH END
  // ====================================

  onTouchEnd() {

    this.dragging = false

    this.activeKnob = null

    this.accumulatedDelta = 0
  },

  onTrackingLost() {

    console.log(
      'INTERACTION SUSPENDED'
    )

    this.dragging = false

    this.activeKnob = null
  }
}
