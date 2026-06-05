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
        // FADE OUT
        // ====================================

        const fade =
          document.querySelector(
            '#fadeOverlay'
          )

        if (fade) {

          fade.classList.add(
            'visible'
          )
        }

        // ====================================
        // REDIRECT TERMINAL
        // ====================================

        setTimeout(() => {

          const redirectScreen =
            document.querySelector(
              '#redirectScreen'
            )

          const redirectText =
            document.querySelector(
              '#redirectText'
            )

          redirectScreen.classList.add(
            'visible'
          )

          const message =
            "Redirecting to Ethan Cain's Personal Computer..."

          let index = 0

          const typeInterval =
            setInterval(() => {

              const visibleText =
                message.slice(
                  0,
                  index
                )

              redirectText.innerHTML =

                `${visibleText}<span id="redirectCursor">|</span>`

              index++

              if (
                index > message.length
              ) {

                clearInterval(
                  typeInterval
                )

                setTimeout(() => {

                  window.location.href =
                    'https://www.ryanpote.com/memento-mori'

                }, 1200)
              }

            }, 32)

        }, 850)

              }
            )
          },

// ====================================
  // TARGET FOUND
  // ====================================
  onTargetFound() {
    // If the user is still on the splash screen, don't play or show anything yet
    if (APP.phase === 'splash') {
      console.log('Target anchored by engine, holding playback until splash is cleared.')
      return
    }

    // Normal intro playback logic
    if (APP.phase === 'intro') {
      this.introVideo.play()
    }

    if (!this.introStarted) {
      this.introStarted = true
      APP.phase = 'intro'
      this.introPlane.setAttribute('visible', true)
      this.introVideo.play()
    }

    // Normal outro playback logic
    if (APP.phase === 'outro') {
      this.outroVideo.play()
    }
  },

  // ====================================
  // TARGET LOST
  // ====================================
  onTargetLost() {
    if (APP.phase === 'splash') return // Do nothing if we're still on splash

    if (APP.phase === 'intro') {
      this.introVideo.pause()
    }

    if (APP.phase === 'outro') {
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
