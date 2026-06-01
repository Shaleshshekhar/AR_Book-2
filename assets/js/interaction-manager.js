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

    this.onTouch =
      this.onTouch.bind(this)

    window.addEventListener(

      'touchstart',

      this.onTouch,

      { passive: false }
    )
  },

  onTouch(event) {

    if (
      APP.phase !== 'locker'
    ) return

    if (
      !APP.tracking
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

    const mesh =
      this.model.getObject3D('mesh')

    if (!mesh) return

    const intersects =
      this.raycaster.intersectObject(
        mesh,
        true
      )

    if (!intersects.length) return

    console.log(
      'LOCKER TOUCHED'
    )

    IntroManager.playOutro()
  },

  onTrackingLost() {

    console.log(
      'INTERACTION SUSPENDED'
    )
  }
}