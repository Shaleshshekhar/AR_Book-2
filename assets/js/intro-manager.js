window.IntroManager = {

  introStarted: false,

  init() {

    console.log(
      'IntroManager INIT'
    )

    this.introVideo =
      document.querySelector(
        '#introVideo'
      )

    this.outroVideo =
      document.querySelector(
        '#outroVideo'
      )

    this.introPlane =
      document.querySelector(
        '#introPlane'
      )

    this.outroPlane =
      document.querySelector(
        '#outroPlane'
      )

    this.model =
      document.querySelector(
        '#lockerModel'
      )

    this.introVideo.addEventListener(

      'ended',

      () => {

        console.log(
          'INTRO COMPLETE'
        )

        this.introPlane.setAttribute(
          'visible',
          false
        )

        this.model.setAttribute(
          'visible',
          true
        )

        APP.phase = 'locker'

        // ====================================
        // ACTIVATE PUZZLE
        // ====================================

        PuzzleManager.activate()

        UIManager.showMessage(
          'Decrypt the locker'
        )
      }
    )
  },

  onTargetFound() {

    if (
      APP.phase === 'intro'
    ) {

      this.introVideo.play()
    }

    if (
      !this.introStarted
    ) {

      this.introStarted = true

      APP.phase = 'intro'

      this.introPlane.setAttribute(
        'visible',
        true
      )

      this.introVideo.play()
    }

    if (
      APP.phase === 'outro'
    ) {

      this.outroVideo.play()
    }
  },

  onTargetLost() {

    this.introVideo.pause()
    this.outroVideo.pause()
  },

  playOutro() {

    APP.phase = 'outro'

    this.model.setAttribute(
      'visible',
      false
    )

    this.outroPlane.setAttribute(
      'visible',
      true
    )

    this.outroVideo.play()
  }
}