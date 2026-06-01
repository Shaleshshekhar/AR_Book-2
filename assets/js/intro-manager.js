window.IntroManager = {

  introStarted: false,

  outroStarted: false,

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

    // ====================================
    // INTRO COMPLETE
    // ====================================

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

        PuzzleManager.activate()

        UIManager.showMessage(
          'Decrypt the locker'
        )
      }
    )

    // ====================================
    // OUTRO COMPLETE
    // ====================================

    this.outroVideo.addEventListener(

      'ended',

      () => {

        UIManager.showMessage(
          'Transmission Complete'
        )

        APP.phase = 'complete'

        UIManager.log(
          'EXPERIENCE COMPLETE'
        )

        // ====================================
        // OPTIONAL REDIRECT LATER
        // ====================================
      }
    )
  },

  // ====================================
  // TARGET FOUND
  // ====================================

  onTargetFound() {

    // ====================================
    // INTRO
    // ====================================

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

    // ====================================
    // OUTRO
    // ====================================

    if (
      APP.phase === 'outro'
    ) {

      this.outroVideo.play()
    }
  },

  // ====================================
  // TARGET LOST
  // ====================================

  onTargetLost() {

    if (
      APP.phase === 'intro'
    ) {

      this.introVideo.pause()
    }

    if (
      APP.phase === 'outro'
    ) {

      this.outroVideo.pause()
    }
  },

  // ====================================
  // PLAY OUTRO
  // ====================================

  playOutro() {

    if (
      this.outroStarted
    ) return

    this.outroStarted = true

    UIManager.log(
      'PLAYING OUTRO'
    )

    APP.phase = 'outro'

    // ====================================
    // HIDE LOCKER
    // ====================================

    this.model.setAttribute(
      'visible',
      false
    )

    // ====================================
    // SHOW OUTRO
    // ====================================

    this.outroPlane.setAttribute(
      'visible',
      true
    )

    this.outroVideo.currentTime = 0

    this.outroVideo.play()
  }
}
