
window.InteractionManager = {

  init() {

    console.log(
      'InteractionManager INIT'
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

    console.log(
      'REGISTERING RENDERSTART'
    )

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
        // PRELOAD EXPERIENCE ASSETS
        // ====================================

        const introVideo =
          document.querySelector(
            '#introVideo'
          )

        const outroVideo =
          document.querySelector(
            '#outroVideo'
          )

        const lockerModel =
          document.querySelector(
            '#lockerModel'
          )

        introVideo.src =
          './assets/intro_video.mp4'

        outroVideo.src =
          './assets/outro_video.mp4'

        lockerModel.setAttribute(
          'gltf-model',
          './assets/locker.glb'
        )

        // ====================================
        // ENABLE SPLASH CTA
        // ====================================

        const button =
          document.querySelector(
            '#startButton'
          )

        const buttonText =
          document.querySelector(
            '#buttonText'
          )

        const loadingDots =
          document.querySelector(
            '#loadingDots'
          )

        if (
          button &&
          buttonText &&
          loadingDots
        ) {

          Promise.all([

          new Promise(resolve => {

            introVideo.addEventListener(
              'loadeddata',
              resolve,
              { once:true }
            )
          }),

          new Promise(resolve => {

            outroVideo.addEventListener(
              'loadeddata',
              resolve,
              { once:true }
            )
          }),

          new Promise(resolve => {

            lockerModel.addEventListener(
              'model-loaded',
              resolve,
              { once:true }
            )
          })

        ]).then(() => {

          console.log(
            'ALL ASSETS READY'
          )

          button.disabled = false

          buttonText.innerText =
            'START EXPERIENCE'

          loadingDots.style.display =
            'none'
        })
        }

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
    // STATE
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

    if (
      PuzzleManager.completed
    ) return

    // ====================================
    // TOUCH
    // ====================================

    const touch =
      event.touches[0]

    this.mouse.x =
      (touch.clientX / window.innerWidth) * 2 - 1

    this.mouse.y =
      -(touch.clientY / window.innerHeight) * 2 + 1

    // ====================================
    // CAMERA
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

    if (!intersects.length)
      return

    // ====================================
    // HIT OBJECT
    // ====================================

    let target =
      intersects[0].object

    let knob = null

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
