window.TrackingManager = {

  init() {

    console.log(
      'TrackingManager INIT'
    )

    const scene =
      document.querySelector(
        'a-scene'
      )

    scene.addEventListener(

      'xrimagefound',

      () => {

        console.log(
          'TARGET FOUND'
        )

        APP.tracking = true

        UIManager.hideMessage()

        IntroManager.onTargetFound()
      }
    )

    scene.addEventListener(

      'xrimagelost',

      () => {

        console.log(
          'TARGET LOST'
        )

        APP.tracking = false

        UIManager.showMessage(
          'Re-scan the book'
        )

        IntroManager.onTargetLost()

        InteractionManager.onTrackingLost()
      }
    )
  }
}