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
    // WAIT FOR SCENE RENDER
    // ====================================

    this.scene.addEventListener(

      'renderstart',

      () => {

        UIManager.log(
          'RENDER START'
        )

        const canvas =
          this.scene.canvas

        if (!canvas) {

          UIManager.log(
            'NO CANVAS'
          )

          return
        }

        UIManager.log(
          'CANVAS READY'
        )

        canvas.addEventListener(

          'touchstart',

          this.onTouchStart,

          { passive: false }
        )

        canvas.addEventListener(

          'click',

          this.onTouchStart
        )

        UIManager.log(
          'TOUCH EVENTS ATTACHED'
        )
      }
    )
  },


  // ====================================
  // TOUCH START
  // ====================================
    
  onTouchStart(event) {

    UIManager.log(
      'SCREEN TOUCHED'
    )

    // ====================================
    // BASIC STATE CHECK
    // ====================================

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
    // FORCE TEST
    // ====================================

    const firstKnob =
      Object.values(
        PuzzleManager.knobs
      )[0]

    if (!firstKnob) {

      UIManager.log(
        'NO KNOBS FOUND'
      )

      return
    }

    UIManager.log(
      `FORCE ROTATING: ${firstKnob.id}`
    )

    PuzzleManager.rotateKnob(
      firstKnob.id
    )
  },

  onTrackingLost() {

    UIManager.log(
      'INTERACTION SUSPENDED'
    )
  }
}
